/* ==========================================================================
   Toddler Kitties — site behaviour
   ==========================================================================
   ►► THE ONLY LINE YOU NEED TO EDIT ◄◄
   Paste your form endpoint below (Formspree or Buttondown — see README).
   While it is empty, the signup form falls back to opening an email.
   ========================================================================== */

const SIGNUP_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

const FALLBACK_MAILTO =
  "mailto:toddlerkitties@gmail.com" +
  "?subject=" + encodeURIComponent("Add me to the Toddler Kitties list") +
  "&body="    + encodeURIComponent("Please let me know when the first book is ready.");

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const R = (a, b) => a + Math.random() * (b - a);

/* ---------- shared sprite snippets --------------------------------------- */

const SPR = {
  paw:
    '<svg width="36" height="64" viewBox="0 0 36 64" aria-hidden="true">' +
    '<rect x="10" y="16" width="16" height="48" rx="8" fill="#9C8C7E"/>' +
    '<circle cx="18" cy="13" r="12.5" fill="#9C8C7E"/>' +
    '<circle cx="11.5" cy="8" r="3.1" fill="#E0A6A6"/>' +
    '<circle cx="18" cy="5.6" r="3.1" fill="#E0A6A6"/>' +
    '<circle cx="24.5" cy="8" r="3.1" fill="#E0A6A6"/>' +
    '<ellipse cx="18" cy="14.5" rx="4.8" ry="4.2" fill="#E0A6A6"/></svg>',
  pom:
    '<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">' +
    '<circle cx="15" cy="15" r="12" fill="#7FC7E8"/>' +
    '<circle cx="11" cy="11" r="5" fill="#BDE6F8"/>' +
    '<circle cx="24" cy="6" r="2.4" fill="#FFF3B0"/>' +
    '<circle cx="5" cy="22" r="2" fill="#FFF3B0"/></svg>',
  petal: '<svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true"><ellipse cx="7" cy="7" rx="6.5" ry="3.4" fill="#E48CA4"/></svg>',
  cuke:  '<svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="6.4" fill="#4E8B45"/><circle cx="7" cy="7" r="4.4" fill="#C9E3A6"/><circle cx="7" cy="7" r="1.5" fill="#EDF6DC"/></svg>',
  heart: '<svg width="17" height="17" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14C3 10.6 1 8.4 1 5.9 1 3.7 2.7 2 4.8 2 6.1 2 7.3 2.7 8 3.8 8.7 2.7 9.9 2 11.2 2 13.3 2 15 3.7 15 5.9 15 8.4 13 10.6 8 14Z" fill="#D8556F"/></svg>',
  seed:  '<svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true"><path d="M8 17V8" stroke="#B9A98B" stroke-width="1.2"/><g stroke="#F3EBD8" stroke-width="1.3" stroke-linecap="round"><path d="M8 8 1 2M8 8 8 0M8 8 15 2M8 8 3 8M8 8 13 8"/></g></svg>',
  laserCss: "width:13px;height:13px;border-radius:50%;background:#FF3B2E;box-shadow:0 0 12px 5px rgba(255,59,46,.55)"
};

const PAGE_BG = { baker:"#EDE7FA", doc:"#EFF3FF", lulu:"#EAF7EF", ilona:"#FFF6DF" };

/* ---------- exit-transition helpers -------------------------------------- */

function txOverlay(bg) {
  const o = document.createElement("div");
  o.className = "tx-ov";
  o.style.cssText = "position:fixed;inset:0;z-index:999;pointer-events:none;overflow:hidden";
  const wash = document.createElement("div");
  wash.style.cssText = `position:absolute;inset:0;background:${bg};opacity:0`;
  wash.animate([{ opacity: 0 }, { opacity: 0.94 }],
               { duration: 240, fill: "forwards", easing: "ease-out" });
  o.appendChild(wash);
  document.body.appendChild(o);
  return o;
}

function put(o, html, css) {
  const s = document.createElement("span");
  s.style.cssText = "position:absolute;left:0;top:0;will-change:transform,opacity;" + css;
  s.innerHTML = html;
  o.appendChild(s);
  return s;
}

