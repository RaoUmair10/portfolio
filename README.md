# Rao Umair — Portfolio

## Folder structure
```
index.html              → main page skeleton
css/style.css            → all styles
js/sites-data.js         → client network data (26 sites, grouped by brand)
js/main.js                → renders sections, modal logic, code animation
sections/hero.html       → hero section (loaded into index.html at runtime)
sections/project.html    → "Other Experience — Project" section (loaded at runtime)
images/profile/          → your profile photo goes here (avatar.jpg)
images/sites/            → per-site screenshots go here (domain.png)
```

## How to run
The hero and project sections are loaded dynamically via `fetch()`, which
browsers block when a file is opened directly (`file://...`) due to CORS.

Run a quick local server from this folder, then open it in your browser:

```
python3 -m http.server 8000
```
Then visit: http://localhost:8000

(Any static server works — VS Code "Live Server" extension, `npx serve`, etc.)

## Editing
- Change site links/brands → `js/sites-data.js`
- Change hero text/stats   → `sections/hero.html`
- Change the project entry → `sections/project.html`
- Change colors/layout     → `css/style.css`
- Add your photo           → `images/profile/avatar.jpg` (see `images/README.md`)
- Add site screenshots     → `images/sites/<domain>.png` (see `images/README.md`)
