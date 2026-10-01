/*
 * A pick restyles the page where the visitor is.
 *
 * Joshua (2026-10-01): a pick in the Look panel has to restyle the page wherever he is scrolled to.
 * Nothing here scrolls on a pick, but a layout, preset, type or logo pick changes heights above and
 * around the screen, and browsers keep the place their own way (Chrome's anchor slips when the layout
 * changes, Safari keeps none). So the line just under the site's header holds still while the new
 * look, its fonts and its logo settle: the deepest steady element across it (not fixed, sticky or moved
 * by a transform, which would chase the scroll) keeps its place on screen, or the nearest box around it
 * when the new look hides it. The browser's own scroll anchoring and smooth scrolling are off for the
 * hold, and a wheel, touch, press or key outside the panel lets go at once. At the very top the page
 * stays at the top. (The same hold as the AERIOX offer engine, aeriox-app#110.)
 *
 * Use: holdPlace(panelSelector) before the look changes the page, settle() right after.
 */

type Mark = { el: Element; top: number };
type Held = { marks: Mark[]; raf: number; panel: string; anchor: string; behavior: string };

let held: Held | null = null;
const INTENT = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

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

function steady(node: Element) {
  const cs = getComputedStyle(node);
  return cs.position !== "fixed" && cs.position !== "sticky" && (cs.transform === "none" || cs.transform === "matrix(1, 0, 0, 1, 0, 0)");
}

function pinned(node: Element) {
  for (let p: Element | null = node; p && p !== document.body; p = p.parentElement) {
    const pos = getComputedStyle(p).position;
    if (pos === "fixed" || pos === "sticky") return true;
  }
  return false;
}

/* The bottom of the site's header when it stays on screen (fixed or sticky at the top). */
function headerBottom(panel: string) {
  let bottom = 0;
  document.querySelectorAll("header, nav, [role=banner]").forEach((h) => {
    if (h.closest(panel) || !pinned(h)) return;
    const r = h.getBoundingClientRect();
    if (r.top <= 1 && r.bottom > 0 && r.bottom < window.innerHeight * 0.4) bottom = Math.max(bottom, r.bottom);
  });
  return bottom;
}

/* Walked down from <body>, not hit-tested: the panel can sit over the line. */
function lineAt(y: number) {
  let node: Element = document.body;
  let found: Element | null = null;
  for (;;) {
    const kids = Array.from(node.children);
    let next: Element | null = null;
    for (let i = 0; i < kids.length && !next; i++) {
      const k = kids[i];
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
  INTENT.forEach((t) => window.removeEventListener(t, onIntent, true));
  const html = document.documentElement;
  html.style.overflowAnchor = held.anchor;
  html.style.scrollBehavior = held.behavior;
  held = null;
}

/* The first small element down the screen, or the one under the header, and each box around it. */
export function holdPlace(panel: string) {
  letGo();
  if (scrollTopNow() < 1) return;
  const top = Math.min(headerBottom(panel), window.innerHeight * 0.5);
  const span = window.innerHeight - top;
  let el: Element | null = null;
  for (const dy of [8, span * 0.25, span * 0.45]) {
    const c = lineAt(top + dy);
    if (c && !el) el = c;
    if (c && c.getBoundingClientRect().height <= window.innerHeight * 0.6) {
      el = c;
      break;
    }
  }
  if (!el) return;
  const marks: Mark[] = [];
  for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) marks.push({ el: n, top: n.getBoundingClientRect().top });
  const html = document.documentElement;
  held = { marks, raf: 0, panel, anchor: html.style.overflowAnchor, behavior: html.style.scrollBehavior };
  html.style.overflowAnchor = "none";
  html.style.scrollBehavior = "auto";
  INTENT.forEach((t) => window.addEventListener(t, onIntent, { capture: true, passive: true }));
}

/* The first of them still on the page keeps its place. One that rides with the screen once the look
   lands can't be held by scrolling: the page is put back and let go. */
function keepPlace() {
  if (!held) return;
  let m: Mark | null = null;
  let top = 0;
  for (const c of held.marks) {
    if (!document.contains(c.el)) continue;
    const r = c.el.getBoundingClientRect();
    if (!r.height && !r.width) continue;
    m = c;
    top = r.top;
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
  if (Math.abs(scrollTopNow() - y) >= 1 && Math.abs(m.el.getBoundingClientRect().top - m.top) > Math.abs(d) - 0.5) {
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
