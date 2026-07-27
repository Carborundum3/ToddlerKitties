/* ==========================================================================
   Toddler Kitties — site behaviour
   ==========================================================================
   ►► THE ONLY LINE YOU NEED TO EDIT ◄◄
   Paste your form endpoint below (Buttondown, Formspree, MailerLite...).
   While it is empty, the signup form falls back to opening an email.
   ========================================================================== */

const SIGNUP_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

const FALLBACK_MAILTO =
  "mailto:toddlerkitties@gmail.com" +
  "?subject=" + encodeURIComponent("Add me to the Toddler Kitties list") +
  "&body="    + encodeURIComponent("Please let me know when the first book is ready.");

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. page-turn transitions ------------------------------------- */
(function pageTurn() {
  if (reduced) return;
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const a = e.target.closest("a");
    if (!a || a.target === "_blank") return;
    const href = a.getAttribute("href") || "";
    if (!href.endsWith(".html") || href.startsWith("http") || href.startsWith("mailto")) return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(() => { window.location.href = href; }, 200);
  });
  // restore state when arriving via back/forward cache
  window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));
})();

/* ---------- 2. scroll reveal ---------------------------------------------- */
(function reveal() {
  const items = document.querySelectorAll(".rv, .rv-fade");
  if (!items.length) return;
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  items.forEach(el => io.observe(el));
})();

/* ---------- 3. email signup ----------------------------------------------- */
(function signup() {
  document.querySelectorAll("form[data-signup]").forEach(form => {
    const note  = form.parentElement.querySelector(".signup__note");
    const input = form.querySelector('input[type="email"]');
    const trap  = form.querySelector('input[name="_hp"]');

    if (SIGNUP_ENDPOINT) form.setAttribute("action", SIGNUP_ENDPOINT);

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (trap && trap.value) return;
      const email = (input.value || "").trim();
      if (!email || !input.checkValidity()) {
        if (note) note.textContent = "That address didn't look right. Try again?";
        input.focus();
        return;
      }
      if (!SIGNUP_ENDPOINT) {
        window.location.href = FALLBACK_MAILTO;
        if (note) note.textContent = "Opening your email app — just hit send.";
        return;
      }
      if (note) note.textContent = "Signing you up…";
      try {
        const res = await fetch(SIGNUP_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        if (note) note.textContent = "You're on the list!";
      } catch (err) {
        if (note) note.textContent = "That didn't go through. Email toddlerkitties@gmail.com instead.";
      }
    });
  });
})();

