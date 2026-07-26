# Toddler Kitties — site files

Static HTML. No build step required to deploy. Drop these into the `ToddlerKitties` repo root.

---

## ⚠️ Before you copy anything in

Two files already in your repo must **stay** — don't delete them:

- [ ] `CNAME` — this is what points toddlerkitties.com at GitHub Pages
- [ ] `google*.html` — your Search Console verification file

Everything else can be replaced.

---

## What's here

| File | What it is |
|---|---|
| `index.html` | Splash — the trenchcoat |
| `home.html` | The docket board |
| `baker.html` `doc.html` `lulu.html` `ilona.html` | One case file per cat |
| `books.html` `shop.html` `about.html` | Volumes / sealed locker / origin |
| `404.html` | Ilona's fault |
| `assets/tk.css` | All styling |
| `assets/tk.js` | Reveals, signup, per-cat animations |
| `assets/cats.svg` | Master art file for the four chibi cats |
| `assets/favicon.svg` | Tab icon |
| `sitemap.xml` `robots.txt` | For Search Console |
| `build.py` | Regenerates every page (optional, see below) |

---

## Turning on the real email signup

Right now the form opens the visitor's email app addressed to you. That works, but it loses
about half the people who click it. To collect addresses properly:

1. Make a free account at **[buttondown.com](https://buttondown.com)** (built for exactly this —
   a list you email when a book is done) or **[formspree.io](https://formspree.io)** (simpler,
   just forwards to your inbox).
2. Copy the form endpoint URL they give you.
3. Open `assets/tk.js`. **Line 10.** Paste it between the quotes:

   ```js
   const SIGNUP_ENDPOINT = "https://formspree.io/f/xxxxxxx";
   ```

4. Save, commit, done. Every form on the site starts working at once.

---

## Previewing before you push

Just double-click `index.html`. Everything is self-contained — the cat art is embedded in each
page, so it works straight off your hard drive.

---

## Changing the cat art later

Edit `assets/cats.svg` (the four `<symbol>` blocks), then run:

```bash
python3 build.py
```

That re-stamps the art into all nine pages. If you'd rather not touch Python, you can also edit
the `<symbol>` blocks directly inside each HTML file — they're at the very top of the `<body>`.

---

## Two things to double-check

- **Baker's coat colours are a guess.** I had her heart nose, pointed ears, half-lidded eyes,
  forehead stripes and frown, but not her actual colouring — she's currently a warm grey-brown
  tabby. Doc, Lulu and Ilona are drawn to the descriptions you gave.
- **The shelter thank-you on `about.html`** is deliberately unnamed. Add the name once you've
  checked they're happy to be mentioned.
