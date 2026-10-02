/*
 * A pick restyles the page where the visitor is.
 *
 * Joshua (2026-10-01): a pick in the Look panel has to restyle the page wherever he is scrolled to.
 * Nothing here scrolls on a pick, but a layout, preset, type or logo pick changes heights above and
 * around the screen, and browsers keep the place their own way (Chrome's anchor slips when the layout
 * changes, Safari keeps none). So the reader's line, just under the site's header, holds still while the
 * new look, its fonts and its logo settle. The line sits under any header pinned at the top, a floating
 * pill nav included. What sits on that line keeps its place on screen: its top, or, in text that starts
 * above the screen, the character on the line (so a paragraph that a new face rewraps stays put where it is
 * being read, not at a top far out of sight). When that content starts above the line inside a block that
 * is mostly above it and ends in the top third of the screen (the tail of a long quote, a hero or a tall
 * photo mostly above the screen), the outermost such block keeps its bottom instead, so what fills most of
 * the screen, below it, stays. When the new look hides any of them, the nearest box around it stands in.
 * Places are read as laid out, before any transform: a reveal replaying its entrance, a hover zoom or a
 * parallax moves what is drawn, not the page, so the hold never chases an animation. It is put back every
 * frame and whenever the page resizes (a ResizeObserver, so a late change from the site's own scripts
 * can't show for a frame). The browser's own scroll anchoring and smooth scrolling are off for the hold,
 * and a wheel, touch, press or key outside the panel lets go at once. At the very top the page stays at
 * the top.
 * (The same hold as the AERIOX offer engine, aeriox-app#110.)
 *
 * Use: holdPlace(panelSelector) before the look changes the page, settle() right after.
 */

type Mark = { el: Element; top: number; text?: Text; at?: number; bottom?: boolean };
type Held = { marks: Mark[]; raf: number; ro: ResizeObserver | null; panel: string; anchor: string; behavior: string };

let held: Held | null = null;
let range: Range | null = null;
const INTENT = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
// Content a reader sees: text, or a picture, a video or a form field.
const REPLACED = /^(img|video|canvas|svg|iframe|input|textarea|select|object|embed)$/i;

function scrollTopNow() {
  return window.scrollY || window.pageYOffset || 0;
}

function scrollToY(y: number) {
  const x = window.scrollX || window.pageXOffset || 0;
  try {
    window.scrollTo({ top: y, left: x, behavior: "instant" as ScrollBehavior });
  } catch {
    window.scrollTo(x, y);
  }
}

function pinned(node: Element) {
  for (let p: Element | null = node; p && p !== document.body; p = p.parentElement) {
    const pos = getComputedStyle(p).position;
    if (pos === "fixed" || pos === "sticky") return true;
  }
  return false;
}

/* How a box's own transform (with the translate and scale properties Tailwind 4 uses) moves what it draws
   down the screen: y -> scale * y + shift, y measured from the box's top; null when it moves nothing.
   A rotation, rare in a reveal, is left out. */
function moveOf(el: Element, cs: CSSStyleDeclaration): [number, number] | null {
  const s = cs as CSSStyleDeclaration & { translate?: string; scale?: string };
  const t = cs.transform, tr = s.translate || "", sc = s.scale || "";
  const hasT = !!t && t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)";
  const hasTr = tr !== "" && tr !== "none" && !/^(\s*0(px|%)?)+\s*$/.test(tr);
  const hasSc = sc !== "" && sc !== "none" && !/^(\s*1)+\s*$/.test(sc);
  if (!hasT && !hasTr && !hasSc) return null;
  let d = 1, f = 0;
  if (hasT) {
    const v = t.slice(t.indexOf("(") + 1, -1).split(",").map(parseFloat);
    if (v.length === 6) { d = v[3]; f = v[5]; }
    else if (v.length === 16) { d = v[5]; f = v[13]; }
  }
  let ty = 0;
  if (hasTr) {
    const p = tr.trim().split(/\s+/)[1] || "0";
    ty = /%$/.test(p) ? (parseFloat(p) / 100) * ((el as HTMLElement).offsetHeight || 0) : parseFloat(p) || 0;
  }
  let sy = 1;
  if (hasSc) {
    const p = sc.trim().split(/\s+/);
    const v = p[1] || p[0];
    sy = /%$/.test(v) ? parseFloat(v) / 100 : parseFloat(v);
    if (!isFinite(sy)) sy = 1;
  }
  const k = sy * d;
  if (!isFinite(k) || Math.abs(k) < 0.01 || !isFinite(f) || !isFinite(ty)) return null;
  const oy = parseFloat((cs.transformOrigin || "").split(" ")[1]) || 0;
  return [k, oy * (1 - k) + ty + sy * f];
}

