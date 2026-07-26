#!/usr/bin/env python3
"""Generates the Toddler Kitties static site. Output = plain HTML, no build step needed after this."""
import os, re, html

SITE = "https://toddlerkitties.com"
IG = "https://www.instagram.com/toddlerkitties/"
MAIL = "toddlerkitties@gmail.com"

CATS = [
    ("baker", "Baker", "B1", "Presiding Judge"),
    ("doc",   "Doc",   "D2", "Bailiff"),
    ("lulu",  "Lulu",  "L3", "Garden Kitty"),
    ("ilona", "Ilona", "I4", "Chaos Agent"),
]
NAV = [("home.html","Home"),("baker.html","Baker"),("doc.html","Doc"),("lulu.html","Lulu"),
       ("ilona.html","Ilona"),("books.html","Books"),("shop.html","Shop"),("about.html","About")]

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&'
         'family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&'
         'family=Courier+Prime:wght@400;700&display=swap">')

MARK = ('<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="1.5" y="1.5" width="29" height="29" rx="3" '
        'fill="none" stroke="#241F2E" stroke-width="3"/><path d="M9 3 L9 24 M4 9 L14 9" stroke="#241F2E" '
        'stroke-width="3"/><path d="M19 3 L19 24 M19 13 Q28 13 28 18.5 Q28 24 19 24" stroke="#241F2E" '
        'stroke-width="3" fill="none"/></svg>')


SPRITE = ""
def load_sprite():
    global SPRITE
    raw = open("assets/cats.svg").read()
    body = raw.split(">", 1)[1].rsplit("</svg>", 1)[0]
    SPRITE = ('<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" '
              'style="position:absolute" aria-hidden="true" focusable="false">' + body + "</svg>")


def cat_svg(slug, cls="", title=None):
    t = f'<title>{title}</title>' if title else ''
    aria = '' if title else ' aria-hidden="true"'
    c = f' class="{cls}"' if cls else ''
    return (f'<svg{c} viewBox="-6 -6 152 152" role="img"{aria}>{t}'
            f'<use href="#tk-{slug}"></use></svg>')


def nav(active):
    li = "".join(
        f'<li><a href="{h}"{" aria-current=\"page\"" if h == active else ""}>{t}</a></li>'
        for h, t in NAV)
    return (f'<header class="nav"><div class="wrap nav__in">'
            f'<a class="brand" href="home.html">{MARK}Toddler&nbsp;Kitties</a>'
            f'<nav aria-label="Main"><ul>{li}</ul></nav></div></header>')


def bench(exclude=None):
    row = "".join(
        f'<a href="{s}.html">{cat_svg(s)}<span>{n} · {c}</span></a>'
        for s, n, c, _ in CATS if s != exclude)
    return (f'<section class="bench" aria-label="The bench"><div class="wrap">'
            f'<div class="board-label" style="text-align:center"><span class="label label--quiet">'
            f'The bench &mdash; pick a cat</span></div>'
            f'<div class="bench__row">{row}</div></div></section>')


def signup(heading="Be first to meet the books",
           copy="No schedule, no spam. One note when Volume I is actually finished."):
    return f'''<div class="signup file rv"><span class="tab">Notice</span>
<span class="label">Request to be notified</span>
<h2>{heading}</h2>
<p class="deck">{copy}</p>
<form data-signup novalidate>
<label class="hp" aria-hidden="true">Leave this empty<input type="text" name="_hp" tabindex="-1" autocomplete="off"></label>
<label class="hp" for="tk-email">Email address</label>
<input id="tk-email" type="email" name="email" required placeholder="you@example.com" autocomplete="email">
<button class="btn" type="submit">Add me to the docket</button>
</form>
<p class="signup__note" role="status" aria-live="polite"></p>
<p class="fine">Or find them misbehaving on <a href="{IG}">Instagram</a>.</p>
</div>'''


def foot():
    return (f'<footer class="foot"><div class="wrap">'
            f'<p class="foot__motto">A toddler is just 4 cats in a trenchcoat.</p>'
            f'<div class="foot__meta"><span>&copy; 2026 Toddler Kitties</span>'
            f'<a href="{IG}">@toddlerkitties</a>'
            f'<a href="mailto:{MAIL}">{MAIL}</a></div></div></footer>')


