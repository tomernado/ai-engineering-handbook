document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");
  const backdrop = document.querySelector(".sidebar-backdrop");
  const setSidebarOpen = (open) => {
    if (!sidebar) return;
    sidebar.classList.toggle("is-open", open);
    if (backdrop) backdrop.classList.toggle("is-visible", open);
  };
  if (sidebar && toggle) {
    toggle.addEventListener("click", () => setSidebarOpen(!sidebar.classList.contains("is-open")));
  }
  if (backdrop) {
    backdrop.addEventListener("click", () => setSidebarOpen(false));
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