/* Where a point of el that is at y on screen now sits as laid out, with every transform on el and the
   boxes around it taken off. */
function laidOut(el: Element, y: number): number {
  const chain: Element[] = [];
  for (let n: Element | null = el; n && n !== document.documentElement; n = n.parentElement) chain.push(n);
  let c = 0, m = 1; // laid out = c + m * on screen
  for (let i = chain.length - 1; i >= 0; i--) {
    const mv = moveOf(chain[i], getComputedStyle(chain[i]));
    if (!mv) continue;
    const at = c + m * chain[i].getBoundingClientRect().top;
    c = at - mv[1] + (c - at) / mv[0];
    m = m / mv[0];
  }
  return c + m * y;
}

/* The box of one character of a text (null when it draws nothing). */
function charBox(text: Text, at: number): DOMRect | null {
  if (!range) range = document.createRange();
  range.setStart(text, at);
  range.setEnd(text, at + 1);
  const b = range.getBoundingClientRect();
  return b.height ? b : null;
}

/* The first character of el's own text on the reader's line, or after it. */
function lineChar(el: Element, y: number): { text: Text; at: number } | null {
  for (let n = el.firstChild; n; n = n.nextSibling) {
    if (n.nodeType !== 3) continue;
    const t = n as Text, s = t.data, idx: number[] = [];
    for (let i = 0; i < s.length && idx.length < 20000; i++) {
      const c = s.charCodeAt(i);
      if (c > 32 && (c < 0xd800 || c > 0xdfff)) idx.push(i);
    }
    let lo = 0, hi = idx.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const b = charBox(t, idx[mid]);
      if (b && b.bottom > y) hi = mid;
      else lo = mid + 1;
    }
    if (lo < idx.length && charBox(t, idx[lo])) return { text: t, at: idx[lo] };
  }
  return null;
}

/* The bottom of the site's header while it stays on screen: a fixed or sticky header, nav or banner whose
   top is near the top of the screen (a floating pill nav sits a little below the edge). */
function headerBottom(panel: string) {
  const band = Math.max(48, window.innerHeight * 0.1);
  let bottom = 0;
  document.querySelectorAll("header, nav, [role=banner]").forEach((h) => {
    if (h.closest(panel) || !pinned(h)) return;
    const cs = getComputedStyle(h);
    if (cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.1) return;
    const r = h.getBoundingClientRect();
    if (r.top <= band && r.bottom > 0 && r.bottom < window.innerHeight * 0.4) bottom = Math.max(bottom, r.bottom);
  });
  return bottom;
}

/* The reader's place on the line: the smallest text the line runs through, else text starting just under it,
   else the smallest picture it runs through, else the first text or picture below it on screen. A tall photo
   of which only a sliver still shows under the header doesn't count: the one filling the screen below it
   stays put instead. Walked down from <body> past fixed and sticky boxes (not hit-tested: the panel can sit
   over the line). */