def page(fn, title, desc, body, active=None, cat=None, chrome=True, rooted=False):
    body_attr = f' data-cat="{cat}"' if cat else ''
    head = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{SITE}/{fn}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Toddler Kitties">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{SITE}/{fn}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
{FONTS}
<link rel="stylesheet" href="assets/tk.css">
</head>
<body{body_attr}>
<a class="skip" href="#main">Skip to content</a>
'''
    tail = '<script src="assets/tk.js" defer></script>\n</body>\n</html>\n'
    parts = [head, SPRITE]
    if chrome:
        parts.append(nav(active))
    parts.append(f'<main id="main">{body}</main>')
    if chrome:
        parts.append(bench(exclude=cat))
        parts.append(foot())
    parts.append(tail)
    out = "".join(parts)
    if rooted:
        # 404 is served at arbitrary depths, so every path must be absolute
        out = re.sub(r'(href|src)="(?!https?:|mailto:|#|/)([^"]+)"', r'\1="/\2"', out)
        out = out.replace('<meta name="viewport"',
                          '<meta name="robots" content="noindex">\n<meta name="viewport"')
    open(fn, "w").write(out)
    print("wrote", fn)


load_sprite()

# ============================================================== index (splash)

COAT = '''<svg class="coat" viewBox="0 0 320 470" role="img" aria-labelledby="coatTitle">
<title id="coatTitle">Four chibi cats stacked inside one trenchcoat</title>
<g id="coatWobble">
  <!-- fedora -->
  <g id="hat">
    <ellipse cx="160" cy="52" rx="76" ry="15" fill="#4A3A2C"/>
    <path d="M112 52 C112 22 130 12 160 12 C190 12 208 22 208 52 Z" fill="#5C4835"/>
    <path d="M112 44 h96 v9 h-96 Z" fill="#33281E"/>
    <path d="M140 22 q20 -9 40 0" stroke="#6E5842" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>
  <!-- top cat: Baker, peeking over the collar -->
  <g id="peek1"><svg x="104" y="46" width="112" height="112" viewBox="-6 -6 152 152"><use href="#tk-baker"></use></svg></g>
  <!-- coat body -->
  <path d="M96 150 C96 138 112 130 128 128 L160 146 L192 128 C208 130 224 138 224 150 L232 424 C232 434 224 440 214 440 L106 440 C96 440 88 434 88 424 Z" fill="#C9A26B" stroke="#241F2E" stroke-width="5" stroke-linejoin="round"/>
  <!-- sleeves -->
  <path d="M96 152 C74 160 62 182 60 214 L56 300 C55 314 74 318 78 304 L96 236 Z" fill="#BE9560" stroke="#241F2E" stroke-width="5" stroke-linejoin="round"/>
  <path d="M224 152 C246 160 258 182 260 214 L264 300 C265 314 246 318 242 304 L224 236 Z" fill="#BE9560" stroke="#241F2E" stroke-width="5" stroke-linejoin="round"/>
  <!-- lapels -->
  <path d="M128 128 L160 146 L142 196 L112 158 Z" fill="#B98C57" stroke="#241F2E" stroke-width="4" stroke-linejoin="round"/>
  <path d="M192 128 L160 146 L178 196 L208 158 Z" fill="#B98C57" stroke="#241F2E" stroke-width="4" stroke-linejoin="round"/>
  <!-- coat opening: cats visible inside -->
  <path d="M142 196 L178 196 L176 372 L144 372 Z" fill="#3B3040"/>
  <g id="peek2"><svg x="128" y="188" width="64" height="64" viewBox="-6 -6 152 152"><use href="#tk-doc"></use></svg></g>
  <g id="peek3"><svg x="130" y="252" width="60" height="60" viewBox="-6 -6 152 152"><use href="#tk-lulu"></use></svg></g>
  <g id="peek4"><svg x="130" y="312" width="60" height="60" viewBox="-6 -6 152 152"><use href="#tk-ilona"></use></svg></g>
  <!-- belt -->
  <rect x="86" y="286" width="148" height="26" rx="4" fill="#A87F4C" stroke="#241F2E" stroke-width="5"/>
  <rect x="146" y="282" width="30" height="34" rx="4" fill="#D8B87A" stroke="#241F2E" stroke-width="5"/>
  <!-- buttons -->
  <circle cx="120" cy="230" r="7" fill="#8C6839" stroke="#241F2E" stroke-width="3"/>
  <circle cx="200" cy="230" r="7" fill="#8C6839" stroke="#241F2E" stroke-width="3"/>
  <circle cx="120" cy="352" r="7" fill="#8C6839" stroke="#241F2E" stroke-width="3"/>
  <circle cx="200" cy="352" r="7" fill="#8C6839" stroke="#241F2E" stroke-width="3"/>
  <!-- hem + paws + one plume tail that gives the whole thing away -->
  <path d="M88 424 h144" stroke="#241F2E" stroke-width="5"/>
  <g id="tailOut"><path d="M228 424 C266 424 286 400 274 372 C288 392 280 414 260 420 C272 412 274 400 268 392 C270 408 250 416 232 416 Z" fill="#E0A05A" stroke="#241F2E" stroke-width="4" stroke-linejoin="round"/></g>
  <ellipse cx="124" cy="452" rx="24" ry="13" fill="#EFE3D2" stroke="#241F2E" stroke-width="4"/>
  <ellipse cx="196" cy="452" rx="24" ry="13" fill="#EFE3D2" stroke="#241F2E" stroke-width="4"/>