/* ---------- 4. per-cat stage animations ----------------------------------- */
(function ambient() {
  if (reduced) return;
  const stage = document.querySelector("[data-stage]");
  if (!stage) return;
  const cat = document.body.dataset.theme;   // pages set data-theme="baker" etc.

  const mk = (cls, html) => {
    const el = document.createElement("span");
    el.className = "crit " + cls;
    if (html) el.innerHTML = html;
    stage.appendChild(el);
    return el;
  };
  const R = (a, b) => a + Math.random() * (b - a);

  /* --- Baker: laser dot; her eyes track it, and sometimes she swats --- */
  if (cat === "baker") {
    const dot = mk("laser");
    const pupils = stage.querySelector(".bk-pupils"); // stage art is inlined, so reachable
    const PAW =
      '<svg width="36" height="64" viewBox="0 0 36 64" aria-hidden="true">' +
      '<rect x="10" y="16" width="16" height="48" rx="8" fill="#9C8C7E"/>' +
      '<circle cx="18" cy="13" r="12.5" fill="#9C8C7E"/>' +
      '<circle cx="11.5" cy="8" r="3.1" fill="#E0A6A6"/>' +
      '<circle cx="18" cy="5.6" r="3.1" fill="#E0A6A6"/>' +
      '<circle cx="24.5" cy="8" r="3.1" fill="#E0A6A6"/>' +
      '<ellipse cx="18" cy="14.5" rx="4.8" ry="4.2" fill="#E0A6A6"/></svg>';
    const paw = mk("bk-paw", PAW);

    let t = R(0, 100), tx = 0.5, ty = 0.4, hold = 0;
    let x = 0, y = 0, swatting = false;

    const restPaw = () => {
      paw.style.transition = "none";
      paw.style.transform = `translate(${x - 18}px, ${stage.clientHeight + 70}px)`;
    };
    restPaw();

    (function step() {
      t += 0.016;
      if (hold > 0) hold -= 1;
      else if (Math.random() < 0.012) { hold = R(30, 90); tx = R(0.1, 0.9); ty = R(0.12, 0.85); }
      const w = stage.clientWidth, h = stage.clientHeight;
      x = (tx + Math.sin(t * 2.3) * 0.05) * w;
      y = (ty + Math.cos(t * 3.1) * 0.05) * h;
      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
      if (pupils) {
        // nudge the pupils toward wherever the dot is (SVG user units, so tiny values)
        const dx = (x / w - 0.5) * 7;
        const dy = (y / h - 0.45) * 5;
        pupils.setAttribute("transform",
          `translate(${Math.max(-3.5, Math.min(3.5, dx))} ${Math.max(-2, Math.min(3, dy))})`);
      }
      requestAnimationFrame(step);
    })();

    const swat = () => {
      if (swatting) return;
      swatting = true;
      const h = stage.clientHeight;
      // wind up under the dot, off-stage
      paw.style.transition = "none";
      paw.style.transform = `translate(${x - 18}px, ${h + 70}px)`;
      void paw.offsetWidth; // reflow so the next transform animates
      paw.style.transition = "transform .26s cubic-bezier(.2,.9,.3,1.15)";
      paw.style.transform = `translate(${x - 18}px, ${y - 10}px)`;
      setTimeout(() => {
        // the dot escapes, obviously
        tx = R(0.1, 0.9); ty = R(0.12, 0.8); hold = 0;
        paw.style.transition = "transform .3s ease-in";
        paw.style.transform = `translate(${x - 18}px, ${h + 70}px)`;
        setTimeout(() => { swatting = false; }, 320);
      }, 420);
    };
    (function scheduleSwat() {
      setTimeout(() => { swat(); scheduleSwat(); }, R(4500, 8500));
    })();
  }

  /* --- Doc: a sparkly pom pom, being fetched --- */
  if (cat === "doc") {
    const pom = mk("pom");
    const sparks = [mk("spark"), mk("spark"), mk("spark")];
    let t = R(0, 6);
    (function step() {
      t += 0.0055;
      const p = (t % 1);
      const w = stage.clientWidth, h = stage.clientHeight;
      const dir = Math.floor(t) % 2 === 0 ? p : 1 - p;
      const x = (0.06 + dir * 0.88) * w;
      const y = h * 0.88 - Math.abs(Math.sin(p * Math.PI * 5)) * h * 0.1;
      pom.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
      sparks.forEach((s, i) => {
        const a = t * (7 + i * 2) + i * 2.1;
        s.style.transform = `translate(${x - 2 + Math.cos(a) * 15}px, ${y - 2 + Math.sin(a) * 13}px)`;
        s.style.opacity = 0.35 + 0.65 * Math.abs(Math.sin(a));
      });
      requestAnimationFrame(step);
    })();
  }

  /* --- Lulu: rose petals and, inexplicably, cucumber --- */
  if (cat === "lulu") {
    const petal = '<svg width="14" height="14" viewBox="0 0 14 14"><ellipse cx="7" cy="7" rx="6.5" ry="3.4" fill="#E48CA4"/></svg>';
    const cuke  = '<svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6.4" fill="#4E8B45"/><circle cx="7" cy="7" r="4.4" fill="#C9E3A6"/><circle cx="7" cy="7" r="1.5" fill="#EDF6DC"/></svg>';
    const drop = () => {
      const el = mk("", Math.random() < 0.32 ? cuke : petal);
      const x0 = R(0, 100), dur = R(7000, 12000), sway = R(14, 46), spin = R(-360, 360);
      el.style.left = x0 + "%"; el.style.top = "-8%";
      const t0 = performance.now();
      (function fall(now) {
        const p = (now - t0) / dur;
        if (p >= 1) { el.remove(); return; }
        el.style.transform =
          `translate(${Math.sin(p * 5.5) * sway}px, ${p * stage.clientHeight * 1.2}px) rotate(${spin * p}deg)`;
        el.style.opacity = p > 0.82 ? (1 - p) / 0.18 : 1;
        requestAnimationFrame(fall);
      })(t0);
    };
    for (let i = 0; i < 5; i++) setTimeout(drop, i * 900);
    setInterval(drop, 1500);
  }

  /* --- Ilona: hearts and dandelion seeds, at heartbeat tempo (72 bpm) --- */
  if (cat === "ilona") {
    const heart = '<svg width="15" height="15" viewBox="0 0 16 16"><path d="M8 14C3 10.6 1 8.4 1 5.9 1 3.7 2.7 2 4.8 2 6.1 2 7.3 2.7 8 3.8 8.7 2.7 9.9 2 11.2 2 13.3 2 15 3.7 15 5.9 15 8.4 13 10.6 8 14Z" fill="#D8556F"/></svg>';
    const seed  = '<svg width="16" height="18" viewBox="0 0 16 18"><path d="M8 17V8" stroke="#B9A98B" stroke-width="1.2"/><g stroke="#F3EBD8" stroke-width="1.3" stroke-linecap="round"><path d="M8 8 1 2M8 8 8 0M8 8 15 2M8 8 3 8M8 8 13 8"/></g></svg>';
    const rise = () => {
      const el = mk("", Math.random() < 0.45 ? heart : seed);
      const dur = R(6500, 10500), sway = R(16, 44), spin = R(-140, 140);
      el.style.left = R(6, 94) + "%"; el.style.top = "100%";
      const t0 = performance.now();
      (function up(now) {
        const p = (now - t0) / dur;
        if (p >= 1) { el.remove(); return; }
        el.style.transform =
          `translate(${Math.sin(p * 4.2) * sway}px, ${-p * stage.clientHeight * 1.15}px) rotate(${spin * p}deg)`;
        el.style.opacity = p < 0.12 ? p / 0.12 : (p > 0.78 ? (1 - p) / 0.22 : 1);
        requestAnimationFrame(up);
      })(t0);
    };
    rise();
    setInterval(rise, 833); // 72 bpm
  }
})();