/* Each cat in the bottom menu gets their own send-off. */
function catExit(slug, href) {
  const o = txOverlay(PAGE_BG[slug] || "#F4EFFF");
  const W = innerWidth, H = innerHeight;

  if (slug === "baker") {
    // her laser zips across, the paw swats, the page flinches
    const dot = put(o, "", SPR.laserCss);
    dot.animate([
      { transform: `translate(${-30}px, ${H * 0.25}px)` },
      { transform: `translate(${W * 0.3}px, ${H * 0.6}px)`, offset: 0.3 },
      { transform: `translate(${W * 0.55}px, ${H * 0.3}px)`, offset: 0.55 },
      { transform: `translate(${W * 0.5}px, ${H * 0.52}px)`, offset: 0.75 },
      { transform: `translate(${W + 40}px, ${H * 0.4}px)` }
    ], { duration: 700, easing: "ease-in-out", fill: "forwards" });
    const paw = put(o, SPR.paw, "transform-origin:50% 100%");
    paw.animate([
      { transform: `translate(${W * 0.5 - 40}px, ${H + 90}px) scale(2.2)` },
      { transform: `translate(${W * 0.5 - 40}px, ${H * 0.42}px) scale(2.2)` }
    ], { duration: 260, delay: 300, easing: "cubic-bezier(.2,.9,.3,1.1)", fill: "forwards" });
    document.body.animate([
      { transform: "translate(0,0)" }, { transform: "translate(-5px,3px)" },
      { transform: "translate(4px,-3px)" }, { transform: "translate(-3px,2px)" },
      { transform: "translate(0,0)" }
    ], { duration: 260, delay: 560 });
  }

  if (slug === "doc") {
    // the pom pom is thrown; he is already on his way
    const pom = put(o, SPR.pom, "");
    const base = H * 0.72;
    pom.animate([
      { transform: `translate(-40px, ${base}px) rotate(0deg)` },
      { transform: `translate(${W * 0.22}px, ${base - H * 0.3}px) rotate(180deg)`, offset: 0.28 },
      { transform: `translate(${W * 0.45}px, ${base}px) rotate(340deg)`, offset: 0.52 },
      { transform: `translate(${W * 0.68}px, ${base - H * 0.18}px) rotate(520deg)`, offset: 0.76 },
      { transform: `translate(${W + 50}px, ${base}px) rotate(720deg)` }
    ], { duration: 820, easing: "linear", fill: "forwards" });
    for (let i = 0; i < 6; i++) {
      const s = put(o, "", "width:6px;height:6px;border-radius:50%;background:#FFF3B0;box-shadow:0 0 7px #FFE066");
      s.animate([
        { transform: `translate(${W * (0.1 + i * 0.15)}px, ${base + R(-30, 20)}px)`, opacity: 0 },
        { opacity: 1, offset: 0.5 },
        { transform: `translate(${W * (0.1 + i * 0.15) + R(-25, 25)}px, ${base + R(-70, -30)}px)`, opacity: 0 }
      ], { duration: 520, delay: i * 90, easing: "ease-out" });
    }
  }

  if (slug === "lulu") {
    // petals and cucumber, everywhere at once
    for (let i = 0; i < 16; i++) {
      const el = put(o, Math.random() < 0.35 ? SPR.cuke : SPR.petal, "");
      const x = R(0, W), sway = R(-70, 70), spin = R(-380, 380);
      el.animate([
        { transform: `translate(${x}px, -30px) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${x + sway}px, ${H + 40}px) rotate(${spin}deg)`, opacity: 0.9 }
      ], { duration: R(620, 900), delay: i * 26, easing: "cubic-bezier(.4,0,.8,1)", fill: "forwards" });
    }
  }

  if (slug === "ilona") {
    // hearts and dandelion seeds, rising all together
    for (let i = 0; i < 16; i++) {
      const el = put(o, Math.random() < 0.5 ? SPR.heart : SPR.seed, "");
      const x = R(0, W), sway = R(-60, 60), spin = R(-160, 160);
      el.animate([
        { transform: `translate(${x}px, ${H + 30}px) rotate(0deg) scale(${R(0.9, 1.6)})`, opacity: 0 },
        { opacity: 1, offset: 0.15 },
        { transform: `translate(${x + sway}px, -50px) rotate(${spin}deg)`, opacity: 0.9 }
      ], { duration: R(650, 900), delay: i * 28, easing: "cubic-bezier(.4,0,.8,1)", fill: "forwards" });
    }
  }

  setTimeout(() => { window.location.href = href; }, 880);
}