</g>
</svg>
<style>
@keyframes tkWobble{0%,100%{transform:rotate(-1.1deg) translateY(0)}50%{transform:rotate(1.1deg) translateY(-5px)}}
@keyframes tkTail{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(9deg)}}
@keyframes tkHat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes tkRise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
.coat{animation:tkRise .8s cubic-bezier(.2,.8,.3,1) both}
#coatWobble{transform-origin:160px 440px;animation:tkWobble 5.5s ease-in-out infinite}
#tailOut{transform-origin:230px 420px;animation:tkTail 2.6s ease-in-out infinite}
#hat{transform-origin:160px 52px;animation:tkHat 5.5s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.coat,#coatWobble,#tailOut,#hat{animation:none}}
</style>'''

page("index.html", "Toddler Kitties",
     "Four real cats, one storybook world. A toddler is just 4 cats in a trenchcoat.",
     f'''<div class="splash"><div class="splash__in">
{COAT}
<h1 class="display">Toddler Kitties</h1>
<p class="splash__motto">A toddler is just 4 cats in a trenchcoat</p>
<a class="btn" href="home.html">Nothing to see here &rarr;</a>
<p class="splash__file">Case file 001 &middot; opened 2026</p>
</div></div>''', chrome=False)


# ============================================================== home

def card(slug, name, code, role, charge):
    return (f'<a class="file card rv-fade" data-cat="{slug}" href="{slug}.html">'
            f'<span class="tab">{code}</span>'
            f'{cat_svg(slug, "card__art")}'
            f'<div><span class="card__role">{role}</span>'
            f'<h3 class="card__name">{name}</h3>'
            f'<p class="card__charge">{charge}</p></div></a>')


HOME = f'''
<section class="hero wrap">
  <span class="stamp hero__stamp">In session</span>
  <span class="label">The Cat Council &middot; docket 2026</span>
  <h1>Four cats.<br>One trenchcoat.<br>Several ongoing disputes.</h1>
  <p class="deck">Toddler Kitties is a storybook world built out of four real cats with startlingly
  human opinions &mdash; and the household that keeps taking notes.</p>
</section>

<hr class="rule">

<section class="wrap">
  <span class="label rv">Parties to the case</span>
  <h2 class="rv" style="margin-bottom:2.6rem">The crew</h2>
  <div class="board">
    {card("baker","Baker","B1","Presiding Judge",
          "Holds court from the windowsill. Known war cry, filed under recreation. Has a heart-shaped nose and has never once addressed it.")}
    {card("doc","Doc","D2","Bailiff",
          "Cow-patterned, extremely large ears, plays actual fetch. Once recovered a bag of cookies from the trash and re-hid it in the original location.")}
    {card("lulu","Lulu","L3","Garden Kitty",
          "Arrived through the garden. Eats cucumber on purpose. Operates the portable air conditioner, then lies on it belly-up.")}
    {card("ilona","Ilona","I4","Chaos Agent",
          "Talks through closed doors. Picked her own collar out of a lineup, twice. Volunteers for the night shift when someone is sick.")}
  </div>
