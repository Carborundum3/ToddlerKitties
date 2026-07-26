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

/* ---------- 1. scroll reveal --------------------------------------------- */
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

/* ---------- 2. email signup ---------------------------------------------- */
(function signup() {
  document.querySelectorAll("form[data-signup]").forEach(form => {
    const note  = form.parentElement.querySelector(".signup__note");
    const input = form.querySelector('input[type="email"]');
    const trap  = form.querySelector('input[name="_hp"]');

    if (SIGNUP_ENDPOINT) { form.setAttribute("action", SIGNUP_ENDPOINT); }

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (trap && trap.value) return;            // bot caught in the honeypot
      const email = (input.value || "").trim();
      if (!email || !input.checkValidity()) {
        if (note) note.textContent = "That address didn't parse. Try again?";
        input.focus();
        return;
      }
      if (!SIGNUP_ENDPOINT) {
        window.location.href = FALLBACK_MAILTO;
        if (note) note.textContent = "Opening your email app — just hit send.";
        return;
      }
      if (note) note.textContent = "Filing…";
      try {
        const res = await fetch(SIGNUP_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        if (note) note.textContent = "You're on the list. The bailiff has your name.";
      } catch (err) {
        if (note) note.textContent = "That didn't go through. Email toddlerkitties@gmail.com instead.";
      }
    });
  });
})();

/* ---------- 3. per-cat ambient motion ------------------------------------ */
(function ambient() {
  if (reduced) return;
  const stage = document.querySelector("[data-stage]");
  if (!stage) return;
  const cat = document.body.dataset.cat;

  const mk = (cls, html) => {
    const el = document.createElement("span");
    el.className = "crit " + cls;
    if (html) el.innerHTML = html;
    stage.appendChild(el);
    return el;
  };
  const R = (a, b) => a + Math.random() * (b - a);

  /* --- Baker: a laser dot she is definitely not falling for --- */
  if (cat === "baker") {
    const dot = mk("laser");
    let t = R(0, 100), tx = 0.5, ty = 0.5, hold = 0;
    (function step() {
      t += 0.016;
      if (hold > 0) { hold -= 1; }
      else if (Math.random() < 0.012) { hold = R(30, 90); tx = R(0.1, 0.9); ty = R(0.15, 0.9); }
      const w = stage.clientWidth, h = stage.clientHeight;
      const x = (tx + Math.sin(t * 2.3) * 0.05) * w;
      const y = (ty + Math.cos(t * 3.1) * 0.05) * h;
      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
      requestAnimationFrame(step);
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
