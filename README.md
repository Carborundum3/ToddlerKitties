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

Right now the form opens the visitor's email app addressed to you — that works but loses people.
To actually collect addresses, pick ONE of these (both free):

**Option A — Formspree** (simplest; submissions land in your inbox + a dashboard)
1. Go to [formspree.io](https://formspree.io) → sign up with toddlerkitties@gmail.com
2. Click **+ New form**, name it "Toddler Kitties list"
3. Copy the endpoint it shows you — it looks like `https://formspree.io/f/abcdwxyz`
4. Open `assets/tk.js`, **line 10**, paste it between the quotes:
   `const SIGNUP_ENDPOINT = "https://formspree.io/f/abcdwxyz";`
5. Run `python3 build.py`, commit, push. Done — every form on the site goes live at once.
6. Free tier: 50 signups/month. Plenty until Book One launches.

**Option B — Buttondown** (better long-term: it's a real mailing list you can WRITE to
when a book launches, not just collect)
1. Go to [buttondown.com](https://buttondown.com) → create account (pick a username, e.g. `toddlerkitties`)
2. Your endpoint is: `https://buttondown.com/api/emails/embed-subscribe/toddlerkitties`
   (swap in your actual username)
3. Paste that into line 10 of `assets/tk.js`, run `python3 build.py`, commit.
4. Free tier: up to 100 subscribers; subscribers get a confirmation email (good — proves consent).

The form already sends data in the format both services expect, includes a honeypot spam trap,
and shows success/failure messages. You only ever touch line 10.

To see your collected emails later: Formspree → dashboard → your form; Buttondown → Subscribers tab.

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

- **Page turns:** every page fades/slides in. Regular links fade out quickly. The four cats in
  the bottom menu each have their own send-off when clicked — Baker: laser + giant paw swat +
  page flinch; Doc: pom pom bouncing across the screen with sparkles; Lulu: petals and cucumber
  raining; Ilona: hearts and dandelion seeds rising. Leaving the About page (any link) plays the
  big one: all four cats run into the empty trenchcoat, about a second long. Everything switches
  off automatically for anyone with "reduce motion" set.
- **Baker's page:** the laser is back — her pupils track it around the stage, and every few
  seconds a paw (toe beans out) darts up to swat it. The dot escapes. Doc's pom pom, Lulu's
  petals-and-cucumber, and Ilona's hearts-and-seeds all run again too.
- **Header:** the four sleeping loafs sit under the TK wordmark on every page. They're decorative
  (the cat menu at the bottom is still the navigation).
- **Bottom menu:** after the four cats there's a mini trenchcoat labelled "About" — clicking it
  plays the cats-run-into-the-coat animation and lands on the About page. It's hidden on the
  About page itself (the big coat lives there).

## Two things to double-check

- **Baker's coat colours are a guess.** I had her heart nose, pointed ears, half-lidded eyes,
  forehead stripes and frown, but not her actual colouring — she's currently a warm grey-brown
  tabby with a lavender collar to match her page theme. Doc, Lulu and Ilona are drawn to the
  descriptions you gave.
- **The shelter thank-you on `about.html`** is deliberately unnamed. Add the name once you've
  checked they're happy to be mentioned.