</section>

<hr class="rule">

<section class="wrap">
  <span class="label rv">Elsewhere in the file</span>
  <div class="trio" style="margin-top:2.6rem">
    <a class="file rv" href="books.html"><span class="tab">Vol.</span>
      <h3>The Record</h3><p>Four origin stories, in the order they arrived, and one ensemble trial.</p></a>
    <a class="file rv" href="shop.html"><span class="tab">Locker</span>
      <h3>Evidence Locker</h3><p>Sealed. The bailiff is not currently accepting inquiries.</p></a>
    <a class="file rv" href="about.html"><span class="tab">Origin</span>
      <h3>How this started</h3><p>A household joke that got out of hand and became a drawing project.</p></a>
  </div>
</section>

<section class="wrap">{signup()}</section>
'''
page("home.html", "Toddler Kitties — Home",
     "Meet Baker, Doc, Lulu and Ilona — four real cats, one storybook world.",
     HOME, active="home.html")


# ============================================================== cat pages

def cat_page(slug, name, code, role, stamp_text, tagline, deck, exhibits, sealed, quote, quote_by, nxt):
    ex = "".join(f'<li><code>{c}</code><span>{t}</span></li>' for c, t in exhibits)
    ns, nn = nxt
    return f'''
<section class="wrap dossier">
  <div class="stage rv" data-stage>{cat_svg(slug, "stage__cat", f"{name}, chibi portrait")}</div>
  <div class="rv">
    <span class="label">Case file {code}</span>
    <div class="dossier__title">
      <h1>{name}</h1><span class="dossier__code">{code}</span>
    </div>
    <p class="card__role" style="margin-top:.6rem">{role}</p>
    <p class="deck">{tagline}</p>
    <div class="dossier__meta"><span class="stamp stamp--accent">{stamp_text}</span></div>
  </div>
</section>

<hr class="rule">

<section class="wrap">
  <div class="file rv"><span class="tab">Exhibit A</span>
    <span class="label">On the record</span>
    <h2 style="margin-bottom:1.4rem">Known behaviours</h2>
    <p class="deck" style="margin-bottom:1.4rem">{deck}</p>
    <ul class="exhibits">{ex}</ul>
  </div>
</section>

<section class="wrap">
  <div class="file sealed rv"><span class="tab">Exhibit B</span>
    <span class="label">Prior record</span>
    <h2 style="margin-bottom:1.1rem">Sealed until publication</h2>
    <p>{sealed}</p>
    <span class="stamp">Sealed</span>
  </div>
</section>

<section class="wrap testimony rv">
  <span class="label">Testimony</span>
  <blockquote>&ldquo;{quote}&rdquo;</blockquote>
  <cite>{quote_by}</cite>
</section>

<section class="wrap" style="padding-top:0">
  <a class="btn btn--ghost" href="{ns}.html">Next: {nn} &rarr;</a>
</section>

