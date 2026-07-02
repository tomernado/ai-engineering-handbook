# AI Engineering Handbook — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 9-chapter, offline-first, Hebrew RTL, dark-mode HTML reference handbook on AI Engineering, replacing/expanding the 6 terse source Markdown files into a full professional book site.

**Architecture:** Static multi-page site, no build step. One shared `assets/style.css` and `assets/script.js` power a consistent shell (sidebar nav, sticky header, secondary TOC with scroll-spy, back-to-top, print stylesheet) across `index.html` and 9 `chapters/*.html` files. All third-party assets (Font Awesome, Prism.js, Heebo font) are vendored locally under `assets/` — no CDN.

**Tech Stack:** Plain HTML5, CSS3 (Grid/Flexbox/Custom Properties), vanilla JS (IntersectionObserver for scroll-spy), Prism.js (local) for code highlighting, Font Awesome Free (local), Heebo (local, Google Fonts).

## Global Constraints

- Full RTL Hebrew throughout (`<html lang="he" dir="rtl">`), professional register — no "בוא נלמד" / "חשוב להבין" / "אני אסביר" phrasing anywhere.
- Colors: background `#0F172A`, card `#1E293B`, accent `#3B82F6`, success `#22C55E`, warning `#F59E0B`, danger `#EF4444`. Dark mode only, no toggle.
- No Bootstrap. No CDN links — every asset ships under `assets/`.
- Every topic section follows the fixed 10-part template (title, מה זה, למה צריך, איך עובד, דוגמה, Flow Diagram, Best Practices, Common Mistakes, AI Engineer Insight, מה חשוב לזכור) defined in Task 2/4 — but the template is a checklist of *content*, not a mandate for length. Small/simple topics (e.g. Temperature, Streaming, Cosine Similarity) get a **compact pass**: every part still appears, but as one or two sentences instead of full paragraphs, and the Flow Diagram may be skipped when the concept has no meaningful step sequence. Large/complex topics (RAG, Agent Loop, Security) get the full treatment. Optimize for reference-book density, not page count — no padding, no repeated explanations of a concept already covered in an earlier chapter (link back instead).
- Real-world examples drawn only from: ChatGPT, Claude, Gemini, Cursor, GitHub Copilot, Perplexity, After Taste (the user's Supabase/React recipe app) — use where genuinely relevant, not forced into every topic.
- Every chapter ends with one **Real World Example** section (`#real-world-example`, outside the per-topic 10-part template) — a short, concrete walkthrough of how one real product (chosen from the list above) applies several of the chapter's concepts together. Reuses `.example-card` styling; no new CSS class required.
- Source files `01_Foundations.md` … `06_Architecture_and_CheatSheet.md` are read-only reference material — never modified or deleted.
- Spec of record: `docs/superpowers/specs/2026-07-02-ai-engineering-handbook-design.md`.

---

## Task 1: Vendor local assets (fonts, icons, syntax highlighting)

**Files:**
- Create: `assets/fonts/heebo.css` + woff2 files
- Create: `assets/fontawesome/css/all.min.css` + `assets/fontawesome/webfonts/*`
- Create: `assets/prism/prism.js`, `assets/prism/prism.css`

**Interfaces:**
- Produces: `assets/fonts/heebo.css` (declares `@font-face` for family `"Heebo"`), `assets/fontawesome/css/all.min.css` (classes `fa-*`, `fas`, `far`), `assets/prism/prism.js` + `assets/prism/prism.css` (global `Prism` object, auto-highlights `<pre><code class="language-*">`).

- [ ] **Step 1: Download Font Awesome Free (CSS+webfonts) and Prism.js (core + json/typescript/python/bash components) and Heebo (400/500/700 weights, woff2) into the paths above.**

Run:
```bash
mkdir -p assets/fonts assets/fontawesome/css assets/fontawesome/webfonts assets/prism
```
Fetch each asset with `curl -L -o <dest> <official release URL>` (Font Awesome Free release zip from fontawesome.com, Prism.js download builder output from prismjs.com/download.html with languages: markup, css, clike, javascript, json, python, typescript, bash, Google Fonts Heebo woff2 via `fonts.google.com` specimen download or `google-webfonts-helper`). Extract only the `css/all.min.css` + `webfonts/` folder from the Font Awesome zip.

- [ ] **Step 2: Verify assets are present and self-contained (no external `url()` references escaping `assets/`)**

Run:
```bash
grep -r "fonts.googleapis\|fonts.gstatic\|cdnjs\|jsdelivr\|unpkg" assets/ || echo "CLEAN: no external asset references"
```
Expected: `CLEAN: no external asset references`

- [ ] **Step 3: Commit**

```bash
git add assets/fonts assets/fontawesome assets/prism
git commit -m "chore: vendor local fonts, icons, and syntax highlighting assets"
```

---

## Task 2: Shared design system — `assets/style.css`

**Files:**
- Create: `assets/style.css`

**Interfaces:**
- Consumes: `assets/fonts/heebo.css`, `assets/fontawesome/css/all.min.css` (imported via `@import` at top of `style.css`)
- Produces: every class name referenced by Task 3 (JS) and Tasks 5–13 (chapters): `.layout`, `.sidebar`, `.sidebar__brand`, `.sidebar__nav`, `.sidebar__link`, `.sidebar__link.is-active`, `.page-header`, `.breadcrumb`, `.toc`, `.toc__link`, `.toc__link.is-active`, `.content`, `.chapter-hero`, `.topic`, `.topic__title`, `.box`, `.box--what`, `.box--why`, `.box--how`, `.example-card`, `.flow-diagram`, `.flow-step`, `.flow-step__label`, `.flow-step__desc`, `.flow-arrow`, `.practices`, `.practices--good`, `.practices--bad`, `.insight`, `.remember`, `.back-to-top`, `.back-to-top.is-visible`.

- [ ] **Step 1: Write `assets/style.css`**

```css
@import url("fonts/heebo.css");
@import url("fontawesome/css/all.min.css");

:root {
  --bg: #0F172A;
  --bg-card: #1E293B;
  --bg-card-hover: #24334a;
  --border: #334155;
  --text: #E2E8F0;
  --text-muted: #94A3B8;
  --accent: #3B82F6;
  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;
  --font: "Heebo", "Segoe UI", sans-serif;
  --radius: 10px;
  --sidebar-w: 280px;
  --toc-w: 240px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  line-height: 1.75;
  direction: rtl;
}
h1, h2, h3, h4 { font-weight: 700; color: #F8FAFC; line-height: 1.35; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
code { font-family: "Consolas", monospace; direction: ltr; unicode-bidi: embed; }

/* --- Layout --- */
.layout {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr var(--toc-w);
  min-height: 100vh;
}
@media (max-width: 1100px) {
  .layout { grid-template-columns: var(--sidebar-w) 1fr; }
  .toc { display: none; }
}
@media (max-width: 780px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position: fixed; inset-inline-start: -300px; transition: inset-inline-start .2s ease; z-index: 40; }
  .sidebar.is-open { inset-inline-start: 0; }
}

/* --- Sidebar --- */
.sidebar {
  background: var(--bg-card);
  border-inline-start: 1px solid var(--border);
  padding: 24px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.sidebar__brand { display: flex; align-items: center; gap: 10px; padding: 0 8px 20px; font-size: 1.1rem; font-weight: 700; color: #fff; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
.sidebar__brand i { color: var(--accent); }
.sidebar__nav { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.sidebar__link {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: var(--radius);
  color: var(--text-muted); font-size: .95rem;
}
.sidebar__link i { width: 18px; text-align: center; color: var(--accent); }
.sidebar__link:hover { background: var(--bg-card-hover); color: var(--text); text-decoration: none; }
.sidebar__link.is-active { background: var(--accent); color: #fff; }
.sidebar__link.is-active i { color: #fff; }

/* --- Header --- */
.page-header {
  position: sticky; top: 0; z-index: 10;
  background: rgba(15, 23, 42, .92); backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--border);
  padding: 14px 28px;
  display: flex; align-items: center; justify-content: space-between;
}
.breadcrumb { color: var(--text-muted); font-size: .9rem; }
.breadcrumb a { color: var(--text-muted); }
.breadcrumb .current { color: var(--text); }

/* --- Content --- */
.content { padding: 0 40px 80px; max-width: 900px; }
.chapter-hero { padding: 48px 0 32px; border-bottom: 1px solid var(--border); margin-bottom: 32px; }
.chapter-hero__eyebrow { color: var(--accent); font-weight: 600; font-size: .85rem; text-transform: uppercase; letter-spacing: .04em; }
.chapter-hero h1 { font-size: 2.2rem; margin: 8px 0; display: flex; align-items: center; gap: 14px; }
.chapter-hero p { color: var(--text-muted); font-size: 1.05rem; max-width: 65ch; }

.topic { margin: 56px 0; scroll-margin-top: 90px; }
.topic__title { display: flex; align-items: center; gap: 10px; font-size: 1.5rem; border-bottom: 2px solid var(--border); padding-bottom: 10px; margin-bottom: 20px; }
.topic__title i { color: var(--accent); }

.box { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; margin: 14px 0; }
.box__label { display: flex; align-items: center; gap: 8px; font-weight: 700; margin-bottom: 8px; font-size: .95rem; }
.box--what .box__label i { color: var(--accent); }
.box--why .box__label i { color: var(--warning); }
.box--how .box__label i { color: var(--success); }

.example-card { background: linear-gradient(135deg, #1E293B, #172033); border: 1px solid var(--border); border-inline-start: 4px solid var(--accent); border-radius: var(--radius); padding: 18px 20px; margin: 16px 0; }
.example-card__label { font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }

/* --- Flow Diagram --- */
.flow-diagram { display: flex; flex-direction: column; align-items: stretch; gap: 0; margin: 24px 0; }
.flow-step { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 18px; }
.flow-step__label { font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; }
.flow-step__label i { color: var(--accent); }
.flow-step__desc { color: var(--text-muted); font-size: .9rem; margin-top: 4px; }
.flow-arrow { align-self: center; color: var(--accent); font-size: 1.3rem; padding: 6px 0; }
@media (min-width: 640px) {
  .flow-diagram--horizontal { flex-direction: row; align-items: stretch; flex-wrap: wrap; }
  .flow-diagram--horizontal .flow-step { flex: 1 1 160px; }
  .flow-diagram--horizontal .flow-arrow { align-self: center; transform: scaleX(-1); }
}

/* --- Practices / Mistakes --- */
.practices { border-radius: var(--radius); padding: 16px 20px; margin: 14px 0; list-style: none; }
.practices li { position: relative; padding-inline-start: 26px; margin: 8px 0; }
.practices li i { position: absolute; inset-inline-start: 0; top: 4px; }
.practices--good { background: rgba(34, 197, 94, .08); border: 1px solid rgba(34, 197, 94, .3); }
.practices--good li i { color: var(--success); }
.practices--bad { background: rgba(239, 68, 68, .08); border: 1px solid rgba(239, 68, 68, .3); }
.practices--bad li i { color: var(--danger); }
details.mistakes summary { cursor: pointer; font-weight: 700; padding: 10px 4px; color: var(--danger); list-style: none; display: flex; align-items: center; gap: 8px; }
details.mistakes summary::-webkit-details-marker { display: none; }
details.mistakes summary i.fa-chevron-left { margin-inline-start: auto; transition: transform .15s; }
details.mistakes[open] summary i.fa-chevron-left { transform: rotate(-90deg); }

/* --- Insight / Remember --- */
.insight { background: rgba(245, 158, 11, .08); border: 1px solid rgba(245, 158, 11, .35); border-radius: var(--radius); padding: 16px 20px; margin: 18px 0; }
.insight__label { font-weight: 700; color: var(--warning); display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.remember { background: var(--bg-card); border-inline-start: 4px solid var(--accent); border-radius: var(--radius); padding: 18px 22px; margin-top: 20px; }
.remember h4 { margin-top: 0; }
.remember ul { margin: 8px 0 0; padding-inline-start: 20px; }
.remember li { margin: 6px 0; }

/* --- TOC --- */
.toc { padding: 32px 20px; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
.toc__title { color: var(--text-muted); font-size: .8rem; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 12px; }
.toc__link { display: block; padding: 6px 10px; border-inline-start: 2px solid transparent; color: var(--text-muted); font-size: .88rem; }
.toc__link.is-active { border-inline-start-color: var(--accent); color: var(--accent); }

/* --- Code blocks --- */
pre[class*="language-"] { border-radius: var(--radius); border: 1px solid var(--border); margin: 16px 0; }

/* --- Back to top --- */
.back-to-top {
  position: fixed; bottom: 24px; inset-inline-end: 24px;
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--accent); color: #fff; border: none;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none; transform: translateY(10px);
  transition: opacity .2s, transform .2s; cursor: pointer; z-index: 30;
}
.back-to-top.is-visible { opacity: 1; pointer-events: auto; transform: translateY(0); }

/* --- Cards (index.html chapter grid) --- */
.chapter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; margin: 32px 0; }
.chapter-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px; display: block; color: var(--text); }
.chapter-card:hover { border-color: var(--accent); text-decoration: none; }
.chapter-card i { color: var(--accent); font-size: 1.4rem; margin-bottom: 10px; display: block; }
.chapter-card h3 { margin: 0 0 6px; font-size: 1.1rem; }
.chapter-card p { color: var(--text-muted); font-size: .88rem; margin: 0; }

/* --- Print --- */
@media print {
  .sidebar, .toc, .page-header, .back-to-top { display: none !important; }
  .layout { display: block; }
  body { background: #fff; color: #111; }
  .box, .example-card, .flow-step, .remember { background: #f4f4f4; border-color: #ccc; color: #111; }
  a { color: #111; text-decoration: underline; }
  .topic { page-break-inside: avoid; }
}
```

- [ ] **Step 2: Verify the CSS parses (no syntax errors) by opening it in a browser via a throwaway HTML file**

Run:
```bash
node -e "console.log('skip: no linter dependency; visual check in Task 4')"
```
This is a static asset with no build step — real verification happens visually once `index.html` (Task 4) links it. Skip automated parsing here.

- [ ] **Step 3: Commit**

```bash
git add assets/style.css
git commit -m "feat: add shared design system stylesheet"
```

---

## Task 3: Shared behavior — `assets/script.js`

**Files:**
- Create: `assets/script.js`

**Interfaces:**
- Consumes: `.sidebar`, `.toc__link`, `.topic[id]`, `.back-to-top` classes from Task 2's CSS.
- Produces: mobile sidebar toggle behavior (expects an optional `.sidebar-toggle` button in page markup), scroll-spy that toggles `.is-active` on `.toc__link` elements matching the visible `.topic`, back-to-top visibility + scroll-to-top click handler. No exports — runs on `DOMContentLoaded`, safe to include unchanged on every page (guards for missing elements).

- [ ] **Step 1: Write `assets/script.js`**

```javascript
document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");
  if (sidebar && toggle) {
    toggle.addEventListener("click", () => sidebar.classList.toggle("is-open"));
  }

  // Scroll-spy: highlight the TOC link for the topic in view
  const tocLinks = Array.from(document.querySelectorAll(".toc__link"));
  const topics = Array.from(document.querySelectorAll(".topic[id]"));
  if (tocLinks.length && topics.length) {
    const linkFor = (id) => tocLinks.find((l) => l.getAttribute("href") === `#${id}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkFor(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    topics.forEach((t) => observer.observe(t));
  }

  // Back to top
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 500);
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add assets/script.js
git commit -m "feat: add shared sidebar, scroll-spy, and back-to-top behavior"
```

---

## Task 4: `index.html` — cover page and full table of contents

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `assets/style.css`, `assets/script.js`, `assets/prism/*` (not needed on this page but included for consistency is optional — omit on index since no code blocks).
- Produces: the canonical sidebar markup (9 `<li><a class="sidebar__link">` entries with `href="chapters/0N-slug.html"`) that Tasks 5–13 must copy verbatim into their own pages (only the `is-active` class moves).

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Engineering Handbook</title>
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<div class="layout">
  <aside class="sidebar">
    <div class="sidebar__brand"><i class="fas fa-brain"></i> AI Engineering Handbook</div>
    <ul class="sidebar__nav">
      <li><a class="sidebar__link" href="chapters/01-foundations.html"><i class="fas fa-cubes"></i> 1. יסודות</a></li>
      <li><a class="sidebar__link" href="chapters/02-llm-apis-prompts.html"><i class="fas fa-plug"></i> 2. LLM APIs ו-Prompt Engineering</a></li>
      <li><a class="sidebar__link" href="chapters/03-memory-rag.html"><i class="fas fa-database"></i> 3. Memory & RAG</a></li>
      <li><a class="sidebar__link" href="chapters/04-advanced-rag.html"><i class="fas fa-layer-group"></i> 4. RAG מתקדם</a></li>
      <li><a class="sidebar__link" href="chapters/05-agents.html"><i class="fas fa-robot"></i> 5. Agents & Modern AI</a></li>
      <li><a class="sidebar__link" href="chapters/06-agent-patterns.html"><i class="fas fa-sitemap"></i> 6. Agent Patterns מתקדמים</a></li>
      <li><a class="sidebar__link" href="chapters/07-evaluation.html"><i class="fas fa-flask"></i> 7. Evaluation & Testing</a></li>
      <li><a class="sidebar__link" href="chapters/08-production.html"><i class="fas fa-shield-halved"></i> 8. Production AI</a></li>
      <li><a class="sidebar__link" href="chapters/09-architecture-cheatsheet.html"><i class="fas fa-map"></i> 9. Architecture & Cheat Sheet</a></li>
    </ul>
  </aside>
  <main>
    <header class="page-header">
      <div class="breadcrumb"><span class="current">שער הספר</span></div>
    </header>
    <div class="content" style="max-width:1100px;">
      <section class="chapter-hero">
        <div class="chapter-hero__eyebrow">מדריך עיון מקצועי</div>
        <h1><i class="fas fa-brain"></i> AI Engineering Handbook</h1>
        <p>מדריך עיון מקיף לבניית מערכות AI מבוססות LLM — מהיסודות התיאורטיים ועד לפריסה בפרודקשן. תשעה פרקים, כל אחד עומד בפני עצמו וניתן לחזרה נקודתית.</p>
      </section>
      <div class="chapter-grid">
        <a class="chapter-card" href="chapters/01-foundations.html"><i class="fas fa-cubes"></i><h3>1. יסודות</h3><p>AI, ML, Deep Learning, LLM, Tokens, Context Window, Temperature, Streaming, Inference, Hallucinations</p></a>
        <a class="chapter-card" href="chapters/02-llm-apis-prompts.html"><i class="fas fa-plug"></i><h3>2. LLM APIs ו-Prompt Engineering</h3><p>ארכיטקטורת API, System/User/Assistant, Prompt Engineering, Structured Output</p></a>
        <a class="chapter-card" href="chapters/03-memory-rag.html"><i class="fas fa-database"></i><h3>3. Memory & RAG</h3><p>זיכרון שיחה, RAG Flow, Embeddings, Vector DB, Cosine Similarity</p></a>
        <a class="chapter-card" href="chapters/04-advanced-rag.html"><i class="fas fa-layer-group"></i><h3>4. RAG מתקדם</h3><p>Chunking, Hybrid Search, Reranking, השוואת Vector DBs</p></a>
        <a class="chapter-card" href="chapters/05-agents.html"><i class="fas fa-robot"></i><h3>5. Agents & Modern AI</h3><p>Function Calling, Tool Calling, Agent Loop, MCP, Vision, Reasoning Models</p></a>
        <a class="chapter-card" href="chapters/06-agent-patterns.html"><i class="fas fa-sitemap"></i><h3>6. Agent Patterns מתקדמים</h3><p>ReAct, Plan-and-Execute, Reflexion, Multi-Agent, Human-in-the-loop</p></a>
        <a class="chapter-card" href="chapters/07-evaluation.html"><i class="fas fa-flask"></i><h3>7. Evaluation & Testing</h3><p>LLM-as-judge, Benchmarks, A/B Testing, Golden Datasets, CI/CD</p></a>
        <a class="chapter-card" href="chapters/08-production.html"><i class="fas fa-shield-halved"></i><h3>8. Production AI</h3><p>Security, Observability, AI Gateway, Cache, Cost Optimization</p></a>
        <a class="chapter-card" href="chapters/09-architecture-cheatsheet.html"><i class="fas fa-map"></i><h3>9. Architecture & Cheat Sheet</h3><p>תרשים מקצה לקצה, Checklist, Glossary</p></a>
      </div>
    </div>
  </main>
</div>
<script src="assets/script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open in a browser and verify visually**

Run:
```bash
start index.html
```
Expected: dark page renders, sidebar shows 9 links with icons, 9 chapter cards render in a grid (links will 404 until Tasks 5–13 land — that's expected at this point).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add index.html cover page and table of contents"
```

---

## Task 5–13: Chapters

Each chapter task shares this **exact page skeleton** (copy verbatim, only Steps 2 differs per chapter):

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{CHAPTER_TITLE}} — AI Engineering Handbook</title>
<link rel="stylesheet" href="../assets/style.css">
<link rel="stylesheet" href="../assets/prism/prism.css">
</head>
<body>
<div class="layout">
  <aside class="sidebar"><!-- copy sidebar markup from index.html, add is-active to this chapter's link, prefix hrefs with nothing (already relative: "0N-slug.html") and index link "../index.html" --></aside>
  <main>
    <header class="page-header">
      <div class="breadcrumb"><a href="../index.html">שער הספר</a> / <span class="current">{{CHAPTER_TITLE}}</span></div>
      <button class="sidebar-toggle" aria-label="תפריט"><i class="fas fa-bars"></i></button>
    </header>
    <div class="content">
      <section class="chapter-hero">
        <div class="chapter-hero__eyebrow">פרק {{N}}</div>
        <h1><i class="fas {{ICON}}"></i> {{CHAPTER_TITLE}}</h1>
        <p>{{CHAPTER_INTRO}}</p>
      </section>
      <!-- one <section class="topic" id="{{topic-slug}}"> per subtopic, per the 10-part template -->
    </div>
  </main>
  <aside class="toc">
    <div class="toc__title">בפרק זה</div>
    <nav><!-- one <a class="toc__link" href="#{{topic-slug}}"> per topic --></nav>
  </aside>
</div>
<script src="../assets/prism/prism.js"></script>
<script src="../assets/script.js"></script>
<button class="back-to-top" aria-label="חזרה למעלה"><i class="fas fa-arrow-up"></i></button>
</body>
</html>
```

Each `<section class="topic" id="...">` must contain, in order: `<h2 class="topic__title">`, `.box--what`, `.box--why`, `.box--how`, `.example-card`, `.flow-diagram` (using `.flow-step` + `.flow-arrow`), `.practices--good` (`<ul>`), `<details class="mistakes"><summary>` + `.practices--bad` `<ul>`, `.insight`, `.remember` (`<h4>` + `<ul>`). Compact topics (per the Global Constraints compact-pass rule) shorten every part to one or two sentences and may omit only `.flow-diagram` when there is no real step sequence — every other part still appears, just brief.

After the last per-topic `<section class="topic">`, every chapter adds one closing section:

```html
<section class="topic" id="real-world-example">
  <h2 class="topic__title"><i class="fas fa-flask"></i> Real World Example</h2>
  <div class="example-card">
    <div class="example-card__label"><i class="fas fa-star"></i> {{PRODUCT_NAME}}</div>
    <p>{{2-4 sentences tying together at least 2-3 of this chapter's concepts through one concrete product behavior.}}</p>
  </div>
</section>
```

For each task below: **Files** create the one chapter HTML file. **Interfaces**: consumes the skeleton and CSS classes above; produces one `<li>` sidebar entry (already listed in Task 4) marked active, and content anchored by the listed topic slugs (later cross-chapter links, e.g. Chapter 4 linking back to Chapter 3, must use these exact slugs). Every chapter's topic list below implicitly ends with `#real-world-example` — not repeated in each task's topic list.

### Task 5: Chapter 1 — `chapters/01-foundations.html`

**Topics (id slugs in order):** `#ai-ml-dl` (היררכיית AI/ML/Deep Learning/LLM), `#llm-next-token` (LLM = חיזוי ה-Token הבא, ומכאן כל היכולות), `#tokens` (Tokenization, יחידת עבודה, השפעה על מחיר/Context/Latency), `#context-window` (מרכיבי החלון: System/User/Memory/RAG/Tool Results), `#context-compression` (compact — Long Context ודחיסת הקשר: summarization, sliding window, מתי Context גדול לא פותר בעיית איכות), `#sampling-params` (Temperature/Top-P/Max Tokens), `#streaming` (compact — מסירת תשובה בהדרגה, UX), `#inference` (compact — מה קורה בזמן הרצה מול אימון), `#hallucinations` (מקור התופעה, דרכי צמצום: RAG/Tools/Validation).

Source material: `01_Foundations.md` (מלא). Examples to weave in: ChatGPT/Claude for streaming UX, Perplexity for hallucination-mitigation via citations. Real World Example candidate: Claude/ChatGPT long-conversation summarization behavior.

- [ ] **Step 1: Copy the shared skeleton to `chapters/01-foundations.html`**, set `{{CHAPTER_TITLE}}`=`יסודות`, `{{N}}`=`1`, `{{ICON}}`=`fa-cubes`, mark this chapter's sidebar link `is-active`.
- [ ] **Step 2: Author all 9 topic sections listed above**, each following the 10-part template (compact pass for the topics marked `compact` above), using `01_Foundations.md` as the factual base and expanding per the spec (no invented facts about specific model internals; keep claims general and evergreen). Add the closing `#real-world-example` section.
- [ ] **Step 3: Build the TOC `<nav>`** with one `.toc__link` per topic slug, matching link text to each `<h2>`.
- [ ] **Step 4: Open in browser and verify**

Run: `start chapters/01-foundations.html`
Expected: sidebar shows "1. יסודות" highlighted, all 8 topics render with all 10 template parts, TOC scroll-spy highlights the visible topic while scrolling, back-to-top button appears after scrolling past ~500px.

- [ ] **Step 5: Commit**

```bash
git add chapters/01-foundations.html
git commit -m "feat: author Chapter 1 — Foundations"
```

### Task 6: Chapter 2 — `chapters/02-llm-apis-prompts.html`

**Topics:** `#api-architecture` (Frontend→Backend→Prompt Builder→LLM API→Validation→Frontend), `#roles` (System/User/Assistant), `#prompt-formula` (Role+Task+Constraints+Context), `#context-engineering`, `#few-shot-cot` (Zero-Shot/Few-Shot/Chain-of-Thought), `#structured-output` (JSON mode, function-calling schemas, Pydantic/Zod), `#output-validation` (למה לא לסמוך על LLM ישירות למסד נתונים), `#prompt-chaining`.

Source: `02_LLM_APIs_and_Prompts.md`. Examples: GitHub Copilot/Cursor for structured code-edit output, After Taste for a JSON-schema "add recipe" example.

- [ ] **Step 1: Copy skeleton**, `{{CHAPTER_TITLE}}`=`LLM APIs ו-Prompt Engineering`, `{{N}}`=`2`, `{{ICON}}`=`fa-plug`.
- [ ] **Step 2: Author all 8 topics** per the template (compact pass for `#roles` and `#context-engineering`). `#api-architecture` must render the flow as a `.flow-diagram--horizontal` with 6 `.flow-step` elements matching the spec's flow text. `#structured-output` must include a `<pre><code class="language-json">` example schema. Add the closing `#real-world-example` section (candidate: Cursor/Copilot structured code-edit output).
- [ ] **Step 3: Build TOC.**
- [ ] **Step 4: Verify**

Run: `start chapters/02-llm-apis-prompts.html`
Expected: JSON code block is syntax-highlighted by Prism (colored tokens visible), horizontal flow diagram of 6 steps renders left-to-right correctly under RTL, all sections present.

- [ ] **Step 5: Commit**

```bash
git add chapters/02-llm-apis-prompts.html
git commit -m "feat: author Chapter 2 — LLM APIs and Prompt Engineering"
```

### Task 7: Chapter 3 — `chapters/03-memory-rag.html`

**Topics:** `#conversation-memory`, `#rag-flow` (Question→Embedding→Vector Search→Documents→LLM), `#memory-manager`, `#token-budgeting`, `#embeddings`, `#vector-db-basics`, `#cosine-similarity`, `#rag-vs-finetune` (כלל ההכרעה).

Source: `03_Memory_RAG.md`. Examples: Claude/ChatGPT conversation memory behavior, After Taste using embeddings to search recipes by ingredient similarity (hypothetical illustrative example, labeled as illustrative).

- [ ] **Step 1: Copy skeleton**, `{{CHAPTER_TITLE}}`=`Memory & RAG`, `{{N}}`=`3`, `{{ICON}}`=`fa-database`.
- [ ] **Step 2: Author all 8 topics** (compact pass for `#memory-manager` and `#token-budgeting`). `#rag-flow` renders as `.flow-diagram--horizontal`. The `#rag-vs-finetune` topic ends with an explicit note-forward: "להרחבה על טכניקות RAG מתקדמות ראו פרק 4" linking to `04-advanced-rag.html#chunking`. Add the closing `#real-world-example` section (candidate: Claude/ChatGPT conversation memory).
- [ ] **Step 3: Build TOC.**
- [ ] **Step 4: Verify**

Run: `start chapters/03-memory-rag.html`
Expected: all 8 sections present, forward-link to Chapter 4 resolves once Task 8 lands.

- [ ] **Step 5: Commit**

```bash
git add chapters/03-memory-rag.html
git commit -m "feat: author Chapter 3 — Memory and RAG"
```

### Task 8: Chapter 4 — `chapters/04-advanced-rag.html` (NEW)

**Topics:** `#chunking` (fixed-size/recursive/semantic), `#hybrid-search` (BM25+Vector), `#reranking` (cross-encoders), `#vector-db-comparison` (Pinecone/Weaviate/pgvector/Chroma — as a comparison table, not prose only), `#query-transformation` (HyDE, Multi-Query), `#agentic-rag-preview` (short, links forward to `06-agent-patterns.html`), `#rag-eval-preview` (short, links forward to `07-evaluation.html`).

No direct source file — built from the spec's "RAG מתקדם" section. Examples: Cursor/Copilot codebase-retrieval as chunking+reranking in practice; Perplexity as hybrid search + citation example.

- [ ] **Step 1: Copy skeleton**, `{{CHAPTER_TITLE}}`=`RAG מתקדם`, `{{N}}`=`4`, `{{ICON}}`=`fa-layer-group`.
- [ ] **Step 2: Author all 7 topics.** `#vector-db-comparison`'s `.example-card` must include an actual `<table>` comparing Pinecone/Weaviate/pgvector/Chroma across columns: Hosting, שאילתות היברידיות, קלות התקנה, מתאים ל-. The two "preview" topics are intentionally compact (2-3 sentences + link) — they still need all 10 template parts but each part may be one line. Add the closing `#real-world-example` section (candidate: Cursor/Copilot codebase retrieval, or Perplexity hybrid search).
- [ ] **Step 3: Build TOC.**
- [ ] **Step 4: Verify**

Run: `start chapters/04-advanced-rag.html`
Expected: comparison table renders legibly in dark mode, forward links to Chapter 6 and 7 present (will resolve after Tasks 10, 11).

- [ ] **Step 5: Commit**

```bash
git add chapters/04-advanced-rag.html
git commit -m "feat: author Chapter 4 — Advanced RAG"
```

### Task 9: Chapter 5 — `chapters/05-agents.html`

**Topics:** `#function-calling`, `#tool-calling`, `#agent-loop` (User→Planner→Tools→LLM→Response), `#multi-agent-intro`, `#mcp`, `#vision` (Image→Vision→Context→LLM), `#reasoning-models`.

Source: `04_Agents_and_Modern_AI.md`. Examples: Claude/GPT tool use for function calling; Cursor/Copilot as agentic coding tools; Claude extended thinking / OpenAI o-series for reasoning models.

- [ ] **Step 1: Copy skeleton**, `{{CHAPTER_TITLE}}`=`Agents & Modern AI`, `{{N}}`=`5`, `{{ICON}}`=`fa-robot`.
- [ ] **Step 2: Author all 7 topics** (compact pass for `#tool-calling` and `#reasoning-models`). `#agent-loop` and `#vision` each render as `.flow-diagram--horizontal`. `#multi-agent-intro` ends with a forward-link to `06-agent-patterns.html#orchestration-patterns`. Add the closing `#real-world-example` section (candidate: Claude/GPT tool use, or Cursor agentic coding).
- [ ] **Step 3: Build TOC.**
- [ ] **Step 4: Verify**

Run: `start chapters/05-agents.html`
Expected: both flow diagrams render correctly, all 7 topics present.

- [ ] **Step 5: Commit**

```bash
git add chapters/05-agents.html
git commit -m "feat: author Chapter 5 — Agents and Modern AI"
```

### Task 10: Chapter 6 — `chapters/06-agent-patterns.html` (NEW)

**Topics:** `#react-pattern` (ReAct), `#plan-and-execute`, `#reflexion` (self-critique), `#orchestration-patterns` (Supervisor, Swarm), `#human-in-the-loop`, `#agent-error-handling` (retries בלולאת agent), `#agent-memory` (short/long/episodic).

No direct source file — built from spec. Examples: Claude Code / Cursor Agent Mode for plan-and-execute; Devin/GitHub Copilot Workspace-style multi-step agents (describe generically, do not overstate unverifiable internals).

- [ ] **Step 1: Copy skeleton**, `{{CHAPTER_TITLE}}`=`Agent Patterns מתקדמים`, `{{N}}`=`6`, `{{ICON}}`=`fa-sitemap`.
- [ ] **Step 2: Author all 7 topics** per template (compact pass for `#human-in-the-loop` and `#agent-error-handling`). `#orchestration-patterns` includes two `.flow-step` groups side by side (or stacked) labeled "Supervisor" and "Swarm" to visually contrast them. Add the closing `#real-world-example` section (candidate: Claude Code / Cursor Agent Mode plan-and-execute).
- [ ] **Step 3: Build TOC.**
- [ ] **Step 4: Verify**

Run: `start chapters/06-agent-patterns.html`
Expected: all 7 topics present, Supervisor/Swarm comparison visually distinct.

- [ ] **Step 5: Commit**

```bash
git add chapters/06-agent-patterns.html
git commit -m "feat: author Chapter 6 — Advanced Agent Patterns"
```

### Task 11: Chapter 7 — `chapters/07-evaluation.html` (NEW)

**Topics:** `#why-evals`, `#llm-as-judge`, `#benchmarks`, `#ab-testing-production`, `#golden-datasets`, `#prompt-regression-testing`, `#ci-cd-for-ai`, `#rag-eval-metrics` (faithfulness/relevance).

No direct source file — built from spec. Examples: how a Cursor/Copilot-style team might regression-test prompt changes in CI; After Taste as a small-scale example of a golden dataset ("10 שאלות קבועות על מתכונים שחייבות לקבל תשובה נכונה").

- [ ] **Step 1: Copy skeleton**, `{{CHAPTER_TITLE}}`=`Evaluation & Testing`, `{{N}}`=`7`, `{{ICON}}`=`fa-flask`.
- [ ] **Step 2: Author all 8 topics** per template (compact pass for `#benchmarks` and `#golden-datasets`). `#ci-cd-for-ai` includes a `<pre><code class="language-yaml">` minimal CI step example (run eval suite on PR, block merge on regression). Add the closing `#real-world-example` section (candidate: After Taste's fixed-question golden dataset).
- [ ] **Step 3: Build TOC.**
- [ ] **Step 4: Verify**

Run: `start chapters/07-evaluation.html`
Expected: YAML code block highlighted, all 8 topics present.

- [ ] **Step 5: Commit**

```bash
git add chapters/07-evaluation.html
git commit -m "feat: author Chapter 7 — Evaluation and Testing"
```

### Task 12: Chapter 8 — `chapters/08-production.html`

**Topics:** `#security-prompt-injection`, `#guardrails-output-validation` (Guardrails: rule-based/classifier/LLM-based filters לפני ואחרי המודל — נבדל מ-`#output-validation` בפרק 2, ששם עוסק בנכונות JSON; כאן עוסק במדיניות/בטיחות/תוכן), `#logging`, `#monitoring-observability`, `#ai-gateway`, `#fallback`, `#caching` (כולל semantic cache), `#latency`, `#cost-optimization`, `#model-routing`, `#rate-limiting`.

Source: `05_Production_AI.md`. Examples: AI Gateway pattern as used by teams routing between Claude/GPT/Gemini; caching in a Perplexity-style search+LLM product.

- [ ] **Step 1: Copy skeleton**, `{{CHAPTER_TITLE}}`=`Production AI`, `{{N}}`=`8`, `{{ICON}}`=`fa-shield-halved`.
- [ ] **Step 2: Author all 11 topics** per template (this is the largest chapter — compact pass for `#logging`, `#fallback`, and `#rate-limiting`; keep each topic focused, avoid repeating content already covered in Chapter 7's evals or Chapter 2's `#output-validation`). Add the closing `#real-world-example` section (candidate: multi-model AI Gateway routing between Claude/GPT/Gemini).
- [ ] **Step 3: Build TOC.**
- [ ] **Step 4: Verify**

Run: `start chapters/08-production.html`
Expected: all 10 topics present, page remains navigable (TOC scroll-spy works across the longer page).

- [ ] **Step 5: Commit**

```bash
git add chapters/08-production.html
git commit -m "feat: author Chapter 8 — Production AI"
```

### Task 13: Chapter 9 — `chapters/09-architecture-cheatsheet.html`

**Topics:** `#full-architecture` (תרשים מקצה לקצה: User→Frontend→Backend→Memory→Vision→RAG/Tools→Prompt Builder→AI Gateway→LLM→Validation→Logging→Frontend), `#pre-request-checklist`, `#model-selection` (compact — מתי לבחור GPT מול Claude מול Gemini מול מודל open-source כמו Llama: קריטריונים כלליים ועמידים בזמן — context window, cost tier, tool-use quality, latency, self-hosting — לא המלצה על מודל ספציפי שיתיישן), `#model-quick-reference` (טבלת השוואה קומפקטית, ממשיכה ישירות מ-`#model-selection`), `#glossary`.

Source: `06_Architecture_and_CheatSheet.md`. This chapter deliberately breaks from the strict 10-part template (it's a reference/cheat-sheet chapter, not a teaching chapter) — each topic still gets `<h2 class="topic__title">` but only the parts that make sense (e.g. `#glossary` is a definition list, not a Best-Practices/Mistakes pair).

- [ ] **Step 1: Copy skeleton**, `{{CHAPTER_TITLE}}`=`Architecture & Cheat Sheet`, `{{N}}`=`9`, `{{ICON}}`=`fa-map`.
- [ ] **Step 2: Author `#full-architecture`** as a large `.flow-diagram--horizontal` (or wrapped multi-row) with 12 steps matching the spec's list, each with a one-line Hebrew description.
- [ ] **Step 3: Author `#pre-request-checklist`** as a `.practices--good` checklist (System Prompt, User Prompt, Memory, RAG, Max Tokens, Temperature).
- [ ] **Step 4: Author `#model-selection`** (compact — a short `.box--how` decision guide, criteria-based not name-based, evergreen).
- [ ] **Step 5: Author `#model-quick-reference`** as an `.example-card` with a `<table>` comparing a handful of current model families by general capability class (not volatile pricing numbers that go stale) — columns: משפחה, חוזקות טיפוסיות, Context Window טיפוסי, מתי לבחור.
- [ ] **Step 6: Author `#glossary`** as a `<dl>` styled via `.box` covering: AI, LLM, Token, Prompt, Context, RAG, Embedding, Vector DB, Tool Calling, Agent, MCP, Streaming, Inference — plus terms introduced in Chapters 4/6/7 (Reranking, ReAct, LLM-as-judge, Hybrid Search) so the glossary stays the single cross-book reference. This chapter has no `#real-world-example` section — it is itself the cross-book reference.
- [ ] **Step 7: Build TOC.**
- [ ] **Step 8: Verify**

Run: `start chapters/09-architecture-cheatsheet.html`
Expected: full architecture diagram renders as 12 connected steps, model selection guide and table render before the glossary, glossary is alphabetically or logically ordered and readable.

- [ ] **Step 9: Commit**

```bash
git add chapters/09-architecture-cheatsheet.html
git commit -m "feat: author Chapter 9 — Architecture and Cheat Sheet"
```

---

## Task 14: Cross-site QA pass

**Files:** none created; verifies all prior outputs.

**Interfaces:**
- Consumes: every file produced in Tasks 1–13.

- [ ] **Step 1: Verify every sidebar link across every page resolves to an existing file**

Run:
```bash
for f in index.html chapters/*.html; do
  grep -oE 'href="[^"]+\.html[^"]*"' "$f" | sed -E 's/href="([^"#]+)\.html[^"]*"/\1.html/' | while read -r ref; do
    dir=$(dirname "$f")
    target="$dir/$ref"
    [ -f "$target" ] || echo "BROKEN in $f -> $ref"
  done
done
echo "done"
```
Expected: no `BROKEN` lines printed, just `done`.

- [ ] **Step 2: Verify every chapter has all required template parts present**

Run:
```bash
for f in chapters/*.html; do
  for cls in "box--what" "box--why" "box--how" "example-card" "flow-step" "practices--good" "practices--bad" "insight" "remember"; do
    grep -q "$cls" "$f" || echo "MISSING $cls in $f"
  done
done
echo "done"
```
Expected: no `MISSING` lines (Chapter 9 is exempt per Task 13's note — if it prints missing lines for Chapter 9 only, that's expected; confirm nothing else is missing).

- [ ] **Step 3: Verify no external network references anywhere in the shipped site**

Run:
```bash
grep -rE "https?://" index.html chapters/ assets/*.css assets/*.js || echo "CLEAN"
```
Expected: `CLEAN`, or only matches inside `<code>` example snippets (inspect any hits manually — real `<link>`/`<script src>` to external hosts are not allowed).

- [ ] **Step 4: Manual visual pass**

Run: `start index.html` and click through all 9 chapters. Confirm: sidebar active-state matches current page on every chapter, TOC scroll-spy tracks scrolling on at least 2 chapters, back-to-top appears/scrolls correctly, `Ctrl+P` print preview on one chapter shows a clean light-background layout with sidebar/TOC hidden.

- [ ] **Step 5: Commit** (only if Steps 1–3 required fixes)

```bash
git add -A -- index.html chapters assets
git commit -m "fix: resolve cross-site QA issues (links, template completeness, offline assets)"
```
