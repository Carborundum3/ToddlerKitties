#!/usr/bin/env python3
"""Generates the Toddler Kitties static site.
Each output page is fully self-contained: CSS, JS and cat art are stamped in.
Edit cats.svg / tk.css / tk.js then re-run:  python3 build.py
"""
import os, re, html

SITE = "https://toddlerkitties.com"
IG   = "https://www.instagram.com/toddlerkitties/"
MAIL = "toddlerkitties@gmail.com"

CATS = [("baker","Baker","B1","The Judge"),
        ("doc","Doc","D2","The Bailiff"),
        ("lulu","Lulu","L3","Garden Kitty"),
        ("ilona","Ilona","I4","The Chaos Agent")]

NAV = [("home.html","Home"),("baker.html","Baker"),("doc.html","Doc"),("lulu.html","Lulu"),
       ("ilona.html","Ilona"),("books.html","Books"),("shop.html","Shop"),("about.html","About")]

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Baloo+2:wght@500;700;800&family=Nunito:ital,wght@0,400;0,600;0,700;1,400'
         '&display=swap">')

# --- the wordmark: a real T (bar across the top) and a real K ---------------
LOGO = ('<svg viewBox="0 0 46 32" aria-hidden="true" fill="none" stroke="currentColor" '
        'stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round">'
        '<path d="M3 5 H23 M13 5 V27"/>'
        '<path d="M29 5 V27 M42 5 L30.5 16 M32.4 14.4 L43 27"/></svg>')

FAVICON_SVG = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
  '<rect width="64" height="64" rx="14" fill="#FF8FB1" stroke="#3B2E4A" stroke-width="4"/>'
  '<g fill="none" stroke="#3B2E4A" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">'
  '<path d="M10 18 H28 M19 18 V46"/><path d="M36 18 V46 M50 18 L37.5 30 M39.4 28.4 L51 46"/>'
  '</g></svg>')

ICONS = {
 "book": '<svg class="ico" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M24 14C20 10 12.5 8.6 6 9.6v25C12.5 33.6 20 35 24 39"/><path d="M24 14c4-4 11.5-5.4 18-4.4v25c-6.5-1-14 .4-18 4.4"/><path d="M24 14v25"/></svg>',
 "tag":  '<svg class="ico" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M25 6h17v17L23.5 41.5a3 3 0 0 1-4.2 0L6.5 28.7a3 3 0 0 1 0-4.2Z"/><circle cx="34" cy="14" r="3.4"/></svg>',
 "heart":'<svg class="ico" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M24 40C10 31 4 25 4 17.5 4 11.1 9.1 6 15.5 6 19.4 6 22.5 8 24 11c1.5-3 4.6-5 8.5-5C38.9 6 44 11.1 44 17.5 44 25 38 31 24 40Z"/></svg>',
}

