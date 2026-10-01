/*
 * A pick restyles the page where the visitor is.
 *
 * Joshua (2026-10-01): a pick in the Look panel has to restyle the page wherever he is scrolled to.
 * Nothing here scrolls on a pick, but a layout, preset, type or logo pick changes heights above and
 * around the screen, and browsers keep the place their own way (Chrome's anchor slips when the layout
 * changes, Safari keeps none). So the content on the line just under the site's header holds still
 * while the new look, its fonts and its logo settle. The line sits under any header pinned at the top,
 * a floating pill nav included. The text or picture on that line (inside boxes that are not fixed,
 * sticky or moved by a transform, which would chase the scroll) keeps its place on screen, or the
 * nearest box around it when the new look hides it. It is put back every frame and whenever
 * the page resizes (a ResizeObserver, so a late change from the site's own scripts can't show for a
 * frame). The browser's own scroll anchoring and smooth scrolling are off for the hold, and a wheel,
 * touch, press or key outside the panel lets go at once. At the very top the page stays at the top.
 * (The same hold as the AERIOX offer engine, aeriox-app#110.)
 *
 * Use: holdPlace(panelSelector) before the look changes the page, settle() right after.
 */

type Mark = { el: Element; top: number };
type Held = { marks: Mark[]; raf: number; ro: ResizeObserver | null; panel: string; anchor: string; behavior: string };

let held: Held | null = null;
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

// A box that moves only with the page: not fixed or sticky, and not shifted by a transform (or by the
// translate / scale / rotate properties Tailwind 4 uses), which a reveal or parallax animates on its own.
function steadyStyle(cs: CSSStyleDeclaration) {
  if (cs.position === "fixed" || cs.position === "sticky") return false;
  if (cs.transform && cs.transform !== "none" && cs.transform !== "matrix(1, 0, 0, 1, 0, 0)") return false;
  const s = cs as CSSStyleDeclaration & { translate?: string; scale?: string; rotate?: string };
  if (s.translate && s.translate !== "none" && !/^(\s*0(px|%)?)+\s*$/.test(s.translate)) return false;
  if (s.scale && s.scale !== "none" && !/^(\s*1)+\s*$/.test(s.scale)) return false;
  if (s.rotate && s.rotate !== "none" && !/^\s*0(deg|rad|turn)?\s*$/.test(s.rotate)) return false;
  return true;
}

function steady(node: Element) {
  return steadyStyle(getComputedStyle(node));
}

function pinned(node: Element) {
  for (let p: Element | null = node; p && p !== document.body; p = p.parentElement) {
    const pos = getComputedStyle(p).position;
    if (pos === "fixed" || pos === "sticky") return true;
  }
  return false;
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
   stays put instead. Walked down from <body> through steady boxes only (not hit-tested: the panel can sit
   over the line); a picture or text moved by its own transform (a hover zoom, a reveal) is held by the steady
   box around it. */
function contentAt(y: number, panel: string): Element | null {
  const ih = window.innerHeight, iw = window.innerWidth;
  const range = document.createRange();
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
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
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
      if (!steadyStyle(cs)) {
        if (seen && node !== document.body) {
          const isText = !replaced && /\S/.test(k.textContent || "") && !k.querySelector("img, video, svg, canvas");
          if (isText || replaced || k.querySelector("img, video, svg, canvas")) take(node, r.top, r.bottom, isText);
        }
        continue;
      }
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

/* Fallback: the deepest steady box across the line. */
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
      if (r.top <= y && r.bottom > y && steady(k)) next = k;
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

/* Where a mark is on screen now (null when it is gone or hidden). */
function markTop(c: Mark): number | null {
  if (!document.contains(c.el)) return null;
  const r = c.el.getBoundingClientRect();
  return r.height || r.width ? r.top : null;
}

/* The content on the line under the header, and each box around it (for when the new look hides it). */
export function holdPlace(panel: string) {
  letGo();
  if (scrollTopNow() < 1) return;
  const top = Math.min(headerBottom(panel), window.innerHeight * 0.5);
  const el = contentAt(top + 8, panel) || lineAt(top + 8, panel);
  if (!el) return;
  const marks: Mark[] = [];
  for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) marks.push({ el: n, top: n.getBoundingClientRect().top });
  const html = document.documentElement;
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => keepPlace()) : null;
  held = { marks, raf: 0, ro, panel, anchor: html.style.overflowAnchor, behavior: html.style.scrollBehavior };
  html.style.overflowAnchor = "none";
  html.style.scrollBehavior = "auto";
  if (ro) {
    ro.observe(html);
    ro.observe(document.body);
    marks.slice(0, 24).forEach((m) => ro.observe(m.el));
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
