# sotepedia.hu

The memorial page for SotePedia, the shared notebook of Semmelweis University students between 2011 and 2016.

Static HTML, CSS and a little JavaScript, served by GitHub Pages. `.nojekyll` tells Pages to serve the files as they are.

`404.html` is a copy of `index.html`, so every old wiki URL lands on the memorial. Copy it again after any change to `index.html`:

```
cp index.html 404.html
```

## Preview

The page uses root paths (`/styles.css`), so open it through a local server, not as a file:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## The heart

The heart counter is a Cloudflare Worker in `worker/`. It stores a single number in Workers KV, nothing else. It answers at `sp-heart.gombly.uk`, set in `HEART_ENDPOINT` in `app.js`. Each browser can leave one heart.

Deploy changes to it from `worker/`:

```
npx wrangler deploy
```