<section class="wrap">{signup()}</section>
'''

cat_page_data = [
 dict(stamp_text="Presiding", slug="baker", name="Baker", code="B1", role="Presiding Judge",
   tagline="Presiding since day one &mdash; a day she selected herself, without consulting anyone.",
   deck="Baker is the matriarch, the first arrival, and the reason there is a court at all. She rules from elevation and rarely explains herself.",
   exhibits=[("B1.1","Selects her own humans. Has done this once. Considers the matter closed and the ruling final."),
             ("B1.2","Emits a war cry before play. The household investigated the first time. The household was fine."),
             ("B1.3","Guards the carrier. It is <em>her</em> carrier. There is a name written on it."),
             ("B1.4","Once said hello to strangers in the next lane on the freeway. No explanation was offered."),
             ("B1.5","Has a heart-shaped nose. Refuses to acknowledge this in any way.")],
   sealed="Before this household there was a window, a room full of others, and a decision she made without asking permission. The court can confirm a shelter, a black-and-white door, and a very short waiting period. Everything else opens with Volume&nbsp;I.",
   quote="I saw the whole thing. I <em>was</em> the whole thing.",
   quote_by="Baker, B1, from the bench",
   nxt=("doc","Doc")),
 dict(stamp_text="Sworn in", slug="doc", name="Doc", code="D2", role="Bailiff",
   tagline="Keeps order in the room. Will not, under any circumstances, hurt the lizard.",
   deck="Doc is the second arrival and the gentlest large thing in the house. Cow-patterned, enormously eared, and loud about everything.",
   exhibits=[("D2.1","Answers to his name. Arrives at speed. Arrives at a slightly reduced speed these days."),
             ("D2.2","Plays actual fetch with a sparkly pom pom &mdash; chases it, carries it back, drops it in your hand."),
             ("D2.3","Drinks water fast enough to sneeze. Has not revised the technique in years."),
             ("D2.4","Opens cabinets. Recovered a bag of cookies from the bin and re-hid it in the original location."),
             ("D2.5","Requires a seat at the table. Will eat like a person if the bowl is placed in front of his chair."),
             ("D2.6","Enjoys baths. With bubbles. And ducks.")],
   sealed="The file mentions a motel, a very long drive north, and three weeks of medicine administered at a kitchen counter. It does not mention how loud he was about all of it. Volume&nbsp;II starts a long way from here.",
   quote="I said hello. I said it the whole way.",
   quote_by="Doc, D2, still talking",
   nxt=("lulu","Lulu")),
 dict(stamp_text="Plaintiff", slug="lulu", name="Lulu", code="L3", role="Garden Kitty",
   tagline="She was home before anyone in the house had seen her.",
   deck="Lulu is the third arrival, the plaintiff in most disputes, and the only member of the household with a documented interest in vegetables.",
   exhibits=[("L3.1","Eats cucumber. On purpose. With enthusiasm."),
             ("L3.2","Operates the portable air conditioner &mdash; power, mode, fan speed &mdash; then lies on it belly-up."),
             ("L3.3","Holds fingers. Will keep holding them."),
             ("L3.4","Sits upright like a person, usually behind something that could be mistaken for a desk."),
             ("L3.5","Sleeps like we have world peace.")],
   sealed="For weeks something was taking bites out of the garden and disappearing behind the shed. The household suspected a raccoon. The household was wrong, and had been wrong for longer than it realised. Volume&nbsp;III.",
   quote="I&rsquo;d already been coming in. Nobody asked.",
   quote_by="Lulu, L3, for the plaintiff",
   nxt=("ilona","Ilona")),
 dict(stamp_text="Objection", slug="ilona", name="Ilona", code="I4", role="Chaos Agent",
   tagline="Chaos agent by day. Volunteers for the night shift when someone is unwell.",
   deck="Ilona is the fourth and final arrival, the most cat-like of the four, and the loudest object in any closed room.",
   exhibits=[("I4.1","Chose her own collar. Was offered two. Walked over, picked one up, chose it again."),
             ("I4.2","Begins talking the instant a door closes. Any door. Immediately."),
             ("I4.3","Has attempted a doorknob. Lacks the grip. Does not lack the will."),
             ("I4.4","Waits and complains at the closet door, three feet from the correct door. Looks embarrassed when corrected."),
             ("I4.5","Takes the extra shift whenever a human is sick, tired, or sad. Unprompted. Every time.")],
   sealed="The trapper&rsquo;s notes describe her as chill. The trapper met her for about eleven minutes. The rest of the file &mdash; a family, a father who stayed, and a shelter that made a phone call &mdash; opens with Volume&nbsp;IV.",
   quote="I&rsquo;m fine. Are <em>you</em> fine? Open the door.",
   quote_by="Ilona, I4, from the hallway",
   nxt=("baker","Baker")),
]

for d in cat_page_data:
    page(f'{d["slug"]}.html',
         f'{d["name"]} — Toddler Kitties',
         f'{d["name"]} ({d["code"]}), {d["role"]} of the Cat Council. {html.escape(d["tagline"].replace("&mdash;","—"))}',
         cat_page(**d), active=f'{d["slug"]}.html', cat=d["slug"])


# ============================================================== books

def volume(slug, num, title, sub, body, status, cls):
    art = cat_svg(slug, "volume__art") if slug else ""
    return (f'<div class="volume rv" data-cat="{slug}">{art}<div>'
            f'<h3><small>Volume {num}</small>{title}</h3>'
            f'<p><strong>{sub}</strong></p><p>{body}</p>'
            f'<span class="status {cls}">{status}</span></div></div>')


BOOKS = f'''
<section class="hero wrap">
  <span class="stamp hero__stamp">The record</span>
  <span class="label">Books</span>
  <h1>Four origin stories,<br>then a trial.</h1>
  <p class="deck">Each cat gets their own book, in the order they arrived. Then all four end up in
  one room, which is where the trouble starts. Written and drawn by hand, at home, slowly.</p>
