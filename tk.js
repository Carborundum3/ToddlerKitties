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
    '<rect x="10" y="16" width="16" height="48" rx="8" fill="#A98A63"/>' +
    '<circle cx="18" cy="13" r="12.5" fill="#A98A63"/>' +
    '<circle cx="11.5" cy="8" r="3.1" fill="#E0A6A6"/>' +
    '<circle cx="18" cy="5.6" r="3.1" fill="#E0A6A6"/>' +
    '<circle cx="24.5" cy="8" r="3.1" fill="#E0A6A6"/>' +
    '<ellipse cx="18" cy="14.5" rx="4.8" ry="4.2" fill="#E0A6A6"/></svg>',
  pom:
    '<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">' +
    '<circle cx="15" cy="15" r="12" fill="#FF7FB0"/>' +
    '<circle cx="11" cy="11" r="5" fill="#FFC2DA"/>' +
    '<circle cx="24" cy="6" r="2.4" fill="#FFF3B0"/>' +
    '<circle cx="5" cy="22" r="2" fill="#FFF3B0"/></svg>',
  pawDoc:
    '<svg width="36" height="64" viewBox="0 0 36 64" aria-hidden="true">' +
    '<rect x="9" y="16" width="18" height="48" rx="9" fill="#FBF8F3" stroke="#221E2C" stroke-width="2.6"/>' +
    '<circle cx="18" cy="13" r="13" fill="#FBF8F3" stroke="#221E2C" stroke-width="2.6"/>' +
    '<circle cx="11.5" cy="8" r="3.1" fill="#F0A8B4"/>' +
    '<circle cx="18" cy="5.6" r="3.1" fill="#F0A8B4"/>' +
    '<circle cx="24.5" cy="8" r="3.1" fill="#F0A8B4"/>' +
    '<ellipse cx="18" cy="14.5" rx="4.8" ry="4.2" fill="#F0A8B4"/></svg>',
  petal: '<svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true"><ellipse cx="7" cy="7" rx="6.5" ry="3.4" fill="#E48CA4"/></svg>',
  cuke:  '<svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="6.4" fill="#4E8B45"/><circle cx="7" cy="7" r="4.4" fill="#C9E3A6"/><circle cx="7" cy="7" r="1.5" fill="#EDF6DC"/></svg>',
  heart: '<svg width="17" height="17" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14C3 10.6 1 8.4 1 5.9 1 3.7 2.7 2 4.8 2 6.1 2 7.3 2.7 8 3.8 8.7 2.7 9.9 2 11.2 2 13.3 2 15 3.7 15 5.9 15 8.4 13 10.6 8 14Z" fill="#D8556F"/></svg>',
  seed:
    '<svg width="24" height="28" viewBox="0 0 24 28" aria-hidden="true">' +
    '<path d="M12 27 V12" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round"/>' +
    '<path d="M12 27 V12" stroke="#8A7A5E" stroke-width="1.8" stroke-linecap="round"/>' +
    '<circle cx="12" cy="26" r="2.2" fill="#8A7A5E"/>' +
    '<g stroke="#FFFFFF" stroke-width="4" stroke-linecap="round">' +
    '<path d="M12 12 3 3M12 12 12 1M12 12 21 3M12 12 1 12M12 12 23 12"/></g>' +
    '<g stroke="#6B5C7D" stroke-width="1.5" stroke-linecap="round">' +
    '<path d="M12 12 3 3M12 12 12 1M12 12 21 3M12 12 1 12M12 12 23 12"/></g>' +
    '<circle cx="12" cy="12" r="2.6" fill="#FFFFFF" stroke="#6B5C7D" stroke-width="1.4"/></svg>',
  pointer:
    '<svg width="48" height="20" viewBox="0 0 48 20" aria-hidden="true">' +
    '<rect x="7" y="5" width="35" height="11" rx="5.5" fill="#3B3646" stroke="#221E2C" stroke-width="2"/>' +
    '<rect x="17" y="2" width="9" height="5.5" rx="2.6" fill="#C8CBD6" stroke="#221E2C" stroke-width="1.6"/>' +
    '<rect x="34" y="7.5" width="6" height="6" rx="1.8" fill="#8E869C"/>' +
    '<circle cx="7" cy="10.5" r="3.6" fill="#FF3B2E"/></svg>',
  birdSvg: (a, b) =>
    '<svg width="36" height="28" viewBox="0 0 36 28" aria-hidden="true">' +
    '<path d="M27 11 l8 -5 -3 10 Z" fill="' + b + '" stroke="#2A2432" stroke-width="2" stroke-linejoin="round"/>' +
    '<ellipse cx="18" cy="15" rx="10.5" ry="8.5" fill="' + a + '" stroke="#2A2432" stroke-width="2"/>' +
    '<path d="M8 15 l-6 1.8 6 2 Z" fill="#F0B03C" stroke="#2A2432" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<circle cx="12.5" cy="12.5" r="2.4" fill="#241F2E"/>' +
    '<circle cx="13.4" cy="11.6" r=".9" fill="#fff"/>' +
    '<g class="bw"><path d="M18 13 C13 5 6 4 4 8 C9 10 13 13 17 17 Z" fill="' + b + '" stroke="#2A2432" stroke-width="2" stroke-linejoin="round"/></g>' +
    '</svg>',
  pawLulu:
    '<svg width="36" height="64" viewBox="0 0 36 64" aria-hidden="true">' +
    '<rect x="9" y="16" width="18" height="48" rx="9" fill="#9A928C" stroke="#2A2432" stroke-width="2.6"/>' +
    '<circle cx="18" cy="13" r="13" fill="#9A928C" stroke="#2A2432" stroke-width="2.6"/>' +
    '<circle cx="11.5" cy="8" r="3.2" fill="#F0A8B4"/>' +
    '<circle cx="18" cy="5.6" r="3.2" fill="#F0A8B4"/>' +
    '<circle cx="24.5" cy="8" r="3.2" fill="#F0A8B4"/>' +
    '<ellipse cx="18" cy="14.5" rx="5" ry="4.4" fill="#F0A8B4"/></svg>',
  crown:
    '<svg width="150" height="60" viewBox="0 0 150 60" aria-hidden="true">' +
    '<path d="M8 44 C30 20 58 12 75 12 C92 12 120 20 142 44" fill="none" stroke="#2A2432" stroke-width="9" stroke-linecap="round"/>' +
    '<path d="M8 44 C30 20 58 12 75 12 C92 12 120 20 142 44" fill="none" stroke="#4E9B62" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M30 33 q-9 -6 -9 -13 q10 1 11 10Z M118 32 q9 -6 9 -13 q-10 1 -11 10Z M75 18 q-9 -4 -11 -11 q10 -1 12 8Z"' +
    ' fill="#4E9B62" stroke="#2A2432" stroke-width="2.4" stroke-linejoin="round"/>' +
    // roses
    '<g stroke="#2A2432" stroke-width="2.4">' +
    '<circle cx="46" cy="20" r="10" fill="#E4708F"/><circle cx="104" cy="20" r="10" fill="#E4708F"/>' +
    '<circle cx="17" cy="38" r="8.5" fill="#C9506F"/></g>' +
    '<g fill="none" stroke="#A83458" stroke-width="2.2" stroke-linecap="round">' +
    '<path d="M46 20 a4.5 4.5 0 1 0 3.6 -4.4 M104 20 a4.5 4.5 0 1 0 3.6 -4.4 M17 38 a4 4 0 1 0 3.2 -3.9"/></g>' +
    // jasmine
    '<g stroke="#2A2432" stroke-width="2.2" fill="#FFFFFF">' +
    '<circle cx="75" cy="14" r="4.4"/><circle cx="68.5" cy="19" r="4.4"/><circle cx="81.5" cy="19" r="4.4"/>' +
    '<circle cx="71" cy="26" r="4.4"/><circle cx="79" cy="26" r="4.4"/>' +
    '<circle cx="130" cy="34" r="4"/><circle cx="124" cy="38.5" r="4"/><circle cx="136" cy="38.5" r="4"/>' +
    '<circle cx="126.5" cy="45" r="4"/><circle cx="133.5" cy="45" r="4"/></g>' +
    '<circle cx="75" cy="20.5" r="3.4" fill="#F2C542"/><circle cx="130" cy="39.5" r="3.1" fill="#F2C542"/>' +
    // harlequin
    '<g stroke="#2A2432" stroke-width="2.2">' +
    '<path d="M31 27 l3.6 -8.6 3.6 8.6 8.6 3.6 -8.6 3.6 -3.6 8.6 -3.6 -8.6 -8.6 -3.6Z" fill="#E86A3A"/>' +
    '<path d="M119 27 l3.6 -8.6 3.6 8.6 8.6 3.6 -8.6 3.6 -3.6 8.6 -3.6 -8.6 -8.6 -3.6Z" fill="#B79BE8"/>' +
    '<path d="M60 34 l3 -7 3 7 7 3 -7 3 -3 7 -3 -7 -7 -3Z" fill="#E86A3A"/>' +
    '<path d="M90 34 l3 -7 3 7 7 3 -7 3 -3 7 -3 -7 -7 -3Z" fill="#B79BE8"/></g>' +
    '<g fill="#F2C542"><circle cx="34.6" cy="30.6" r="2.6"/><circle cx="122.6" cy="30.6" r="2.6"/>' +
    '<circle cx="63" cy="37" r="2.2"/><circle cx="93" cy="37" r="2.2"/></g></svg>',
  leaf:
    '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">' +
    '<path d="M18 2 C8 2 2 8 2 18 C12 18 18 12 18 2 Z" fill="#6FA85A" stroke="#2A2432" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M17 3 L4 16" stroke="#3E7A42" stroke-width="1.8" stroke-linecap="round"/></svg>',
  droplet:
    '<svg width="14" height="18" viewBox="0 0 14 18" aria-hidden="true">' +
    '<path d="M7 1 C11 7 13 10 13 12.4 A6 6 0 0 1 1 12.4 C1 10 3 7 7 1 Z" fill="#8FCBE0" stroke="#2A6E88" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<circle cx="5" cy="11" r="1.8" fill="#E8F6FB"/></svg>',
  mouse:
    '<svg width="42" height="24" viewBox="0 0 42 24" aria-hidden="true">' +
    '<path d="M6 18 C0 18 -4 14 -2 11" fill="none" stroke="#2A2432" stroke-width="4.4" stroke-linecap="round"/>' +
    '<path d="M6 18 C0 18 -4 14 -2 11" fill="none" stroke="#D9A3AE" stroke-width="2.4" stroke-linecap="round"/>' +
    '<circle cx="24" cy="8" r="7" fill="#9A928C" stroke="#2A2432" stroke-width="2.2"/>' +
    '<circle cx="24" cy="8" r="3.4" fill="#E8B9C2"/>' +
    '<ellipse cx="17" cy="15" rx="13" ry="8" fill="#9A928C" stroke="#2A2432" stroke-width="2.4"/>' +
    '<circle cx="8" cy="13" r="2" fill="#241F2E"/>' +
    '<circle cx="8.7" cy="12.3" r=".7" fill="#fff"/>' +
    '<path d="M4 15 l-1.5 1.6" stroke="#2A2432" stroke-width="1.4" stroke-linecap="round"/></svg>',
  pawIlona:
    '<svg width="36" height="64" viewBox="0 0 36 64" aria-hidden="true">' +
    '<rect x="9" y="16" width="18" height="48" rx="9" fill="#DFA968" stroke="#2A2432" stroke-width="2.6"/>' +
    '<circle cx="18" cy="13" r="13" fill="#DFA968" stroke="#2A2432" stroke-width="2.6"/>' +
    '<circle cx="11.5" cy="8" r="3.2" fill="#E8AFAF"/>' +
    '<circle cx="18" cy="5.6" r="3.2" fill="#E8AFAF"/>' +
    '<circle cx="24.5" cy="8" r="3.2" fill="#E8AFAF"/>' +
    '<ellipse cx="18" cy="14.5" rx="5" ry="4.4" fill="#E8AFAF"/></svg>',
  laserCss: "width:13px;height:13px;border-radius:50%;background:#FF3B2E;box-shadow:0 0 12px 5px rgba(255,59,46,.55)"
};

