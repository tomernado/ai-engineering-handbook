document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");
  const backdrop = document.querySelector(".sidebar-backdrop");
  const MOBILE_QUERY = "(max-width: 780px)";
  const setSidebarOpen = (open) => {
    if (!sidebar) return;
    sidebar.classList.toggle("is-open", open);
    if (backdrop) backdrop.classList.toggle("is-visible", open);
    // Belt-and-suspenders: force the exact positioning via inline styles
    // too, on every toggle. Inline styles always beat stylesheet rules
    // (short of !important), so this works even if some CSS cascade or
    // media-query-matching quirk on a given device stops the class-based
    // approach from taking effect.
    if (window.matchMedia(MOBILE_QUERY).matches) {
      Object.assign(sidebar.style, {
        position: "fixed",
        top: "0",
        zIndex: "40",
        width: "85vw",
        maxWidth: "320px",
        transition: "inset-inline-start .2s ease",
        insetInlineStart: open ? "0" : "-85vw",
      });
    } else {
      ["position", "top", "zIndex", "width", "maxWidth", "transition", "insetInlineStart"].forEach(
        (prop) => { sidebar.style[prop] = ""; }
      );
    }
  };
  // Enforce the closed state immediately on load too, in case the
  // stylesheet's default rendering is ever wrong before any toggle happens.
  setSidebarOpen(false);
  if (sidebar && toggle) {
    toggle.addEventListener("click", () => setSidebarOpen(!sidebar.classList.contains("is-open")));
  }
  if (backdrop) {
    backdrop.addEventListener("click", () => setSidebarOpen(false));
  }
  // Close button lives inside the drawer itself (not the header), so it's
  // never at risk of being covered by the open drawer's own z-index.
  const closeBtn = document.querySelector(".sidebar-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => setSidebarOpen(false));
  }
  // Extra safety nets: Escape key, and tapping/clicking anywhere that
  // isn't the drawer or its own toggle button.
  if (sidebar) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    });
    document.addEventListener("click", (e) => {
      if (!sidebar.classList.contains("is-open")) return;
      if (sidebar.contains(e.target) || (toggle && toggle.contains(e.target))) return;
      setSidebarOpen(false);
    });
  }

  // Fold this chapter's in-page topic list into the sidebar drawer too:
  // the secondary .toc column is hidden below 1100px, so without this,
  // narrow screens would have no way to jump between topics at all.
  const tocNav = document.querySelector(".toc nav");
  const sidebarNav = document.querySelector(".sidebar__nav");
  if (tocNav && sidebarNav) {
    const subnav = document.createElement("div");
    subnav.className = "sidebar-subnav";
    const title = document.createElement("div");
    title.className = "sidebar-subnav__title";
    title.textContent = "בפרק זה";
    subnav.appendChild(title);
    Array.from(tocNav.querySelectorAll("a")).forEach((link) => {
      const clone = document.createElement("a");
      clone.className = "sidebar__link";
      clone.href = link.getAttribute("href");
      clone.textContent = link.textContent;
      subnav.appendChild(clone);
    });
    sidebarNav.after(subnav);
  }

  // Close the mobile drawer whenever any link inside it is activated.
  if (sidebar) {
    sidebar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setSidebarOpen(false));
    });
  }

  // Site-wide search across every chapter (client-side, no backend — the
  // index is a static JS file loaded via assets/search-index.js).
  const searchInput = document.querySelector(".site-search__input");
  const searchResults = document.querySelector(".site-search__results");
  if (searchInput && searchResults && window.SEARCH_INDEX) {
    // Sidebar link hrefs already carry the correct relative path for the
    // current page (plain "0N-file.html" from a chapter page, "chapters/
    // 0N-file.html" from index.html) — reuse that instead of re-deriving it.
    const sampleLink = document.querySelector(".sidebar__link");
    const prefix =
      sampleLink && sampleLink.getAttribute("href").startsWith("chapters/") ? "chapters/" : "";

    const escapeHtml = (s) =>
      s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    const snippetFor = (text, query) => {
      const idx = text.toLowerCase().indexOf(query.toLowerCase());
      if (idx === -1) return text.slice(0, 90);
      const start = Math.max(0, idx - 30);
      const end = Math.min(text.length, idx + query.length + 60);
      return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
    };

    const renderResults = (query) => {
      const q = query.trim();
      if (q.length < 2) {
        searchResults.classList.remove("is-visible");
        searchResults.innerHTML = "";
        return;
      }
      const qLower = q.toLowerCase();
      const scored = window.SEARCH_INDEX
        .map((entry) => {
          const titleMatch = entry.title.toLowerCase().includes(qLower);
          const textMatch = entry.text.toLowerCase().includes(qLower);
          const chapterMatch = entry.chapter.toLowerCase().includes(qLower);
          if (!titleMatch && !textMatch && !chapterMatch) return null;
          const score = titleMatch ? 2 : chapterMatch ? 1.5 : 1;
          return { entry, score };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      if (!scored.length) {
        searchResults.innerHTML =
          `<div class="site-search__empty">לא נמצאו תוצאות עבור "${escapeHtml(q)}"</div>`;
        searchResults.classList.add("is-visible");
        return;
      }

      searchResults.innerHTML = scored
        .map(
          ({ entry }) => `
        <a class="site-search__result" href="${prefix}${entry.file}#${entry.id}">
          <div class="site-search__result-chapter">${escapeHtml(entry.chapter)}</div>
          <div class="site-search__result-title">${escapeHtml(entry.title)}</div>
          <div class="site-search__result-snippet">${escapeHtml(snippetFor(entry.text, q))}</div>
        </a>`
        )
        .join("");
      searchResults.classList.add("is-visible");
    };

    searchInput.addEventListener("input", () => renderResults(searchInput.value));
    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim().length >= 2) renderResults(searchInput.value);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") searchResults.classList.remove("is-visible");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".site-search")) {
        searchResults.classList.remove("is-visible");
      }
    });
    searchResults.addEventListener("click", (e) => {
      if (e.target.closest("a")) setSidebarOpen(false);
    });
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

    // Fallback for the last section: if there isn't enough scroll room
    // below it, the observer's bottom margin never reports it as
    // intersecting, so it never gets marked active. Force it active once
    // the user has scrolled to (or near) the bottom of the page.
    const lastLink = linkFor(topics[topics.length - 1].id);
    if (lastLink) {
      window.addEventListener("scroll", () => {
        const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
        if (atBottom) {
          tocLinks.forEach((l) => l.classList.remove("is-active"));
          lastLink.classList.add("is-active");
        }
      });
    }
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

  // Reference return link: a link that points here as
  // "#target--from--sourceFile.html%23sourceTopic" (cross-chapter) or
  // "#target--from--currentFile.html%23sourceTopic" (same-chapter) scrolls
  // to #target and shows a small button back to the exact topic the reader
  // came from. Same-page anchor clicks don't reload the document, so this
  // also has to run on "hashchange", not just on initial load.
  function handleHashReference() {
    const existing = document.querySelector(".back-ref");
    if (existing) existing.remove();

    const rawHash = decodeURIComponent(location.hash.slice(1));
    const marker = "--from--";
    if (!rawHash.includes(marker)) return;

    const [targetId, returnUrl] = rawHash.split(marker);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ block: "start" });
    }
    const backRef = document.createElement("a");
    backRef.className = "back-ref";
    backRef.href = returnUrl;
    backRef.innerHTML = '<i class="fas fa-arrow-right"></i> חזרה לנקודה הקודמת';
    document.body.appendChild(backRef);
  }

  handleHashReference();
  window.addEventListener("hashchange", handleHashReference);
});