</section>

<hr class="rule">

<section class="wrap">
  <div class="volumes">
    {volume("baker","I","Mama Baker","How the first one chose us.",
      "Before the bench, before the household, before her name was written on anything. Told mostly in black and white, with one exception.",
      "In progress","status--now")}
    {volume("doc","II","Doc","A very long drive, and a very loud passenger.",
      "It starts a long way from this house, and it does not start well. Drawn clean and cut, with certain details rendered so sharply they almost look real.",
      "Outlined","status--next")}
    {volume("lulu","III","Lulu","She was home before anyone saw her.",
      "The garden had been eaten for weeks. Two cats already knew who was doing it, and neither of them mentioned it.",
      "Outlined","status--next")}
    {volume("ilona","IV","Ilona","The one the notes called chill.",
      "A family lost, a father who stayed, and a phone call from the same shelter that started all of this.",
      "Outlined","status--next")}
    {volume("","V","The Cat Council","All four. One room. One long-overdue dispute.",
      "The ensemble book. B1 presides, D2 keeps order, L3 files suit, and I4 is the reason the suit exists.",
      "Filed under later","status--next")}
  </div>
</section>

<hr class="rule">

<section class="wrap">
  <div class="file rv"><span class="tab">Note</span>
  <span class="label">From the desk</span>
  <h2>Made at the kitchen table</h2>
  <p class="deck">Every page is drawn by hand on an iPad, from photographs of four cats who did not
  consent to any of this. It takes as long as it takes. Get on the list and you&rsquo;ll hear
  when Volume&nbsp;I is finished &mdash; and not before.</p>
  </div>
</section>

<section class="wrap">{signup("Tell me when Volume I lands","One email. When the book is real, not when it is nearly real.")}</section>
'''
page("books.html", "Books — Toddler Kitties",
     "Four hand-drawn origin storybooks — Baker, Doc, Lulu and Ilona — and the ensemble book, The Cat Council.",
     BOOKS, active="books.html")


# ============================================================== shop

SHOP = f'''
<section class="hero wrap">
  <span class="stamp hero__stamp">Sealed</span>
  <span class="label">Evidence locker</span>
  <h1>Nothing for sale.<br>Yet.</h1>
  <p class="deck">There is a locker. There is something in it. The bailiff is not currently
  accepting inquiries, and the judge has declined to comment.</p>
</section>

<hr class="rule">

<section class="wrap">
  <div class="file sealed rv"><span class="tab">Locker</span>
  <span class="label">Status</span>
  <h2 style="margin-bottom:1rem">Contents undisclosed</h2>
  <p class="deck">When there is genuinely something worth sending you, it will appear here first
  and go to the list first. That is the whole plan. No countdowns, no pre-orders, no
  &ldquo;limited drops.&rdquo;</p>
  <span class="stamp">Do not open</span>
  </div>
</section>