const CAT_SLUGS = ["baker", "doc", "lulu", "ilona"];

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
    // pom poms, every colour, all at once — then the chonk himself lands on the page
    const COL = [["#FF7FB0", "#D1497F"], ["#8ED0F0", "#2E86B5"], ["#F2C542", "#B98D0C"],
                 ["#8FD48A", "#3E8B46"], ["#B79BE8", "#7154B0"], ["#FF9E5E", "#CE6B27"]];
    for (let i = 0; i < 20; i++) {
      const [a, b] = COL[Math.floor(R(0, COL.length))];
      const sz = R(15, 30);
      const el = put(o, "", `width:${sz}px;height:${sz}px;border-radius:50%;` +
        `background:radial-gradient(circle at 34% 30%, #fff, ${a} 46%, ${b});` +
        `box-shadow:0 0 10px ${a}`);
      const x = R(0, W), sway = R(-80, 80), spin = R(-460, 460);
      el.animate([
        { transform: `translate(${x}px, -40px) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${x + sway}px, ${H + 50}px) rotate(${spin}deg)`, opacity: 0.95 }
      ], { duration: R(600, 900), delay: i * 22, easing: "cubic-bezier(.4,0,.8,1)", fill: "forwards" });
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
    // leaves and river spray, sweeping up the valley
    for (let i = 0; i < 18; i++) {
      const el = put(o, Math.random() < 0.55 ? SPR.leaf : SPR.droplet, "");
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
    // any link that lands on a cat page gets that cat's send-off — the bottom
    // menu, the "Meet X" buttons, the crew cards, the nav.
    const target = href.replace(/^\.?\//, "").replace(".html", "");
    const cls = item ? [...item.classList].find(c => c.startsWith("ci-")) : null;
    const slug = cls ? cls.slice(3)
               : (CAT_SLUGS.includes(target) ? target : "");

    if (document.body.dataset.exit === "coat" || a.closest(".coat-link")) {
      coatExit(href);                                   // the coat: everybody in
    } else if (slug) {
      catExit(slug, href);                              // that cat's send-off
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
  const coat = document.getElementById("aboutCoat");
  if (!coat) return;
  const gap  = coat.querySelector("#coatPeek");   // clipped to the coat opening
  const over = coat.querySelector("#coatPaw");    // sits on top of the coat
  if (!gap || !over) return;

  const NS = "http://www.w3.org/2000/svg";
  const FUR = { baker: ["#A98A63", "#E0A6A6"], doc:   ["#3A3542", "#F0A8B4"],
                lulu:  ["#9A928C", "#F0A8B4"], ilona: ["#DFA968", "#E8AFAF"] };
  const slugs = Object.keys(FUR);

  const el = (n, a) => {
    const e = document.createElementNS(NS, n);
    for (const k in a) e.setAttribute(k, a[k]);
    return e;
  };
  const play = (node, from, to, dur) => {
    node.animate([
      { transform: from, opacity: 0 },
      { transform: to,   opacity: 1, offset: .2 },
      { transform: to,   opacity: 1, offset: .76 },
      { transform: from, opacity: 0 }
    ], { duration: dur, easing: "cubic-bezier(.3,.85,.4,1)" }).onfinish = () => node.remove();
  };

  /* the top of a head, rising into the opening — the coat crops the rest */
  const head = (s) => {
    const wrap = el("g", {});
    const sv = el("svg", { x: 132, y: 318, width: 58, height: 58, viewBox: "-6 -6 152 152" });
    sv.appendChild(el("use", { href: "#tk-" + s }));
    wrap.appendChild(sv);
    gap.appendChild(wrap);
    play(wrap, "translateY(50px)", "translateY(0px)", 2700);
  };

  /* one paw, hooked over the edge of the opening */
  const paw = (s) => {
    const [fur, pad] = FUR[s];
    const left = Math.random() < 0.5;
    const wrap = el("g", {});
    const g = el("g", { transform: `translate(${left ? 143 : 177} ${R(226, 300)}) ` +
                                   `scale(${left ? 1 : -1} 1)` });
    g.appendChild(el("path", {
      d: "M0 34 L0 0 C-6 0 -9 3 -10 7 C-13 3 -18 5 -19 10 C-23 10 -26 15 -25 20 C-24 29 -13 34 0 34 Z",
      fill: fur, stroke: "#3B2E4A", "stroke-width": 3.6, "stroke-linejoin": "round" }));
    [[-6.5, 7], [-14.5, 11], [-20.5, 18]].forEach(([cx, cy]) =>
      g.appendChild(el("circle", { cx, cy, r: 2.5, fill: pad })));
    g.appendChild(el("ellipse", { cx: -11, cy: 24, rx: 5.6, ry: 4.4, fill: pad }));
    wrap.appendChild(g);
    over.appendChild(wrap);
    play(wrap, left ? "translateX(-20px)" : "translateX(20px)", "translateX(0px)", 2600);
  };

  /* a tail tip, escaping under the hem */
  const tail = (s) => {
    const [fur] = FUR[s];
    const right = Math.random() < 0.5;
    const wrap = el("g", {});
    const g = el("g", { transform: `translate(${right ? 226 : 94} 406) scale(${right ? 1 : -1} 1)` });
    g.appendChild(el("path", { d: "M0 26 C24 28 36 18 33 2", fill: "none",
      stroke: "#3B2E4A", "stroke-width": 17, "stroke-linecap": "round" }));
    g.appendChild(el("path", { d: "M0 26 C24 28 36 18 33 2", fill: "none",
      stroke: fur, "stroke-width": 11, "stroke-linecap": "round" }));
    wrap.appendChild(g);
    over.appendChild(wrap);
    play(wrap, "translateX(-26px)", "translateX(0px)", 2500);
  };

  const show = () => {
    const s = slugs[Math.floor(Math.random() * slugs.length)];
    const r = Math.random();
    if (r < 0.42) head(s);
    else if (r < 0.85) paw(s);
    else tail(s);
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
  const openDoor = (e) => {
    const href = "home.html";
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
  };
  [btn, document.getElementById("nfDoorLink")].forEach(n => {
    if (n) n.addEventListener("click", openDoor);
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

  /* --- Baker: a real laser pointer. It drifts around whether or not the beam
         is on. When it goes out she stares at the pointer and waits. --- */
  if (cat === "baker") {
    const beam    = mk("beam");
    const dot     = mk("laser");
    const pointer = mk("pointer", SPR.pointer);
    const pupils  = stage.querySelector(".bk-pupils");
    const paw     = mk("bk-paw", SPR.paw);

    beam.style.cssText += "height:3px;border-radius:2px;transform-origin:0 50%;z-index:3;" +
      "background:linear-gradient(90deg, rgba(255,59,46,.9), rgba(255,59,46,.12));" +
      "box-shadow:0 0 9px rgba(255,59,46,.5);opacity:0;transition:opacity .12s linear";
    dot.style.transition = "opacity .1s linear";
    pointer.style.transformOrigin = "7px 10.5px";
    pointer.style.zIndex = 5;

    let on = true, t = R(0, 100), tx = 0.5, ty = 0.6, hold = 0;
    let x = 0, y = 0, hx = 0, hy = 0, swatting = false;

    paw.style.transition = "none";
    paw.style.transform = "translate(-100px, 9999px)";

    (function blink() {                        // somebody keeps letting go of the button
      setTimeout(() => {
        on = false;
        setTimeout(() => { on = true; }, R(1500, 3400));
        blink();
      }, R(5000, 9500));
    })();

    (function step() {
      t += 0.016;
      const w = stage.clientWidth, h = stage.clientHeight;

      // the pointer itself, always moving, on or off
      hx = (0.78 + Math.sin(t * 0.5) * 0.17) * w;
      hy = (0.88 + Math.cos(t * 0.42) * 0.07) * h;

      // where the beam is aimed
      if (hold > 0) hold -= 1;
      else if (Math.random() < 0.012) { hold = R(30, 90); tx = R(0.08, 0.86); ty = R(0.26, 0.86); }
      x = (tx + Math.sin(t * 2.3) * 0.05) * w;
      y = (ty + Math.cos(t * 3.1) * 0.05) * h;

      const dx = x - hx, dy = y - hy;
      const ang = Math.atan2(dy, dx) * 180 / Math.PI;
      pointer.style.transform = `translate(${hx - 7}px, ${hy - 10.5}px) rotate(${ang + 180}deg)`;

      dot.style.opacity   = on ? 1 : 0;
      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
      beam.style.opacity  = on ? 0.8 : 0;
      beam.style.width    = Math.hypot(dx, dy) + "px";
      beam.style.transform = `translate(${hx}px, ${hy - 1.5}px) rotate(${ang}deg)`;

      if (pupils) {                    // beam on, she watches the dot. Off, she watches the pointer.
        const gx = on ? x : hx, gy = on ? y : hy;
        const ex = (gx / w - 0.5) * 7, ey = (gy / h - 0.45) * 5;
        pupils.setAttribute("transform",
          `translate(${Math.max(-3.5, Math.min(3.5, ex))} ${Math.max(-2, Math.min(3, ey))})`);
      }
      requestAnimationFrame(step);
    })();

    const swat = () => {
      if (swatting || !on) return;             // no beam, nothing to hit
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

  /* --- Doc: a pink pom pom. His eyes track it, he bats at it and mostly
         misses, and every so often it leaves the room and a new colour
         turns up in its place. --- */
  if (cat === "doc") {
    const POMS = [["#FF7FB0", "#D1497F"],   // pink first, always
                  ["#8ED0F0", "#2E86B5"],
                  ["#F2C542", "#B98D0C"],
                  ["#8FD48A", "#3E8B46"],
                  ["#B79BE8", "#7154B0"],
                  ["#FF9E5E", "#CE6B27"]];

    const pom    = mk("pom");
    const sparks = [mk("spark"), mk("spark"), mk("spark")];
    const pupils = stage.querySelector(".dc-pupils");
    const paw    = mk("bk-paw", SPR.pawDoc);

    let ci = 0, t = R(0, 6), dir = 1;
    let px = 0.22, py = 0.86, x = 0, y = 0, pop = 1;
    let state = "roll";          // roll | exit | wait | enter
    let swatting = false;

    const paint = () => {
      const [a, b] = POMS[ci];
      pom.style.background = `radial-gradient(circle at 34% 32%, #fff, ${a} 46%, ${b})`;
      pom.style.boxShadow  = `0 0 10px ${a}`;
    };
    paint();

    paw.style.transition = "none";
    paw.style.transform  = "translate(-200px, 9999px)";

    const bounce = () => 0.86 - Math.abs(Math.sin(t * 5.2)) * 0.09;

    (function step() {
      t += 0.0075;
      pop += (1 - pop) * 0.13;

      if (state === "roll") {
        px += dir * 0.0032;
        if (px > 0.94) { px = 0.94; dir = -1; }
        if (px < 0.06) { px = 0.06; dir =  1; }
        py = bounce();
      } else if (state === "exit") {
        px += dir * 0.013;
        py = 0.87;
        if (px > 1.35 || px < -0.35) {
          state = "wait";
          pom.style.opacity = 0;
          ci = (ci + 1 + Math.floor(Math.random() * (POMS.length - 1))) % POMS.length;
          paint();
          setTimeout(() => {
            dir = -dir;
            px  = dir > 0 ? -0.2 : 1.2;
            pom.style.opacity = 1;
            state = "enter";
          }, R(900, 2200));
        }
      } else if (state === "enter") {
        px += dir * 0.010;
        py = bounce();
        if (px > 0.2 && px < 0.8) state = "roll";
      }

      const w = stage.clientWidth, h = stage.clientHeight;
      x = px * w; y = py * h;
      pom.style.transform = `translate(${x - 10}px, ${y - 10}px) scale(${pop})`;

      const lit = (state === "roll" || state === "enter");
      sparks.forEach((s, i) => {
        const a = t * (7 + i * 2) + i * 2.1;
        s.style.transform = `translate(${x - 2 + Math.cos(a) * 15}px, ${y - 2 + Math.sin(a) * 13}px)`;
        s.style.opacity = lit ? 0.35 + 0.65 * Math.abs(Math.sin(a)) : 0;
      });

      if (pupils) {                                  // his eyes follow the pom pom
        const dx = state === "wait" ? 0 : (px - 0.5) * 7.5;
        const dy = state === "wait" ? 0 : (py - 0.5) * 5;
        pupils.setAttribute("transform",
          `translate(${Math.max(-3.6, Math.min(3.6, dx))} ${Math.max(-2, Math.min(3.2, dy))})`);
      }
      requestAnimationFrame(step);
    })();

    /* the bat. Connects about a quarter of the time. */
    const swat = () => {
      if (swatting || state !== "roll") return;
      swatting = true;
      const hit = Math.random() < 0.25;
      const h = stage.clientHeight;
      paw.style.transition = "none";
      paw.style.transform = `translate(${x - 18}px, ${h + 70}px)`;
      void paw.offsetWidth;
      paw.style.transition = "transform .24s cubic-bezier(.2,.9,.3,1.15)";
      paw.style.transform = `translate(${x - 18}px, ${y - 30}px)`;
      setTimeout(() => {
        if (hit) {
          pop = 1.55;
          dir = -dir;
          px  = Math.max(0.06, Math.min(0.94, px + dir * 0.2));
        } else {
          px  = Math.max(0.06, Math.min(0.94, px + dir * 0.09));   // it gets away
        }
        paw.style.transition = "transform .3s ease-in";
        paw.style.transform = `translate(${x - 18}px, ${h + 70}px)`;
        setTimeout(() => { swatting = false; }, 320);
      }, 360);
    };
    (function scheduleSwat() {
      setTimeout(() => { swat(); scheduleSwat(); }, R(3800, 7500));
    })();

    /* every so often it goes right out of the box */
    (function scheduleLoss() {
      setTimeout(() => {
        if (state === "roll" && !swatting) state = "exit";
        scheduleLoss();
      }, R(15000, 28000));
    })();
  }

  /* --- Lulu: her garden. Petals and cucumber falling, birds passing
         overhead that she watches and sometimes takes a swing at. --- */
  if (cat === "lulu") {
    const drop = () => {
      const el = mk("", Math.random() < 0.32 ? SPR.cuke : SPR.petal);
      const x = R(0.05, 0.95) * stage.clientWidth;
      const sway = R(-26, 26), spin = R(-320, 320);
      let p = 0;
      (function fall() {
        p += 0.0024;
        el.style.opacity = p < 0.1 ? p * 10 : (p > 0.9 ? (1 - p) * 10 : 1);
        el.style.transform =
          `translate(${x + Math.sin(p * 5.5) * sway}px, ${p * stage.clientHeight * 1.2}px) rotate(${spin * p}deg)`;
        if (p < 1) requestAnimationFrame(fall); else el.remove();
      })();
    };
    setInterval(drop, 2600);
    drop();

    const BIRDS = [["#A8CBF0", "#8FB9E8"], ["#F6D97A", "#E0BE45"], ["#F3AFBA", "#DE8C9C"]];
    const pupils = stage.querySelector(".lu-pupils");
    const paw = mk("bk-paw", SPR.pawLulu);
    paw.style.transition = "none";
    paw.style.transform = "translate(-200px, 9999px)";

    let bird = null, bcol = BIRDS[0], bx = 0, by = 0.22, bdir = 1, bpop = 1;
    let t = R(0, 40), swatting = false;

    // a crown of roses, jasmine and harlequin. It does not always survive.
    let crown = null, stolen = false, cw = 0;
    const crownOn = () => {
      if (crown) return;
      crown = mk("crown", SPR.crown);
      stolen = false;
      crown.style.opacity = 0;
      crown.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, fill: "forwards" });
    };
    (function scheduleCrown() {
      setTimeout(() => { crownOn(); scheduleCrown(); }, R(14000, 26000));
    })();
    setTimeout(crownOn, 2600);
    let gx = 0.5, gy = 0.44, tgx = 0.5, tgy = 0.44, hold = 0;   // where she is looking

    const launch = () => {
      if (bird) return;
      bcol = BIRDS[Math.floor(R(0, BIRDS.length))];
      bird = mk("bird", SPR.birdSvg(bcol[0], bcol[1]));
      bdir = Math.random() < 0.5 ? 1 : -1;
      bx = bdir > 0 ? -0.18 : 1.18;
      by = R(0.13, 0.34);
      bpop = 1;
    };

    (function step() {
      t += 0.016;
      bpop += (1 - bpop) * 0.12;
      const w = stage.clientWidth, h = stage.clientHeight;

      if (bird) {
        bx += bdir * 0.0034;
        const yy = by + Math.sin(t * 3.1) * 0.028;
        bird.style.transform =
          `translate(${bx * w - 18}px, ${yy * h - 14}px) scale(${bdir > 0 ? -bpop : bpop}, ${bpop})`;
        if (bx > 1.32 || bx < -0.32) { bird.remove(); bird = null; }
        else { gx = bx; gy = yy; }                    // she is watching it
      } else {
        if (hold > 0) hold -= 1;                      // otherwise she looks around,
        else if (Math.random() < 0.009) {             // and mostly forward
          hold = R(70, 190);
          if (Math.random() < 0.6) { tgx = 0.5; tgy = 0.45; }
          else { tgx = R(0.2, 0.8); tgy = R(0.3, 0.7); }
        }
        gx += (tgx - gx) * 0.05;
        gy += (tgy - gy) * 0.05;
      }

      if (pupils) {
        const ex = (gx - 0.5) * 7, ey = (gy - 0.45) * 5;
        pupils.setAttribute("transform",
          `translate(${Math.max(-3.4, Math.min(3.4, ex))} ${Math.max(-2, Math.min(3, ey))})`);
      }

      if (crown) {
        // the cat art sits in the stage with 7% padding and a square viewBox
        cw = w * 0.86 * (134 / 152);
        const hx = (0.07 + 12 / 152 * 0.86) * w;
        const hy = (0.07 + 26 / 152 * 0.86) * h;
        crown.style.width = cw + "px";
        if (stolen && bird) {
          crown.style.transform =
            `translate(${bx * w - cw * 0.5}px, ${(by + Math.sin(t * 3.1) * 0.028) * h + 8}px) ` +
            `rotate(${bdir > 0 ? 16 : -16}deg) scale(.55)`;
        } else if (!stolen) {
          crown.style.transform = `translate(${hx}px, ${hy}px) rotate(${Math.sin(t * 0.9) * 1.6}deg)`;
        }
      }
      requestAnimationFrame(step);
    })();

    const feather = (x, y) => {
      const f = mk("", `<svg width="12" height="12" viewBox="0 0 12 12"><ellipse cx="6" cy="6" rx="5.4" ry="2.6" fill="${bcol[0]}" stroke="#2A2432" stroke-width="1.4"/></svg>`);
      const sway = R(-30, 30), spin = R(-260, 260);
      let p = 0;
      (function fall() {
        p += 0.011;
        f.style.opacity = p > 0.75 ? (1 - p) * 4 : 1;
        f.style.transform = `translate(${x + Math.sin(p * 6) * sway}px, ${y + p * stage.clientHeight * 0.7}px) rotate(${spin * p}deg)`;
        if (p < 1) requestAnimationFrame(fall); else f.remove();
      })();
    };

    const swat = () => {
      if (swatting || !bird) return;
      swatting = true;
      const hit = Math.random() < 0.2;
      const w = stage.clientWidth, h = stage.clientHeight;
      const tx = bx * w, ty = by * h;
      paw.style.transition = "none";
      paw.style.transform = `translate(${tx - 18}px, ${h + 70}px)`;
      void paw.offsetWidth;
      paw.style.transition = "transform .3s cubic-bezier(.2,.9,.3,1.15)";
      paw.style.transform = `translate(${tx - 18}px, ${ty + 26}px)`;
      setTimeout(() => {
        if (crown && !stolen && bird) {
          stolen = true;                              // it takes the crown instead
          bpop = 1.35;
          by = Math.max(0.05, by - 0.1);
          const c = crown;
          setTimeout(() => { if (c === crown) { c.remove(); crown = null; } }, 3200);
        } else if (hit && bird) {
          bpop = 1.4;
          by = Math.max(0.06, by - 0.11);             // startled, straight up
          bx += bdir * 0.07;
          for (let i = 0; i < 3; i++) feather(tx + R(-14, 14), ty + R(-6, 10));
        }
        paw.style.transition = "transform .32s ease-in";
        paw.style.transform = `translate(${tx - 18}px, ${h + 70}px)`;
        setTimeout(() => { swatting = false; }, 340);
      }, 430);
    };
    (function scheduleSwat() {
      setTimeout(() => { swat(); scheduleSwat(); }, R(3200, 6500));
    })();
    (function scheduleBird() {
      setTimeout(() => { launch(); scheduleBird(); }, R(5500, 11000));
    })();
    setTimeout(launch, 1400);
  }

  /* --- Ilona: leaves on the wind, spray off the water, and a mouse she
         watches intently and almost never catches. --- */
  if (cat === "ilona") {
    const drift = () => {
      const el = mk("", SPR.leaf);
      const x = R(0.05, 0.95) * stage.clientWidth;
      const sway = R(-30, 30), spin = R(-300, 300);
      let p = 0;
      (function fall() {
        p += 0.0026;
        el.style.opacity = p < 0.1 ? p * 10 : (p > 0.88 ? (1 - p) * 8.3 : 1);
        el.style.transform =
          `translate(${x + Math.sin(p * 5) * sway}px, ${p * stage.clientHeight * 1.1}px) rotate(${spin * p}deg)`;
        if (p < 1) requestAnimationFrame(fall); else el.remove();
      })();
    };
    setInterval(drift, 3000);
    drift();

    const spray = () => {                              // spray coming off the stream
      const el = mk("", SPR.droplet);
      const x = R(0.08, 0.92) * stage.clientWidth;
      const lift = R(0.14, 0.3), sway = R(-16, 16);
      let p = 0;
      (function up() {
        p += 0.012;
        el.style.opacity = p > 0.6 ? (1 - p) * 2.5 : 1;
        el.style.transform =
          `translate(${x + Math.sin(p * 4) * sway}px, ${stage.clientHeight * (0.94 - lift * Math.sin(p * Math.PI))}px) scale(${0.6 + 0.4 * (1 - p)})`;
        if (p < 1) requestAnimationFrame(up); else el.remove();
      })();
    };
    setInterval(spray, 1100);

    const pupils = stage.querySelector(".il-pupils");
    const paw = mk("bk-paw", SPR.pawIlona);
    paw.style.transition = "none";
    paw.style.transform = "translate(-200px, 9999px)";

    let mouse = null, mx = 0, my = 0.82, mdir = 1, pause = 0;
    let t = R(0, 40), swatting = false;
    let gx = 0.5, gy = 0.46, tgx = 0.5, tgy = 0.46, hold = 0;

    const launch = () => {
      if (mouse) return;
      mouse = mk("mouse", SPR.mouse);
      mdir = Math.random() < 0.5 ? 1 : -1;
      mx = mdir > 0 ? -0.15 : 1.15;
      my = R(0.78, 0.9);
      pause = 0;
    };

    (function step() {
      t += 0.016;
      const w = stage.clientWidth, h = stage.clientHeight;

      if (mouse) {
        if (pause > 0) pause -= 1;                     // stops, twitches, carries on
        else {
          mx += mdir * 0.0055;
          if (Math.random() < 0.006) pause = R(30, 80);
        }
        const jitter = pause > 0 ? Math.sin(t * 26) * 0.9 : 0;
        mouse.style.transform =
          `translate(${mx * w - 21 + jitter}px, ${my * h - 12}px) scaleX(${mdir > 0 ? -1 : 1})`;
        if (mx > 1.3 || mx < -0.3) { mouse.remove(); mouse = null; }
        else { gx = mx; gy = my; }
      } else {
        if (hold > 0) hold -= 1;                       // otherwise, the blank stare
        else if (Math.random() < 0.006) {
          hold = R(140, 320);
          if (Math.random() < 0.7) { tgx = 0.5; tgy = 0.46; }
          else { tgx = R(0.25, 0.75); tgy = R(0.35, 0.6); }
        }
        gx += (tgx - gx) * 0.022;
        gy += (tgy - gy) * 0.022;
      }

      if (pupils) {
        const ex = (gx - 0.5) * 7, ey = (gy - 0.45) * 5;
        pupils.setAttribute("transform",
          `translate(${Math.max(-3.4, Math.min(3.4, ex))} ${Math.max(-2, Math.min(3.2, ey))})`);
      }
      requestAnimationFrame(step);
    })();

    const swat = () => {
      if (swatting || !mouse) return;
      swatting = true;
      const hit = Math.random() < 0.08;                // almost never
      const w = stage.clientWidth, h = stage.clientHeight;
      const tx = mx * w, ty = my * h;
      paw.style.transition = "none";
      paw.style.transform = `translate(${tx - 18}px, ${h + 70}px)`;
      void paw.offsetWidth;
      paw.style.transition = "transform .26s cubic-bezier(.2,.9,.3,1.15)";
      paw.style.transform = `translate(${tx - 18}px, ${ty - 18}px)`;
      setTimeout(() => {
        if (mouse) {
          pause = 0;
          mx += mdir * (hit ? 0.02 : 0.13);            // a miss means it bolts
        }
        paw.style.transition = "transform .3s ease-in";
        paw.style.transform = `translate(${tx - 18}px, ${h + 70}px)`;
        setTimeout(() => { swatting = false; }, 320);
      }, 380);
    };
    (function scheduleSwat() {
      setTimeout(() => { swat(); scheduleSwat(); }, R(2600, 5200));
    })();
    (function scheduleMouse() {
      setTimeout(() => { launch(); scheduleMouse(); }, R(6000, 12000));
    })();
    setTimeout(launch, 2000);
  }
})();