function contentAt(y: number, panel: string): Element | null {
  const ih = window.innerHeight, iw = window.innerWidth;
  if (!range) range = document.createRange();
  const rg = range;
  const at: { text: Element | null; textH: number; pic: Element | null; picH: number; below: Element | null; belowTop: number; next: Element | null; nextTop: number } = { text: null, textH: Infinity, pic: null, picH: Infinity, below: null, belowTop: Infinity, next: null, nextTop: Infinity };
  let budget = 8000;
  // on the line, and more of it showing under the header than a sliver on its way out (half of it, or 24 px)
  const across = (t: number, b: number) => t <= y && b > y && b - (y - 8) >= Math.min((b - t) / 2, 24);
  const take = (el: Element, t: number, b: number, isText: boolean) => {
    if (across(t, b)) {
      if (isText && b - t < at.textH) { at.text = el; at.textH = b - t; }
      if (!isText && b - t < at.picH) { at.pic = el; at.picH = b - t; }
    } else if (t > y && t < ih) {
      if (t < at.belowTop) { at.below = el; at.belowTop = t; }
      if (isText && t <= y + 24 && t < at.nextTop) { at.next = el; at.nextTop = t; }
    }
  };
  // where an element's own text sits (a box can hold its text far from its edges)
  const textBox = (el: Element): [number, number] | null => {
    let t = Infinity, b = -Infinity;
    for (let n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType !== 3 || !/\S/.test(n.nodeValue || "")) continue;
      rg.selectNodeContents(n);
      const r = rg.getBoundingClientRect();
      if (r.height) {
        t = Math.min(t, r.top);
        b = Math.max(b, r.bottom);
      }
    }
    return t < b ? [t, b] : null;
  };
  const walk = (node: Element) => {
    for (let k = node.firstElementChild; k && budget-- > 0; k = k.nextElementSibling) {
      if (k.matches(panel)) continue;
      const cs = getComputedStyle(k);
      if (cs.display === "none") continue;
      if (cs.display === "contents") {
        walk(k);
        continue;
      }
      if (cs.position === "fixed" || cs.position === "sticky") continue;
      const r = k.getBoundingClientRect();
      if (r.height > 0 && (r.bottom <= y || r.top >= ih)) continue;
      const seen = r.width > 0 && r.height > 0 && r.right > 0 && r.left < iw;
      const replaced = REPLACED.test(k.tagName);
      if (seen && replaced) take(k, r.top, r.bottom, false);
      else if (seen) {
        const tb = textBox(k);
        if (tb) take(k, tb[0], tb[1], true);
      }
      if (!replaced) walk(k);
    }
  };
  walk(document.body);
  // Text just under the line beats the photo across it only when it sits beside the photo (another column);
  // a caption on the photo, or text under it in the same column, goes with the photo.
  let next = at.next;
  if (next && at.pic) {
    const a = at.pic.getBoundingClientRect(), b = next.getBoundingClientRect();
    if (at.pic.contains(next) || (b.left < a.right && b.right > a.left)) next = null;
  }
  return at.text || next || at.pic || at.below;
}

/* Fallback: the deepest box across the line that is not fixed or sticky. */
function lineAt(y: number, panel: string) {
  let node: Element = document.body;
  let found: Element | null = null;
  for (;;) {
    const kids = Array.from(node.children);
    let next: Element | null = null;
    for (let i = 0; i < kids.length && !next; i++) {
      const k = kids[i];
      if (k.matches(panel)) continue;
      const r = k.getBoundingClientRect();
      if (!r.height && !r.width) {
        if (getComputedStyle(k).display === "contents") kids.splice(i + 1, 0, ...Array.from(k.children));
        continue;
      }
      const pos = getComputedStyle(k).position;
      if (r.top <= y && r.bottom > y && pos !== "fixed" && pos !== "sticky") next = k;
    }
    if (!next) return found;
    found = node = next;
  }
}

function onIntent(e: Event) {
  const t = e.target;
  if (!held) return;
  if (!(t instanceof Element && t.closest(held.panel))) letGo();
}

function letGo() {
  if (!held) return;
  cancelAnimationFrame(held.raf);
  if (held.ro) held.ro.disconnect();
  INTENT.forEach((t) => window.removeEventListener(t, onIntent, true));
  const html = document.documentElement;
  html.style.overflowAnchor = held.anchor;
  html.style.scrollBehavior = held.behavior;
  held = null;
}