COAT = '''<svg class="coat" id="aboutCoat" viewBox="0 0 320 470" role="img" aria-labelledby="coatT">
<title id="coatT">An empty trenchcoat, waiting for four cats</title>
<g class="coat-anim">
  <g class="hat-anim">
    <ellipse cx="160" cy="118" rx="76" ry="15" fill="#4A3A2C" stroke="#3B2E4A" stroke-width="4"/>
    <path d="M112 118 C112 88 130 78 160 78 C190 78 208 88 208 118 Z" fill="#5C4835" stroke="#3B2E4A" stroke-width="4"/>
    <path d="M112 111 h96 v8 h-96 Z" fill="#33281E"/>
  </g>
  <path d="M96 150 C96 138 112 130 128 128 L160 146 L192 128 C208 130 224 138 224 150 L232 424 C232 434 224 440 214 440 L106 440 C96 440 88 434 88 424 Z" fill="#C9A26B" stroke="#3B2E4A" stroke-width="5" stroke-linejoin="round"/>
  <path d="M96 152 C74 160 62 182 60 214 L56 300 C55 314 74 318 78 304 L96 236 Z" fill="#BE9560" stroke="#3B2E4A" stroke-width="5" stroke-linejoin="round"/>
  <path d="M224 152 C246 160 258 182 260 214 L264 300 C265 314 246 318 242 304 L224 236 Z" fill="#BE9560" stroke="#3B2E4A" stroke-width="5" stroke-linejoin="round"/>
  <path d="M128 128 L160 146 L142 196 L112 158 Z" fill="#B98C57" stroke="#3B2E4A" stroke-width="4" stroke-linejoin="round"/>
  <path d="M192 128 L160 146 L178 196 L208 158 Z" fill="#B98C57" stroke="#3B2E4A" stroke-width="4" stroke-linejoin="round"/>
  <path d="M142 196 L178 196 L176 372 L144 372 Z" fill="#4A3F58"/>
  <g id="coatPeek"></g>
  <rect x="86" y="286" width="148" height="26" rx="6" fill="#A87F4C" stroke="#3B2E4A" stroke-width="5"/>
  <rect x="146" y="282" width="30" height="34" rx="6" fill="#D8B87A" stroke="#3B2E4A" stroke-width="5"/>
  <circle cx="120" cy="230" r="7" fill="#8C6839" stroke="#3B2E4A" stroke-width="3"/>
  <circle cx="200" cy="230" r="7" fill="#8C6839" stroke="#3B2E4A" stroke-width="3"/>
  <circle cx="120" cy="352" r="7" fill="#8C6839" stroke="#3B2E4A" stroke-width="3"/>
  <circle cx="200" cy="352" r="7" fill="#8C6839" stroke="#3B2E4A" stroke-width="3"/>
  <path d="M88 424 h144" stroke="#3B2E4A" stroke-width="5"/>
</g></svg>'''

SHOW_SIGNUP = False   # flip to True once SIGNUP_ENDPOINT is set in tk.js, then re-run build

MINI_COAT = COAT.replace('class="coat" id="aboutCoat"', 'class="coat-mini"')

SPRITE = ""; CSS = ""; JS = ""; FAVI = ""; SYMBOLS = {}

def load_assets():
    global SPRITE, CSS, JS, FAVI
    import base64
    raw = open("cats.svg").read()
    body = raw.split(">", 1)[1].rsplit("</svg>", 1)[0]
    SPRITE = ('<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" '
              'style="position:absolute" aria-hidden="true" focusable="false">' + body + "</svg>")
    global SYMBOLS
    SYMBOLS = dict(re.findall(r'<symbol id="(tk-[\w-]+)"[^>]*>(.*?)</symbol>', raw, re.S))
    CSS  = "<style>" + open("tk.css").read() + "</style>"
    JS   = "<script>" + open("tk.js").read() + "</script>"
    FAVI = "data:image/svg+xml;base64," + base64.b64encode(FAVICON_SVG.encode()).decode()


def cat_svg(slug, cls="", title=None, inline=False):
    t = f"<title>{title}</title>" if title else ""
    aria = "" if title else ' aria-hidden="true"'
    c = f' class="{cls}"' if cls else ""
    inner = SYMBOLS[f"tk-{slug}"] if inline else f'<use href="#tk-{slug}"></use>'
    return (f'<svg{c} viewBox="-6 -6 152 152" role="img"{aria}>{t}{inner}</svg>')


def sleep_svg(slug):
    return (f'<svg viewBox="0 0 96 56" aria-hidden="true">'
            f'<use href="#tk-sleep-{slug}"></use></svg>')


def header(active):
    links = "".join(f'<a href="{h}"{" class=\"active\"" if h == active else ""}>{t}</a>'
                    for h, t in NAV)
    loafs = "".join(sleep_svg(s) for s, _, _, _ in CATS)
    return (f'<header><div class="wrap nav-inner">'
            f'<div class="brandbox">'
            f'<a class="logo" href="home.html">{LOGO}Toddler <span>Kitties</span></a>'
            f'<div class="logo-sleep" aria-hidden="true">{loafs}</div></div>'
            f'<nav aria-label="Main">{links}</nav></div></header>')


