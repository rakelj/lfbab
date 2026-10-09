# LFB rettighetsapp (prototype)

A self-guided web app based on Landsforeningen for barnevernsbarn's workshop
"Dine rettigheter på mottaket", for young people living at asylum reception
centres. Plan: [Google Doc](https://docs.google.com/document/d/1BxxsbGTnTvzTGuPX8NlovQdgQHsoA275FKzPZaw2Vjo/edit).

v0.1 scope: Norwegian only, chapter 1 (representative), chapter 2 (health,
one story), check-in/closing, rights cards and the help button.

## Run locally

Requires Node.js 20+.

```
npm install
npm run dev
```

## Text and translations

All visible text lives in `src/i18n/strings.json`, which is generated from the
translation sheet (one column per language). After editing the sheet:

```
npm run sync-strings
```

Cards shown to staff ("Vis til en ansatt") always use the Norwegian text.
Languages listed on the first screen are configured in `src/i18n/languages.js`.

## Images

Source illustrations are in `D:\LFB Asylbarna`. `scripts/prepare-assets.ps1`
resizes the ones the app uses into `public/img`. Add new images to its list
and re-run it.

## Privacy

- Progress (language, finished chapters, rights cards, check-in weather) is
  kept in the browser's localStorage only. "Start på nytt" clears it.
- Answers to personal questions are never stored on the device.
- `src/answers.js` is where anonymous answers will be sent to LFB's sheet
  (v0.2). Only question, answer, language and date. Never names, free text or IDs.
- No external fonts, analytics or trackers. `no-referrer` is set in `index.html`.

## Deploy

Every push to `main` builds and publishes to GitHub Pages
(`.github/workflows/deploy.yml`): https://rakelj.github.io/lfbab/

The build uses relative paths (`base: './'` in `vite.config.js`), so `dist/`
can be moved to another static host (Cloudflare Pages, Netlify, LFB's own
web hotel) without changes.
