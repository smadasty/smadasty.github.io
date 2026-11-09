# Srikanth Madishetti: profile site

Static site: plain HTML, CSS and a little vanilla JS. No build step, no dependencies.

## Structure

```
index.html          Homepage: hero diagram, principles, project showcase, foundations, experience, writing
home.css            Shared tokens, header, footer and homepage styles (dark default, light toggle)
essay.css           Essay layout: header, diagram, prose column, sticky outline
steps.js            Theme toggle, essay step diagram, outline highlighting
writing/index.html  Essay list
writing/*.html      Essays
favicon.svg         Tab icon
og.png              1200x630 link-preview image
404.html            Not-found page for GitHub Pages
```

## Preview locally

```
cd site && python3 -m http.server 8765
# http://localhost:8765
```

## Adding an essay

Essays share one page shell and one diagram format. Copy an existing essay in
`writing/`, keep the header, diagram, `<article class="prose">` and author box,
and replace the text. Each `<h2>` needs an `id` so it appears in the outline.
Add a card to `writing/index.html` and to the Writing section of `index.html`.

## Deploy (GitHub Pages)

Served from the `smadasty/smadasty.github.io` repo, `main` branch, root.
Copy this folder's contents into the repo root and push. A `CNAME` file in the
repo root sets a custom domain; without it the site is at https://smadasty.github.io.
If the domain changes, update the `og:url`, `og:image` and `canonical` URLs.