def cat_menu(exclude=None, coat=True):
    items = "".join(
        f'<a class="cat-item ci-{s}" href="{s}.html">{cat_svg(s, inline=True)}'
        f'<span class="cat-label">{n}</span></a>'
        for s, n, _, _ in CATS if s != exclude)
    if coat:
        items += (f'<a class="cat-item ci-coat coat-link" href="about.html">{MINI_COAT}'
                  f'<span class="cat-label">About</span></a>')
    return (f'<section class="cat-menu" aria-label="Pick a cat"><div class="wrap">'
            f'<div class="cat-row">{items}</div></div></section>')


def signup(heading="Be first to meet the books",
           copy="No spam, no schedules &mdash; just a note when something real happens."):
    if not SHOW_SIGNUP:
        return ""
    return f'''<div class="signup panel rv">
<h2>{heading}</h2>
<p class="lede">{copy}</p>
<form data-signup novalidate>
<label class="hp" aria-hidden="true">Leave this empty<input type="text" name="_hp" tabindex="-1" autocomplete="off"></label>
<label class="hp" for="tk-email">Email address</label>
<input id="tk-email" type="email" name="email" required placeholder="you@example.com" autocomplete="email">
<button class="btn" type="submit">Join the list</button>
</form>
<p class="signup__note" role="status" aria-live="polite"></p>
<p class="fine">Or follow along on <a href="{IG}">Instagram</a>.</p>
</div>'''


def footer():
    return (f'<footer><div class="wrap">'
            f'<p class="foot-motto">A toddler is just 4 cats in a trenchcoat.</p>'
            f'<div class="foot-meta"><span>&copy; 2026 Toddler Kitties</span>'
            f'<a href="{IG}">@toddlerkitties</a><a href="mailto:{MAIL}">{MAIL}</a>'
            f'</div></div></footer>')


def page(fn, title, desc, body, active=None, theme=None, chrome=True, rooted=False, exit=None):
    tattr = f' data-theme="{theme}"' if theme else ""
    if exit: tattr += f' data-exit="{exit}"' 
    head = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{SITE}/{fn}">
<meta name="keywords" content="toddler kitties, toddlerkitties, toddler kitties com, cute cats for kids, 4 cats in a trenchcoat">
<meta property="og:locale" content="en_US">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Toddler Kitties">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{SITE}/{fn}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{FAVI}" type="image/svg+xml">
{FONTS}
{CSS}
</head>
<body{tattr}>
<a class="skip" href="#main">Skip to content</a>
'''
    parts = [head, SPRITE]
    if chrome: parts.append(header(active))
    parts.append(f'<main id="main">{body}</main>')
    if chrome:
        parts.append(cat_menu(exclude=theme, coat=(fn != 'about.html')))
        parts.append(footer())
    parts.append(JS + "\n</body>\n</html>\n")
    out = "".join(parts)
    if rooted:
        out = re.sub(r'(href|src)="(?!https?:|mailto:|data:|#|/)([^"]+)"', r'\1="/\2"', out)
        out = out.replace('<meta name="viewport"',
                          '<meta name="robots" content="noindex">\n<meta name="viewport"')
    open(fn, "w").write(out)
    print("wrote", fn)


load_assets()

# ================================================================== splash ===

page("index.html", "Toddler Kitties",
     "Four real cats, one storybook world. A toddler is just 4 cats in a trenchcoat.",
     f'''<div class="splash"><div class="splash-in">
<div class="peek-row">{"".join(cat_svg(s) for s,_,_,_ in CATS)}</div>
<h1>Toddler <span class="accent">Kitties</span></h1>
<span class="eyebrow">A toddler is just 4 cats in a trenchcoat</span>
<a class="btn" href="home.html">Continue &rarr;</a>
</div></div>''', chrome=False)

# ==================================================================== home ===

def crew_card(slug, name, code, role, line):
    return (f'<a class="panel card card-{slug} rv" href="{slug}.html">'
            f'{cat_svg(slug, "art")}'
            f'<h3>{name}</h3><span class="role">{role}</span>'
            f'<p>{line}</p></a>')

HOME = f'''
<section class="hero wrap center">
  <span class="eyebrow">A toddler is just 4 cats in a trenchcoat</span>
  <h1>Toddler <span class="accent">Kitties</span></h1>
  <p class="lede">Four real cats with startlingly human personalities &mdash; a sassy judge,
  a gentle giant, a garden princess and a chaos agent &mdash; and the storybooks they inspired.</p>