/* Leaving the About page: all four cats run home into the empty coat. */
function coatExit(href) {
  const o = txOverlay(getComputedStyle(document.body).backgroundColor);
  const W = innerWidth, H = innerHeight;

  // the coat, centre stage (clone the page's own if it's there)
  const src = document.getElementById("aboutCoat") || document.querySelector(".coat-mini");
  const holder = put(o, "", "left:50%;top:50%;transform:translate(-50%,-52%);width:min(46vw,220px)");
  if (src) {
    const clone = src.cloneNode(true);
    clone.removeAttribute("id");
    clone.style.width = "100%"; clone.style.height = "auto";
    holder.appendChild(clone);
  }
  holder.animate([{ opacity: 0, offset: 0 }, { opacity: 1 }],
                 { duration: 200, fill: "forwards", easing: "ease-out" });

  // four runners, two per side, staggered
  const cx = W / 2, cy = H / 2 + 6;
  const runners = [
    { slug: "baker", fromX: -110,   y: H * 0.30, delay: 0   },
    { slug: "doc",   fromX: W + 110, y: H * 0.34, delay: 110 },
    { slug: "lulu",  fromX: -110,   y: H * 0.62, delay: 220 },
    { slug: "ilona", fromX: W + 110, y: H * 0.66, delay: 330 }
  ];
  runners.forEach(({ slug, fromX, y, delay }) => {
    const el = put(o,
      `<svg width="86" height="86" viewBox="-6 -6 152 152" aria-hidden="true"><use href="#tk-${slug}"></use></svg>`, "");
    const dir = fromX < 0 ? 1 : -1;
    const midX = fromX + (cx - fromX) * 0.55;
    el.animate([
      { transform: `translate(${fromX - 43}px, ${y - 43}px) rotate(0deg) scale(1)`, opacity: 1 },
      { transform: `translate(${midX - 43}px, ${(y + cy) / 2 - 58}px) rotate(${dir * 8}deg) scale(1)`, offset: 0.45 },
      { transform: `translate(${(midX + cx) / 2 - 43}px, ${cy - 40}px) rotate(${dir * -7}deg) scale(.8)`, offset: 0.75 },
      { transform: `translate(${cx - 43}px, ${cy - 30}px) rotate(0deg) scale(.06)`, opacity: 0 }
    ], { duration: 640, delay, easing: "ease-in", fill: "forwards" });
  });

  setTimeout(() => { window.location.href = href; }, 1050);
}

