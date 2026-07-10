/* ============================================================
   ChartQA showcase — interactions
   Vanilla JS, no dependencies, no storage. GitHub Pages ready.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav: scrolled state ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 30) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    nav.classList.toggle("menu-open", open);
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      nav.classList.remove("menu-open");
    }
  });

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          revObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revObs.observe(el); });
  }

  /* ---------- nav active link (scroll spy) ---------- */
  var sections = document.querySelectorAll("section[id], header[id]");
  var navMap = {};
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    navMap[a.getAttribute("href").slice(1)] = a;
  });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          Object.keys(navMap).forEach(function (k) {
            navMap[k].classList.toggle("active", k === id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- results bars: animate when in view ---------- */
  var chart = document.getElementById("resultsChart");
  if (chart) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      chart.querySelectorAll(".bar").forEach(function (b) { b.classList.add("revealed"); });
    } else {
      var barObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            chart.querySelectorAll(".bar").forEach(function (b) { b.classList.add("revealed"); });
            obs.disconnect();
          }
        });
      }, { threshold: 0.3 });
      barObs.observe(chart);
    }
  }

  /* ---------- count-up for the headline result numbers ---------- */
  function firstTextNode(el) {
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3 && el.childNodes[i].nodeValue.trim() !== "") {
        return el.childNodes[i];
      }
    }
    return null;
  }

  function countUp(el) {
    var node = firstTextNode(el);
    if (!node) return;
    var raw = node.nodeValue.trim();
    var sign = raw.charAt(0) === "+" ? "+" : "";
    var target = parseFloat(raw.replace("+", ""));
    if (isNaN(target)) return;
    var decimals = (raw.split(".")[1] || "").length;
    if (reduceMotion) { node.nodeValue = sign + target.toFixed(decimals); return; }

    var dur = 1300, start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      node.nodeValue = sign + (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
      else node.nodeValue = sign + target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  }

  var jump = document.querySelector(".headline-jump");
  if (jump) {
    var targets = jump.querySelectorAll(".big, .delta .d");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(countUp);
    } else {
      var jumpObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            targets.forEach(countUp);
            obs.disconnect();
          }
        });
      }, { threshold: 0.5 });
      jumpObs.observe(jump);
    }
  }

  /* ---------- year-safe: nothing else needed ---------- */
})();
