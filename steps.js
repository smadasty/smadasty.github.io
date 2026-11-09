/* Theme toggle plus the looping step diagram on essay pages. */
(function () {
  var root = document.documentElement, btn = document.getElementById("themeToggle");
  if (btn) {
    var isDark = function () {
      var t = root.getAttribute("data-theme");
      return t ? t === "dark" : !window.matchMedia("(prefers-color-scheme: light)").matches;
    };
    var label = function () { btn.textContent = isDark() ? "Light" : "Dark"; };
    btn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
    label();
  }

  var svg = document.querySelector("svg.steps");
  if (!svg) return;
  var route = svg.querySelector(".route");
  var packet = svg.querySelector(".packet");
  var nodes = Array.prototype.slice.call(svg.querySelectorAll(".node"));
  var status = document.getElementById("steps-status");
  var len = route.getTotalLength();

  function finalState() {
    nodes.forEach(function (n) { n.classList.add("hit"); if (n.dataset.tone) n.classList.add(n.dataset.final || n.dataset.tone); });
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finalState(); return; }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function move(from, to, ms) {
    return new Promise(function (done) {
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / ms);
        var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        var p = route.getPointAtLength((from + (to - from) * e) * len);
        packet.setAttribute("cx", p.x); packet.setAttribute("cy", p.y);
        if (k < 1) requestAnimationFrame(step); else done();
      }
      requestAnimationFrame(step);
    });
  }

  async function loop() {
    nodes.forEach(function (n) { n.classList.remove("hit", "ok", "wait"); });
    var at = 0;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i], to = parseFloat(n.dataset.at);
      if (to > at) await move(at, to, 700);
      at = to;
      n.classList.add("hit");
      if (status && n.dataset.say) status.textContent = n.dataset.say;
      if (n.dataset.tone === "wait") {
        n.classList.add("wait");
        await wait(1500);
        if (n.dataset.final) { n.classList.remove("wait"); n.classList.add(n.dataset.final); }
        if (status && n.dataset.after) status.textContent = n.dataset.after;
        await wait(500);
      } else if (n.dataset.tone) {
        n.classList.add(n.dataset.tone);
        await wait(400);
      } else {
        await wait(250);
      }
    }
    await wait(1800);
    loop();
  }
  var started = false;
  new IntersectionObserver(function (es) {
    if (es[0].isIntersecting && !started) { started = true; loop(); }
  }).observe(svg);
})();

/* Outline: highlight the section being read */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc nav a"));
  if (!links.length) return;
  var heads = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
  function update() {
    var current = 0;
    heads.forEach(function (h, i) { if (h.getBoundingClientRect().top < 140) current = i; });
    links.forEach(function (a, i) { a.classList.toggle("on", i === current); });
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();