</section>

<section class="wrap">
  <h2 class="rv">Meet the crew</h2>
  <p class="lede rv" style="margin:.5rem 0 1.6rem">Every page belongs to a cat. Pick one &mdash;
  or tap the kitties at the bottom of any page.</p>
  <div class="card-grid">
    {crew_card("baker","Baker","B1","The Judge",
      "The first one home, and she picked us. Holds court from the windowsill, has a war cry, and a heart-shaped nose she refuses to discuss.")}
    {crew_card("doc","Doc","D2","The Bailiff",
      "The gentle giant. Cow-patterned, enormously eared, plays real fetch, and once stole a bag of cookies back out of the bin.")}
    {crew_card("lulu","Lulu","L3","Garden Kitty",
      "Arrived through the garden and never left. Eats cucumber on purpose and knows how to work the air conditioner.")}
    {crew_card("ilona","Ilona","I4","The Chaos Agent",
      "Talks through closed doors, chose her own collar twice, and quietly takes the night shift whenever somebody is sick.")}
  </div>
</section>

<section class="wrap">
  <h2 class="rv" style="margin-bottom:1.4rem">Explore</h2>
  <div class="trio">
    <a class="panel rv" href="books.html">{ICONS["book"]}<h3>The Books</h3>
      <p>Four origin stories, one per cat, in the order they arrived &mdash; then all of them in one room.</p></a>
    <a class="panel rv" href="shop.html">{ICONS["tag"]}<h3>Shop</h3>
      <p>Goodies on the way. Nothing to buy just yet.</p></a>
    <a class="panel rv" href="about.html">{ICONS["heart"]}<h3>About</h3>
      <p>How a household joke about a trenchcoat turned into a drawing project.</p></a>
  </div>
</section>

'''
page("home.html", "Toddler Kitties — Home",
     "Meet Baker, Doc, Lulu and Ilona — four real cats, one storybook world.",
     HOME, active="home.html")

# ================================================================ cat pages ===

def cat_page(slug, name, code, role, tagline, tally, story, book_no, quote, who, nxt):
    items = "".join(f"<li><span>{t}</span></li>" for t in tally)
    ns, nn = nxt
    return f'''
<section class="wrap meet">
  <div class="stage rv" data-stage>{cat_svg(slug, "stage__cat", f"{name}, cartoon portrait", inline=True)}</div>
  <div class="rv">
    <span class="eyebrow">{role}</span>
    <h1>{name}</h1>
    <p class="lede" style="margin-top:.7rem">{tagline}</p>
  </div>
</section>

<section class="wrap">
  <div class="panel rv">
    <h2 style="margin-bottom:.9rem">Things {name} does</h2>
    <ul class="tally">{items}</ul>
  </div>
</section>

<section class="wrap">
  <div class="panel rv">
    <span class="pill">Book {book_no}</span>
    <h2 style="margin:.7rem 0 .8rem">Her story, roughly</h2>
    <p class="lede">{story}</p>
  </div>
</section>

<section class="wrap says rv">
  <p class="bubble">{quote}</p>
  <span class="who">&mdash; {who}</span>
</section>

<section class="wrap center" style="padding-top:0">
  <a class="btn btn-ghost" href="{ns}.html">Meet {nn} &rarr;</a>
</section>