/* Where a mark is on screen now, as laid out (null when it is gone or hidden). */
function markTop(c: Mark): number | null {
  if (c.text) {
    const p = c.text.parentElement;
    if (!p || !c.text.isConnected || (c.at || 0) >= c.text.length) return null;
    const b = charBox(c.text, c.at || 0);
    return b ? laidOut(p, b.top) : null;
  }
  if (!c.el.isConnected) return null;
  const r = c.el.getBoundingClientRect();
  return r.height || r.width ? laidOut(c.el, c.bottom ? r.bottom : r.top) : null;
}

/* The reader's line under the header: when the content on it starts above it, the bottom of the outermost
   block around it that is mostly above the line and ends in the top third of the screen; else in text its
   character there; then the content itself and each box around it (for when the new look hides it). */
export function holdPlace(panel: string) {
  letGo();
  if (scrollTopNow() < 1) return;
  const top = Math.min(headerBottom(panel), window.innerHeight * 0.5);
  const el = contentAt(top + 8, panel) || lineAt(top + 8, panel);
  if (!el) return;
  const marks: Mark[] = [];
  const y = top + 8, elTop = el.getBoundingClientRect().top;
  let ends: Element | null = null;
  if (elTop < y) {
    for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
      const r = n.getBoundingClientRect();
      if (r.bottom > 0 && y - r.top > r.bottom - y && r.bottom - y < (window.innerHeight - y) / 3) ends = n;
    }
  }
  if (ends) marks.push({ el: ends, top: 0, bottom: true });
  else if (elTop < top - 1) {
    // text that starts above the screen: its line on the reader's line holds (its own top is out of sight)
    const ch = lineChar(el, y);
    if (ch) marks.push({ el, top: 0, text: ch.text, at: ch.at });
  }
  for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) marks.push({ el: n, top: 0 });
  marks.forEach((m) => {
    const t = markTop(m);
    m.top = t === null ? NaN : t;
  });
  const html = document.documentElement;
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => keepPlace()) : null;
  held = { marks: marks.filter((m) => !isNaN(m.top)), raf: 0, ro, panel, anchor: html.style.overflowAnchor, behavior: html.style.scrollBehavior };
  html.style.overflowAnchor = "none";
  html.style.scrollBehavior = "auto";
  if (ro) {
    ro.observe(html);
    ro.observe(document.body);
    held.marks.slice(0, 24).forEach((m) => ro.observe(m.el));
  }
  INTENT.forEach((t) => window.addEventListener(t, onIntent, { capture: true, passive: true }));
}

/* The first of them still on the page keeps its place. One that rides with the screen once the look
   lands (it turned fixed or sticky: its top on screen doesn't change when the page scrolls) can't be held
   by scrolling, so the page is put back and let go. */
function keepPlace() {
  if (!held) return;
  let m: Mark | null = null;
  let top = 0;
  for (const c of held.marks) {
    const t = markTop(c);
    if (t === null) continue;
    m = c;
    top = t;
    break;
  }
  if (!m) {
    letGo();
    return;
  }
  const d = top - m.top;
  if (Math.abs(d) < 1) return;
  const y = scrollTopNow();
  scrollToY(y + d);
  const after = markTop(m);
  if (Math.abs(scrollTopNow() - y) >= 1 && after !== null && Math.abs(after - top) < 0.5) {
    scrollToY(y);
    letGo();
  }
}

/* Held for 1.2 s at least (the new look renders, its logo swaps), and until the fonts and the header's
   images are in (4 s at most). */
export function settle() {
  const h = held;
  if (!h) return;
  keepPlace(); // before the fonts are read: this layout is what starts a new face loading
  const start = Date.now();
  let done = false;
  const loads: Promise<unknown>[] = [];
  document.querySelectorAll("header img, nav img").forEach((img) => {
    const i = img as HTMLImageElement;
    if (!i.complete) loads.push(new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); }));
  });
  if (document.fonts && document.fonts.ready) loads.push(document.fonts.ready);
  Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 4000))])
    .then(() => new Promise((r) => setTimeout(r, 300)))
    .then(() => { done = true; });
  const tick = () => {
    if (held !== h) return;
    keepPlace();
    if (held !== h) return;
    if (done && Date.now() - start >= 1200) {
      letGo();
      return;
    }
    h.raf = requestAnimationFrame(tick);
  };
  h.raf = requestAnimationFrame(tick);
}