/* ---------- 1. page-turn transitions ------------------------------------- */
(function pageTurn() {
  if (reduced) return;
  let navigating = false;
  document.addEventListener("click", (e) => {
    if (navigating) { e.preventDefault(); return; }
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const a = e.target.closest("a");
    if (!a || a.target === "_blank") return;
    const href = a.getAttribute("href") || "";
    if (!href.endsWith(".html") || href.startsWith("http") || href.startsWith("mailto")) return;
    e.preventDefault();
    navigating = true;

    const item = a.closest(".cat-item");
    if (document.body.dataset.exit === "coat" || a.closest(".coat-link")) {
      coatExit(href);                                   // the coat: everybody in
    } else if (item) {
      const cls = [...item.classList].find(c => c.startsWith("ci-"));
      catExit(cls ? cls.slice(3) : "", href);           // bottom menu: that cat's send-off
    } else {
      document.body.classList.add("leaving");           // everything else: quick fade
      setTimeout(() => { window.location.href = href; }, 200);
    }
  });
  // restore state when arriving via back/forward cache
  window.addEventListener("pageshow", () => {
    document.body.classList.remove("leaving");
    document.querySelectorAll(".tx-ov").forEach(el => el.remove());
  });
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
        // form-encoded body: works for both Formspree and Buttondown
        const res = await fetch(SIGNUP_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new URLSearchParams({ email })
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


/* ---------- tails: random, cat-natural wagging --------------------------- */
(function tails() {
  if (reduced) return;
  const tails = document.querySelectorAll(".cat-item .tk-tail, .stage .tk-tail");
  tails.forEach(el => {
    const o = el.getAttribute("data-o") || "96 128";
    let busy = false;
    const wag = () => {
      if (busy) return;
      busy = true;
      const amp = R(6, 16) * (Math.random() < 0.5 ? -1 : 1);   // random direction
      const swings = 2 + Math.floor(R(0, 3));                  // 2-4 swishes
      const dur = R(700, 1500);
      const t0 = performance.now();
      (function f(now) {
        const p = (now - t0) / dur;
        if (p >= 1) { el.setAttribute("transform", `rotate(0 ${o})`); busy = false; return; }
        const a = Math.sin(p * Math.PI * swings) * amp * (1 - p * 0.35);
        el.setAttribute("transform", `rotate(${a.toFixed(2)} ${o})`);
        requestAnimationFrame(f);
      })(t0);
    };
    (function loop() {
      setTimeout(() => { wag(); loop(); }, R(1200, 6500));     // random timing
    })();
  });
})();

/* ---------- about page: someone is in the coat ---------------------------- */
(function coatPeekaboo() {
  if (reduced) return;
  const peek = document.querySelector("#aboutCoat #coatPeek");
  if (!peek) return;
  const NS = "http://www.w3.org/2000/svg";
  const slugs = ["baker", "doc", "lulu", "ilona"];
  const show = () => {
    const s = slugs[Math.floor(Math.random() * slugs.length)];
    const g = document.createElementNS(NS, "g");
    const sv = document.createElementNS(NS, "svg");
    sv.setAttribute("x", "141"); sv.setAttribute("y", "224");
    sv.setAttribute("width", "38"); sv.setAttribute("height", "38");
    sv.setAttribute("viewBox", "-6 -6 152 152");
    const u = document.createElementNS(NS, "use");
    u.setAttribute("href", "#tk-" + s);
    sv.appendChild(u); g.appendChild(sv); peek.appendChild(g);
    g.style.transformBox = "fill-box";
    g.style.transformOrigin = "center";
    g.animate([
      { transform: "scale(0)", opacity: 0 },
      { transform: "scale(1.12)", opacity: 1, offset: 0.18 },
      { transform: "scale(1)", opacity: 1, offset: 0.28 },
      { transform: "scale(1)", opacity: 1, offset: 0.8 },
      { transform: "scale(0)", opacity: 0 }
    ], { duration: 2400, easing: "ease-in-out" }).onfinish = () => g.remove();
  };
  (function loop() {
    setTimeout(() => { show(); loop(); }, R(3500, 8500));
  })();
})();

/* ---------- 404: meow at the wrong door, the right one opens -------------- */
(function wrongDoor() {
  const btn = document.getElementById("nfBtn");
  const panel = document.getElementById("nfPanel");
  if (!btn || !panel) return;
  const bubble = document.getElementById("nfBubble");
  const meow = () => {
    if (!bubble) return;
    bubble.style.transformBox = "fill-box";
    bubble.style.transformOrigin = "20% 100%";
    bubble.animate([
      { opacity: 0, transform: "scale(.5)" },
      { opacity: 1, transform: "scale(1)", offset: 0.22 },
      { opacity: 1, transform: "scale(1)", offset: 0.72 },
      { opacity: 0, transform: "scale(.85)" }
    ], { duration: 950, easing: "ease-out" });
  };
  if (!reduced) (function idle() {
    setTimeout(() => { meow(); idle(); }, R(3200, 7000));
  })();
  btn.addEventListener("click", (e) => {
    const href = btn.getAttribute("href");
    e.preventDefault();
    if (reduced) { window.location.href = href; return; }
    meow();                                        // she meows at HER door...
    panel.style.transformBox = "fill-box";
    panel.style.transformOrigin = "left center";
    panel.animate([                                // ...and the OTHER one opens
      { transform: "skewY(0deg) scaleX(1)" },
      { transform: "skewY(-7deg) scaleX(.07)" }
    ], { duration: 480, delay: 430, easing: "cubic-bezier(.6,0,.4,1)", fill: "forwards" });
    setTimeout(() => { window.location.href = href; }, 1180);
  });
})();

/* ---------- 4. per-cat stage animations ----------------------------------- */
(function ambient() {
  if (reduced) return;
  const stage = document.querySelector("[data-stage]");
  if (!stage) return;
  const cat = document.body.dataset.theme;

  const mk = (cls, html) => {
    const el = document.createElement("span");
    el.className = "crit " + cls;
    if (html) el.innerHTML = html;
    stage.appendChild(el);
    return el;
  };

  /* --- Baker: laser dot; her eyes track it, and sometimes she swats --- */
  if (cat === "baker") {
    const dot = mk("laser");
    const pupils = stage.querySelector(".bk-pupils");
    const paw = mk("bk-paw", SPR.paw);

    let t = R(0, 100), tx = 0.5, ty = 0.4, hold = 0;
    let x = 0, y = 0, swatting = false;

    paw.style.transition = "none";
    paw.style.transform = `translate(-100px, 9999px)`;

    (function step() {
      t += 0.016;
      if (hold > 0) hold -= 1;
      else if (Math.random() < 0.012) { hold = R(30, 90); tx = R(0.1, 0.9); ty = R(0.12, 0.85); }
      const w = stage.clientWidth, h = stage.clientHeight;
      x = (tx + Math.sin(t * 2.3) * 0.05) * w;
      y = (ty + Math.cos(t * 3.1) * 0.05) * h;
      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
      if (pupils) {
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
      paw.style.transition = "none";
      paw.style.transform = `translate(${x - 18}px, ${h + 70}px)`;
      void paw.offsetWidth;
      paw.style.transition = "transform .26s cubic-bezier(.2,.9,.3,1.15)";
      paw.style.transform = `translate(${x - 18}px, ${y - 10}px)`;
      setTimeout(() => {
        tx = R(0.1, 0.9); ty = R(0.12, 0.8); hold = 0;   // the dot escapes, obviously
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
    const drop = () => {
      const el = mk("", Math.random() < 0.32 ? SPR.cuke : SPR.petal);
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
    const rise = () => {
      const el = mk("", Math.random() < 0.45 ? SPR.heart : SPR.seed);
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
