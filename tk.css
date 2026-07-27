/* ==========================================================================
   Toddler Kitties
   Sticker-storybook theme: chunky outlines, hard offset shadows, rounded type.
   Every page can take on one cat's colour via body[data-theme].
   ========================================================================== */

:root{
  --ink:      #3B2E4A;
  --ink-soft: #6B5C7D;
  --outline:  #3B2E4A;
  --card:     #FFFFFF;
  --page-bg:  #F4EFFF;
  --pink:     #FF8FB1;

  --accent:     var(--pink);
  --accent-ink: #C2456E;

  --shadow: 6px 6px 0 rgba(59,46,74,.15);

  --wrap: 1060px;
  --gut:  clamp(1.1rem, 4vw, 2.5rem);
  --r:    26px;
}

body[data-theme="baker"]{ --page-bg:#EDE7FA; --accent:#B39DDB; --accent-ink:#6A4A9C; }
body[data-theme="doc"]  { --page-bg:#EFF3FF; --accent:#4468C4; --accent-ink:#33509E; }
body[data-theme="lulu"] { --page-bg:#EAF7EF; --accent:#4E9B62; --accent-ink:#337A48; }
body[data-theme="ilona"]{ --page-bg:#FFF6DF; --accent:#F2C542; --accent-ink:#8F6206; }

*,*::before,*::after{ box-sizing:border-box; }
html{ -webkit-text-size-adjust:100%; scroll-behavior:smooth; }
@media (prefers-reduced-motion:reduce){ html{ scroll-behavior:auto; } }

body{
  margin:0;
  background:var(--page-bg);
  color:var(--ink);
  font-family:"Nunito","Segoe UI",system-ui,sans-serif;
  font-size:clamp(1rem,.96rem + .2vw,1.08rem);
  line-height:1.65;
  overflow-x:hidden;
}
img,svg{ max-width:100%; }
a{ color:inherit; }
p{ margin:0 0 1rem; text-wrap:pretty; }
p:last-child{ margin-bottom:0; }

h1,h2,h3,.logo,.btn,.pill,.cat-label,.eyebrow,.bubble{
  font-family:"Baloo 2","Nunito",system-ui,sans-serif;
  font-weight:800;
}
h1,h2,h3{ margin:0; line-height:1.1; text-wrap:balance; }
h1{ font-size:clamp(2.3rem,1.4rem + 4.4vw,4.1rem); }
h2{ font-size:clamp(1.7rem,1.2rem + 2vw,2.5rem); }
h3{ font-size:clamp(1.2rem,1.05rem + .7vw,1.5rem); }

.eyebrow{
  display:inline-block; font-weight:700;
  font-size:clamp(.8rem,.75rem + .3vw,.95rem);
  background:var(--card); color:var(--ink);
  border:3px solid var(--outline); border-radius:999px;
  padding:.15rem 1rem; margin-bottom:1.1rem;
  box-shadow:3px 3px 0 var(--accent);
}
.lede{ font-size:clamp(1.05rem,1rem + .5vw,1.25rem); color:var(--ink-soft); max-width:52ch; }
.center{ text-align:center; }
.center .lede{ margin-inline:auto; }
.accent{ color:var(--accent-ink); }

.wrap{ width:min(100% - (var(--gut) * 2), var(--wrap)); margin-inline:auto; }
section{ padding-block:clamp(2.2rem,5vw,3.4rem); }

.skip{ position:absolute; left:-9999px; background:var(--ink); color:#fff; padding:.7rem 1rem; z-index:99; }
.skip:focus{ left:.5rem; top:.5rem; }
:focus-visible{ outline:3px solid var(--accent-ink); outline-offset:3px; border-radius:6px; }

/* ---------- header ------------------------------------------------------- */

header{ background:var(--card); border-bottom:3px solid var(--outline); position:sticky; top:0; z-index:30; }
.nav-inner{ display:flex; align-items:center; gap:1rem; flex-wrap:wrap; padding-block:.65rem; }
.brandbox{ display:flex; flex-direction:column; gap:1px; margin-right:auto; }
.logo{ display:flex; align-items:center; gap:.5rem; font-size:1.12rem; text-decoration:none; line-height:1; }
.logo-sleep{ display:flex; gap:5px; align-items:flex-end; padding-left:3px; }
.logo-sleep svg{ width:38px; height:22px; display:block; }
@media (max-width:430px){ .logo-sleep svg{ width:30px; height:18px; } }
.logo svg{ width:36px; height:27px; flex:none; color:var(--accent-ink); }
.logo span{ color:var(--accent-ink); }
header nav{ display:flex; gap:.1rem; flex-wrap:wrap; }
header nav a{ text-decoration:none; font-weight:700; font-size:.9rem; padding:.3rem .6rem; border-radius:999px; border:2px solid transparent; }
header nav a:hover{ border-color:var(--outline); }
header nav a.active{ background:var(--accent); border-color:var(--outline); }

/* ---------- panels + buttons --------------------------------------------- */

.panel{
  background:var(--card); border:3px solid var(--outline); border-radius:var(--r);
  box-shadow:var(--shadow); padding:clamp(1.3rem,3vw,2rem);
}
.hero{ padding-block:clamp(2.2rem,6vw,4rem) clamp(1.4rem,3vw,2.2rem); }

.btn{
  display:inline-block; text-decoration:none; cursor:pointer;
  background:var(--accent); color:var(--ink);
  border:3px solid var(--outline); border-radius:999px;
  padding:.6rem 1.4rem; font-size:1rem;
  box-shadow:4px 4px 0 var(--outline);
  transition:transform .12s ease, box-shadow .12s ease;
}
.btn:hover{ transform:translate(2px,2px); box-shadow:2px 2px 0 var(--outline); }
.btn:active{ transform:translate(4px,4px); box-shadow:0 0 0 var(--outline); }
.btn-ghost{ background:var(--card); }

.pill{ display:inline-block; font-size:.78rem; font-weight:700; background:var(--accent);
  border:2px solid var(--outline); border-radius:999px; padding:.05rem .7rem; }
.pill-soon{ background:var(--card); color:var(--ink-soft); }

/* ---------- crew cards --------------------------------------------------- */

.card-grid{ display:grid; gap:clamp(1.1rem,2.5vw,1.5rem); grid-template-columns:repeat(auto-fit,minmax(215px,1fr)); }
.card{ display:block; text-decoration:none; color:inherit; text-align:center;
  transition:transform .18s cubic-bezier(.2,.8,.3,1), box-shadow .18s ease; }
.card:hover,.card:focus-visible{ transform:translateY(-6px); box-shadow:6px 6px 0 var(--accent); }
.card .art{ width:132px; height:132px; margin:0 auto .4rem; display:block; }
.card h3{ margin-bottom:.15rem; }
.card .role{ font-weight:800; color:var(--accent-ink); font-size:.9rem; display:block; margin-bottom:.5rem; }
.card p{ font-size:.94rem; color:var(--ink-soft); margin:0; }
.card-baker{ --accent:#B39DDB; --accent-ink:#6A4A9C; }
.card-doc  { --accent:#4468C4; --accent-ink:#33509E; }
.card-lulu { --accent:#4E9B62; --accent-ink:#337A48; }
.card-ilona{ --accent:#F2C542; --accent-ink:#8F6206; }

/* ---------- explore ------------------------------------------------------ */

.trio{ display:grid; gap:clamp(1.1rem,2.5vw,1.5rem); grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); }
.trio .panel{ text-decoration:none; color:inherit; transition:transform .18s ease, box-shadow .18s ease; }
.trio .panel:hover{ transform:translateY(-6px); box-shadow:6px 6px 0 var(--accent); }
.ico{ width:46px; height:46px; color:var(--accent-ink); display:block; margin-bottom:.6rem; }
.trio h3{ margin-bottom:.3rem; }
.trio p{ color:var(--ink-soft); font-size:.95rem; }

/* ---------- cat page ----------------------------------------------------- */

.meet{ display:grid; gap:clamp(1.4rem,3vw,2.2rem); grid-template-columns:1fr; align-items:center; }
@media (min-width:800px){ .meet{ grid-template-columns:minmax(0,40%) minmax(0,1fr); } }
.stage{
  position:relative; overflow:hidden; background:var(--card);
  border:3px solid var(--outline); border-radius:var(--r); box-shadow:var(--shadow);
  aspect-ratio:1/1; display:grid; place-items:center; padding:7%;
}
.stage__cat{ width:100%; height:100%; position:relative; z-index:2; }
.crit{ position:absolute; left:0; top:0; pointer-events:none; z-index:3; will-change:transform,opacity; }
.laser{ width:11px; height:11px; border-radius:50%; background:#FF3B2E; box-shadow:0 0 10px 4px rgba(255,59,46,.5); z-index:4; }
.pom{ width:20px; height:20px; border-radius:50%; background:radial-gradient(circle at 34% 32%, #fff, #7FC7E8 45%, #2E86B5); box-shadow:0 0 9px rgba(127,199,232,.7); }
.spark{ width:5px; height:5px; background:#FFF3B0; border-radius:50%; box-shadow:0 0 6px #FFE066; }
.bk-paw{ z-index:4; filter:drop-shadow(1px 2px 0 rgba(59,46,74,.25)); }

.tally{ list-style:none; margin:0; padding:0; }
.tally li{ display:grid; grid-template-columns:1.5rem 1fr; gap:.7rem; padding:.55rem 0;
  border-bottom:2px dotted rgba(59,46,74,.18); }
.tally li:last-child{ border-bottom:0; }
.tally li::before{ content:""; width:15px; height:15px; margin-top:.45rem; border-radius:50%;
  background:var(--accent); border:2px solid var(--outline); }

.says{ text-align:center; }
.bubble{
  position:relative; display:inline-block; max-width:24ch; margin:0 auto;
  background:var(--card); border:3px solid var(--outline); border-radius:var(--r);
  box-shadow:var(--shadow); padding:1.2rem 1.6rem;
  font-size:clamp(1.3rem,1rem + 2vw,2.1rem); line-height:1.16;
}
.bubble::before,.bubble::after{ content:""; position:absolute; left:50%; width:0; height:0; }
.bubble::before{ bottom:-19px; transform:translateX(-50%); border-left:17px solid transparent; border-right:17px solid transparent; border-top:19px solid var(--outline); }
.bubble::after{ bottom:-13px; transform:translateX(-50%); border-left:13px solid transparent; border-right:13px solid transparent; border-top:15px solid var(--card); }
.says .who{ display:block; margin-top:2rem; font-weight:700; color:var(--ink-soft); font-size:.92rem; }

/* ---------- books -------------------------------------------------------- */

.books{ display:grid; gap:clamp(1.1rem,2.5vw,1.5rem); grid-template-columns:repeat(auto-fit,minmax(265px,1fr)); }
.book{ display:grid; grid-template-columns:92px 1fr; gap:1rem; align-items:start; }
.book .art{ width:92px; height:92px; }
.book .num{ display:block; font-weight:800; color:var(--accent-ink); font-size:.85rem; }
.book h3{ margin:.1rem 0 .35rem; }
.book p{ font-size:.94rem; color:var(--ink-soft); margin:0 0 .7rem; }
.book-wide{ grid-column:1/-1; }
@media (max-width:420px){ .book{ grid-template-columns:1fr; } }

/* ---------- signup ------------------------------------------------------- */

.signup{ max-width:660px; margin-inline:auto; text-align:center; }
.signup form{ display:flex; gap:.7rem; flex-wrap:wrap; justify-content:center; margin-top:1.2rem; }
.signup input[type="email"]{ flex:1 1 16rem; min-width:0; font:inherit; font-size:1rem;
  padding:.6rem 1rem; color:var(--ink); background:#fff;
  border:3px solid var(--outline); border-radius:999px; }
.signup input::placeholder{ color:#8E82A0; }
.signup .fine{ font-size:.9rem; color:var(--ink-soft); margin-top:.9rem; }
.signup__note{ font-weight:700; color:var(--accent-ink); margin-top:.8rem; min-height:1.2em; }
.hp{ position:absolute; left:-9999px; opacity:0; height:0; width:0; }

/* ---------- trenchcoat (about page only) --------------------------------- */

.coat-bit{ text-align:center; padding-block:clamp(2rem,5vw,3.2rem); }
.coat{ width:min(64vw,250px); height:auto; }
.coat-bit .cap{ font-weight:700; color:var(--ink-soft); margin-top:1rem; }
@keyframes tkWobble{ 0%,100%{ transform:rotate(-1.1deg); } 50%{ transform:rotate(1.1deg) translateY(-5px); } }
@keyframes tkHat{ 0%,100%{ transform:translateY(0) rotate(3deg); } 50%{ transform:translateY(-6px) rotate(-2deg); } }
.coat-anim{ transform-origin:160px 440px; animation:tkWobble 5.5s ease-in-out infinite; }
.hat-anim{ transform-origin:160px 118px; animation:tkHat 5.5s ease-in-out infinite; }

/* ---------- cat menu ----------------------------------------------------- */

.cat-menu{ border-top:3px solid var(--outline); background:var(--card); padding-block:1.5rem; }
.cat-row{ display:flex; justify-content:center; gap:clamp(.3rem,3vw,1.8rem); flex-wrap:wrap; }
.cat-item{ display:flex; flex-direction:column; align-items:center; text-decoration:none; color:var(--ink);
  padding:.3rem; transition:transform .28s cubic-bezier(.2,.8,.3,1); }
.cat-item:hover,.cat-item:focus-visible{ transform:translateY(-10px) rotate(-4deg); }
.cat-item svg{ width:clamp(62px,15vw,86px); height:clamp(62px,15vw,86px); display:block; }
.cat-label{ font-size:clamp(12px,2vw,14px); background:var(--accent);
  border:2px solid var(--outline); border-radius:999px; padding:0 12px; margin-top:-6px;
  box-shadow:2px 2px 0 rgba(59,46,74,.2); }
.ci-coat .coat-mini{ width:clamp(40px,9vw,54px); height:auto; display:block; margin:0 auto; }
.ci-coat .cat-label{ background:var(--pink); }
.ci-baker .cat-label{ background:#B39DDB; }
.ci-doc   .cat-label{ background:#4468C4; color:#fff; }
.ci-lulu  .cat-label{ background:#4E9B62; color:#fff; }
.ci-ilona .cat-label{ background:#F2C542; }

/* ---------- footer ------------------------------------------------------- */

footer{ background:var(--ink); color:#F4EFFF; padding-block:2.2rem; }
footer a{ color:#FFC9DA; }
.foot-motto{ font-family:"Baloo 2",sans-serif; font-weight:800; font-size:clamp(1.1rem,1rem + 1.2vw,1.7rem); margin:0 0 .9rem; }
.foot-meta{ font-size:.9rem; color:#C6BCD6; display:flex; gap:1rem; flex-wrap:wrap; }

/* ---------- splash + 404 ------------------------------------------------- */

.splash{ min-height:100svh; display:grid; place-items:center; text-align:center; padding:2rem var(--gut); }
.splash-in{ display:grid; justify-items:center; gap:1.1rem; }
.peek-row{ display:flex; gap:6px; justify-content:center; align-items:flex-end; flex-wrap:wrap; }
.peek-row svg{ width:clamp(66px,17vw,112px); height:clamp(66px,17vw,112px); }
.peek-row svg:nth-child(odd){ transform:translateY(8px) rotate(-4deg); }
.peek-row svg:nth-child(even){ transform:rotate(4deg); }
.oops{ min-height:64svh; display:grid; place-items:center; text-align:center; }
.oops-in{ display:grid; justify-items:center; gap:1rem; }
.oops svg{ width:min(46vw,180px); height:auto; }

/* ---------- page turn ----------------------------------------------------- */

@media (prefers-reduced-motion:no-preference){
  @keyframes pageIn{ from{ opacity:0; transform:translateY(12px); } to{ opacity:1; transform:none; } }
  main{ animation:pageIn .45s cubic-bezier(.2,.7,.3,1) both; }
  body.leaving main{ opacity:0; transform:translateY(-10px);
    transition:opacity .2s ease, transform .2s ease; animation:none; }
  body.leaving header, body.leaving .cat-menu, body.leaving footer{ opacity:.55; transition:opacity .2s ease; }
}

/* ---------- reveal ------------------------------------------------------- */

.rv{ opacity:0; transform:translateY(14px); transition:opacity .5s ease, transform .5s cubic-bezier(.2,.8,.3,1); }
.rv.is-in{ opacity:1; transform:none; }
.rv-fade{ opacity:0; transition:opacity .55s ease; }
.rv-fade.is-in{ opacity:1; }

@media (prefers-reduced-motion:reduce){
  .rv,.rv-fade{ opacity:1; transform:none; transition:none; }
  .crit{ display:none !important; }
  *{ animation:none !important; transition:none !important; }
}