'''

CAT_DATA = [
 dict(slug="baker", name="Baker", code="B1", role="The Judge", book_no="One",
   tagline="The first one home &mdash; and she chose us, not the other way round.",
   tally=["Picked her human out of a whole room and has considered the matter settled ever since.",
          "Has a war cry. It only means she wants to play. It took the household a while to work that out.",
          "Guards her carrier. It has her name on it. She knows.",
          "Once said hello to people in the next lane on the freeway.",
          "Has a heart-shaped nose and will not be acknowledging it."],
   story="Book One goes back before all of this &mdash; a window, a room full of other cats, and a decision she made without asking anybody's permission.",
   quote="I saw the whole thing. I <em>was</em> the whole thing.",
   who="Baker, probably", nxt=("doc","Doc")),

 dict(slug="doc", name="Doc", code="D2", role="The Bailiff", book_no="Two",
   tagline="The gentle giant of the house. Loud about absolutely everything.",
   tally=["Comes running when you call his name. Slightly less running these days.",
          "Plays real fetch with a sparkly pom pom &mdash; chases it, carries it back, drops it in your hand.",
          "Drinks water fast enough to sneeze, and has never once revised the technique.",
          "Opens cabinets. Retrieved a bag of cookies from the bin and re-hid it exactly where it had been.",
          "Wants a seat at the table, and will eat like a person if you put his bowl in front of his chair.",
          "Loves baths. With bubbles. And rubber ducks."],
   story="Book Two starts a very long way from here. There is a motel, a long drive north, and three weeks of medicine on a kitchen counter. It does not mention how loud he was about all of it.",
   quote="I said hello. I said it the whole way.",
   who="Doc, still talking", nxt=("lulu","Lulu")),

 dict(slug="lulu", name="Lulu", code="L3", role="Garden Kitty", book_no="Three",
   tagline="She was already home before anybody in the house had seen her.",
   tally=["Eats cucumber. On purpose. With enthusiasm.",
          "Works the portable air conditioner &mdash; power, mode, fan speed &mdash; then lies on it belly-up.",
          "Holds fingers, and keeps holding them.",
          "Sits bolt upright like a person, usually behind something that resembles a desk.",
          "Sleeps like we have world peace."],
   story="Book Three starts in the garden. Something had been taking bites out of it for weeks and slipping away behind the shed. Everybody suspected a raccoon. Everybody had been wrong for longer than they realised.",
   quote="I&rsquo;d already been coming in. Nobody asked.",
   who="Lulu, mid-cucumber", nxt=("ilona","Ilona")),

 dict(slug="ilona", name="Ilona", code="I4", role="The Chaos Agent", book_no="Four",
   tagline="Chaos agent by day. Quietly takes the night shift when somebody is unwell.",
   tally=["Was offered two collars, walked over, picked one up in her mouth, and chose it twice.",
          "Starts talking the instant a door closes. Any door. Immediately.",
          "Has tried a doorknob. Lacks the grip. Does not lack the will.",
          "Waits and complains at the closet door, three feet from the right door, and looks embarrassed when you walk past her.",
          "Takes the extra shift whenever someone is sick, tired or sad. Every single time."],
   story="Book Four opens with a trapper who wrote down that she was chill. He had known her for about eleven minutes.",
   quote="I&rsquo;m fine. Are <em>you</em> fine? Open the door.",
   who="Ilona, from the hallway", nxt=("baker","Baker")),
]

for d in CAT_DATA:
    plain = d["tagline"].replace("&mdash;", "—")
    page(f'{d["slug"]}.html', f'{d["name"]} — Toddler Kitties',
         f'{d["name"]}, {d["role"]}. {plain}',
         cat_page(**d), active=f'{d["slug"]}.html', theme=d["slug"])

# =================================================================== books ===

def book(slug, num, title, sub, body, status, soon=True):
    art = cat_svg(slug, "art") if slug else ""
    cls = "book book-wide" if not slug else "book"
    return (f'<div class="panel {cls} rv" style="--accent:{BOOK_C.get(slug,"#FF8FB1")};'
            f'--accent-ink:{BOOK_I.get(slug,"#C2456E")}">{art}<div>'
            f'<span class="num">Book {num}</span><h3>{title}</h3>'
            f'<p><strong>{sub}</strong><br>{body}</p>'
            f'<span class="pill{" pill-soon" if soon else ""}">{status}</span></div></div>')

BOOK_C = {"baker":"#B39DDB","doc":"#4468C4","lulu":"#4E9B62","ilona":"#F2C542"}
BOOK_I = {"baker":"#6A4A9C","doc":"#33509E","lulu":"#337A48","ilona":"#8F6206"}

BOOKS = f'''
<section class="hero wrap center">
  <span class="eyebrow">The storybooks</span>
  <h1>Four origin stories</h1>
  <p class="lede">One book per cat, in the order they arrived &mdash; then all four in the same
  room, which is where the trouble starts. Written and drawn by hand, at home, slowly.</p>