<section class="wrap">{signup("Be told when the locker opens","You will hear about it here before anywhere else.")}</section>
'''
page("shop.html", "Shop — Toddler Kitties",
     "The Toddler Kitties evidence locker is still sealed. Join the list to hear first.",
     SHOP, active="shop.html")


# ============================================================== about

ABOUT = f'''
<section class="hero wrap">
  <span class="stamp hero__stamp">Origin</span>
  <span class="label">About</span>
  <h1>It started as a joke about a trenchcoat.</h1>
  <p class="deck">Four cats live here. They have opinions, grudges, routines, and expressions that
  are frankly too human for comfort. At some point someone said it out loud: a toddler is just
  4 cats in a trenchcoat. The joke did not go away. It got a website.</p>
</section>

<hr class="rule">

<section class="wrap">
  <div class="trio">
    <div class="file rv"><span class="tab">01</span><h3>They&rsquo;re all real</h3>
      <p>Baker, Doc, Lulu and Ilona are four actual cats in one actual apartment. Nothing on this
      site is invented except the courtroom, and honestly that part is barely invented.</p></div>
    <div class="file rv"><span class="tab">02</span><h3>Drawn by hand</h3>
      <p>Every character is drawn from photographs of the real cat, on an iPad, at the kitchen
      table, by someone learning as they go. The heart-shaped nose is deliberate.</p></div>
    <div class="file rv"><span class="tab">03</span><h3>Told in order</h3>
      <p>Each book is one cat&rsquo;s origin story, published in the order they arrived. Then
      everybody ends up in the same room and the ensemble book happens.</p></div>
  </div>
</section>

<hr class="rule">

<section class="wrap">
  <div class="file rv" style="max-width:44rem"><span class="tab">Ack.</span>
  <span class="label">With thanks</span>
  <h2 style="margin-bottom:1rem">Three of these four came from the same place</h2>
  <p class="deck">One shelter is responsible for most of this household. They get a proper
  thank-you in the books, where there is room to do it justice.</p>
  </div>
</section>

<section class="wrap">
  <div class="file rv" style="max-width:44rem"><span class="tab">Contact</span>
  <span class="label">Reach the court</span>
  <h2 style="margin-bottom:1rem">Say hello</h2>
  <p class="deck">Questions, hellos, or photos of your own tiny defendants:
  <a href="mailto:{MAIL}">{MAIL}</a>, or
  <a href="{IG}">@toddlerkitties</a> on Instagram.</p>
  </div>
</section>

<section class="wrap">{signup()}</section>
'''
page("about.html", "About — Toddler Kitties",
     "How a household joke about four cats in a trenchcoat became a hand-drawn storybook world.",
     ABOUT, active="about.html")


# ============================================================== 404

NOTFOUND = f'''
<div class="oops wrap"><div class="oops__in">
  {cat_svg("ilona", "", "Ilona, chibi portrait")}
  <span class="label">Error 404</span>
  <h1>Exhibit not found.</h1>
  <p class="deck" style="text-align:center;margin-inline:auto">Ilona was near this page shortly
  before it went missing. That is all the court has been able to establish.</p>
  <a class="btn" href="home.html">Back to the courtroom</a>
</div></div>
'''
page("404.html", "Exhibit not found — Toddler Kitties",
     "This page is missing. Ilona was nearby.", NOTFOUND, cat="ilona", rooted=True)


# ============================================================== extras

open("robots.txt", "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")

urls = ["", "home.html", "baker.html", "doc.html", "lulu.html", "ilona.html",
        "books.html", "shop.html", "about.html"]
entries = "\n".join(
    f'  <url><loc>{SITE}/{u}</loc><changefreq>monthly</changefreq>'
    f'<priority>{"1.0" if u in ("", "home.html") else "0.8"}</priority></url>' for u in urls)
open("sitemap.xml", "w").write(
    f'<?xml version="1.0" encoding="UTF-8"?>\n'
    f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{entries}\n</urlset>\n')

open("assets/favicon.svg", "w").write(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
    '<rect width="64" height="64" rx="8" fill="#F4E5C1"/>'
    '<path d="M14 12 L14 50 M6 20 L24 20" stroke="#241F2E" stroke-width="6" stroke-linecap="round"/>'
    '<path d="M38 12 L38 50 M38 30 Q56 30 56 40 Q56 50 38 50" stroke="#241F2E" stroke-width="6" '
    'fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')

print("robots.txt, sitemap.xml, favicon.svg written")
