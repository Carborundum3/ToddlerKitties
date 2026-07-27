# Toddler Kitties — site files

Theme: the original sticker-storybook look — ink `#3B2E4A`, page `#F4EFFF`, pink `#FF8FB1`,
Baloo 2 + Nunito, 3px outlines and hard offset shadows. Each cat page takes on that cat's
colour (Baker `#B39DDB`, Doc `#4468C4`, Lulu `#4E9B62`, Ilona `#F2C542`).

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
| `index.html` | Splash — wordmark and the four cats |
| `home.html` | Hero, Meet the crew, Explore |
| `baker.html` `doc.html` `lulu.html` `ilona.html` | One page per cat, each in that cat's colour |
| `books.html` `shop.html` `about.html` | The books / shop / origin (trenchcoat lives here) |
| `404.html` | Ilona's fault |
| `assets/tk.css` | All styling |
| `assets/tk.js` | Page transitions, reveals, signup, per-cat stage animations |
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

4. Run `python3 build.py`, then commit. Every form on the site starts working at once.

---

## Previewing before you push

Double-click any `.html` file. **Each page is completely self-contained** — the styling, the
scripts and the cat art are all embedded inside the file itself. You can email yourself a single
page and it will still look right.

The only thing loaded from outside is the three Google fonts. With no internet it falls back to
Georgia / Courier New, which looks plainer but not broken.

---

## Changing the cat art later

`assets/` holds the **source** files — `cats.svg` (art), `tk.css` (styling), `tk.js` (behaviour).
The pages don't read them at runtime; they get stamped in at build time.

So after editing anything in `assets/`, run this once:

```bash
python3 build.py
```

Then commit. **If you skip this step nothing on the site will change** — that's the one gotcha
of self-contained pages. If you'd rather not touch Python, edit the `<style>`, `<script>` or
`<symbol>` blocks directly inside the HTML files instead.

---

## The little animations

- **Page turns:** every page fades/slides in, and clicking an internal link fades out before it
  navigates. Both switch off automatically for anyone with "reduce motion" set.
- **Baker's page:** the laser is back — her pupils track it around the stage, and every few
  seconds a paw (toe beans out) darts up to swat it. The dot escapes. Doc's pom pom, Lulu's
  petals-and-cucumber, and Ilona's hearts-and-seeds all run again too.
- **Header:** the four sleeping loafs sit under the TK wordmark on every page. They're decorative
  (the cat menu at the bottom is still the navigation).

## Two things to double-check

- **Baker's coat colours are a guess.** I had her heart nose, pointed ears, half-lidded eyes,
  forehead stripes and frown, but not her actual colouring — she's currently a warm grey-brown
  tabby with a lavender collar to match her page theme. Doc, Lulu and Ilona are drawn to the
  descriptions you gave.
- **The shelter thank-you on `about.html`** is deliberately unnamed. Add the name once you've
  checked they're happy to be mentioned.