</section>

<section class="wrap">
  <div class="books">
    {book("baker","One","Mama Baker","How the first one chose us.",
      "Before the windowsill, before the name on the carrier. Told mostly in black and white, with one exception.",
      "Being drawn now", soon=False)}
    {book("doc","Two","Doc","A very long drive, and a very loud passenger.",
      "It starts a long way from this house, and it does not start well.", "Outlined")}
    {book("lulu","Three","Lulu","She was home before anyone saw her.",
      "The garden had been eaten for weeks. Two cats already knew who was doing it, and neither of them said anything.", "Outlined")}
    {book("ilona","Four","Ilona","The one they called chill.",
      "A family lost, a father who stayed, and a phone call from the shelter that started all of this.", "Outlined")}
    {book("","Five","The Cat Council","All four. One room. One long-overdue argument.",
      "The ensemble book &mdash; the one where everybody finally ends up on the same page.", "Someday")}
  </div>
</section>

<section class="wrap">
  <div class="panel rv center">
  <h2>Made at the kitchen table</h2>
  <p class="lede">Every page is drawn by hand from photographs of four cats who did not consent
  to any of this. It takes as long as it takes.</p>
  </div>
</section>

'''
page("books.html", "Books — Toddler Kitties",
     "Four hand-drawn origin storybooks — Baker, Doc, Lulu and Ilona — plus the ensemble book, The Cat Council.",
     BOOKS, active="books.html")

# ==================================================================== shop ===

SHOP = f'''
<section class="hero wrap center">
  <span class="eyebrow">Shop</span>
  <h1>Goodies coming soon</h1>
  <p class="lede">There is nothing to buy yet, and we would rather say that plainly than
  put up a fake countdown.</p>
</section>

<section class="wrap">
  <div class="panel rv center">
    <h2>When there&rsquo;s something worth sending you</h2>
    <p class="lede">It will show up here first. No pre-orders,
    no limited drops, no urgency you didn&rsquo;t ask for.</p>
  </div>
</section>

'''
page("shop.html", "Shop — Toddler Kitties",
     "The Toddler Kitties shop isn't open yet. Join the list to hear first.",
     SHOP, active="shop.html")

# =================================================================== about ===


ABOUT = f'''
<section class="hero wrap center">
  <span class="eyebrow">About</span>
  <h1>It started as a joke about a trenchcoat</h1>
  <p class="lede">Four cats live here. They have opinions, grudges, routines and expressions
  that are frankly too human for comfort. At some point somebody said it out loud &mdash;
  a toddler is just 4 cats in a trenchcoat. The joke never went away.</p>
</section>

<section class="wrap">
  <div class="trio">
    <div class="panel rv"><h3>They&rsquo;re all real</h3>
      <p>Baker, Doc, Lulu and Ilona are four actual cats in one actual home. Nothing here is
      made up, except the bits where we guess what they&rsquo;re thinking.</p></div>
    <div class="panel rv"><h3>Drawn by hand</h3>
      <p>Every character is drawn from photographs of the real cat, on an iPad, at the kitchen
      table, by somebody learning as they go. The heart-shaped nose is deliberate.</p></div>
    <div class="panel rv"><h3>Told in order</h3>
      <p>Each book is one cat&rsquo;s origin story, in the order they arrived. Then everybody
      ends up in the same room and the last book happens.</p></div>
  </div>
</section>

<section class="wrap">
  <div class="panel rv center">
    <h2>Three of these four came from the same place</h2>
    <p class="lede">One shelter is responsible for most of this household. They get a proper
    thank-you in the books, where there&rsquo;s room to do it justice.</p>
  </div>
</section>

<section class="wrap">
  <div class="panel rv center">
    <h2>Say hello</h2>
    <p class="lede">Questions, hellos, or photos of your own tiny troublemakers:
    <a href="mailto:{MAIL}">{MAIL}</a>, or <a href="{IG}">@toddlerkitties</a>.</p>
  </div>
</section>


