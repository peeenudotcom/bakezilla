/* ============================================================
   Manu Loomba G — Astro Vaastu Consultant
   Vanilla JS: scroll reveal, header state, footer year.
   ============================================================ */
(function () {
  "use strict";

  /* ----- Current year in footer ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----- Sticky header shadow on scroll ----- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----- Subtle fade-in on scroll ----- */
  var reveals = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || reveals.length === 0) {
    // Fallback: just show everything.
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  reveals.forEach(function (el) { observer.observe(el); });
})();