<section class="coat-bit wrap rv">
  {COAT}
  <p class="cap">A toddler is just 4 cats in a trenchcoat.</p>
</section>
'''
page("about.html", "About — Toddler Kitties",
     "How a household joke about four cats in a trenchcoat became a hand-drawn storybook world.",
     ABOUT, active="about.html", exit="coat")

# ===================================================================== 404 ===

NOTFOUND = f'''
<div class="oops wrap"><div class="oops-in">
  <svg class="nf-scene" viewBox="0 0 380 232" role="img" aria-labelledby="nfT">
    <title id="nfT">Ilona meowing at the wrong door while the right door waits</title>
    <line x1="14" y1="206" x2="366" y2="206" stroke="#3B2E4A" stroke-width="3" stroke-linecap="round"/>
    <!-- the wrong door (hers, apparently) -->
    <g>
      <rect x="46" y="36" width="96" height="170" rx="8" fill="#C9A26B" stroke="#3B2E4A" stroke-width="4"/>
      <rect x="59" y="50" width="70" height="58" rx="6" fill="#B98C57" stroke="#3B2E4A" stroke-width="3"/>
      <rect x="59" y="122" width="70" height="64" rx="6" fill="#B98C57" stroke="#3B2E4A" stroke-width="3"/>
      <circle cx="131" cy="118" r="5" fill="#8C6839" stroke="#3B2E4A" stroke-width="3"/>
    </g>
    <!-- the right door -->
    <g>
      <rect x="238" y="36" width="96" height="170" rx="8" fill="#FFE9A8" stroke="#3B2E4A" stroke-width="4"/>
      <g id="nfPanel">
        <rect x="238" y="36" width="96" height="170" rx="8" fill="#C9A26B" stroke="#3B2E4A" stroke-width="4"/>
        <rect x="251" y="50" width="70" height="58" rx="6" fill="#B98C57" stroke="#3B2E4A" stroke-width="3"/>
        <rect x="251" y="122" width="70" height="64" rx="6" fill="#B98C57" stroke="#3B2E4A" stroke-width="3"/>
        <circle cx="249" cy="118" r="5" fill="#8C6839" stroke="#3B2E4A" stroke-width="3"/>
      </g>
    </g>
    <!-- Ilona, committed to the wrong one -->
    <svg x="66" y="126" width="86" height="86" viewBox="-6 -6 152 152"><use href="#tk-ilona"></use></svg>
    <!-- the meow -->
    <g id="nfBubble" opacity="0">
      <path d="M146 124 l7 14 l7 -11 Z" fill="#FFFFFF" stroke="#3B2E4A" stroke-width="3" stroke-linejoin="round"/>
      <rect x="126" y="92" width="80" height="35" rx="15" fill="#FFFFFF" stroke="#3B2E4A" stroke-width="3"/>
      <text x="166" y="116" text-anchor="middle" font-family="'Baloo 2','Nunito',sans-serif" font-weight="800" font-size="17" fill="#3B2E4A">Mrow!</text>
    </g>
  </svg>
  <span class="eyebrow">Page not found</span>
  <h1>Wrong door.</h1>
  <p class="lede">Whatever was here is gone, but Ilona is meowing at the handle anyway.
  The page you actually want is about three feet that way.</p>
  <a class="btn" id="nfBtn" href="home.html">Take the right door &rarr;</a>
</div></div>
'''
page("404.html", "Page not found — Toddler Kitties",
     "This page is missing. Ilona was nearby.", NOTFOUND, theme="ilona", rooted=True)

# ================================================================== extras ===

open("favicon.svg", "w").write(FAVICON_SVG)
open("robots.txt", "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
urls = ["", "home.html", "baker.html", "doc.html", "lulu.html", "ilona.html",
        "books.html", "shop.html", "about.html"]
rows = "\n".join(f'  <url><loc>{SITE}/{u}</loc><changefreq>monthly</changefreq>'
                 f'<priority>{"1.0" if u in ("", "home.html") else "0.8"}</priority></url>'
                 for u in urls)
open("sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n'
    f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{rows}\n</urlset>\n')
print("favicon.svg, robots.txt, sitemap.xml written")
