# SmokeRoach hub (smokeroach.github.io)

Plain HTML/CSS/JS. No build step: edit, commit, push.

| What | Where |
|---|---|
| Latest videos | `data/videos.json`, regenerate with `python3 scripts/update_videos.py` (public RSS, no API key). Skip a video by adding its id to `EXCLUDE` in the script. Shorts are kept in the file but not shown. |
| News / life & channel updates | `data/news.json`: add a post at the top (`date`, `tag`, `title`, `body`, optional `link`, `linkText`, `video`). |
| Gear, promos, socials | `data/links.json`: to switch a card to an affiliate link, change `url` and set `"affiliate": true` (shows an "Affiliate link" badge). |
| Chat room | `data/site.json` → `chat.provider` (`klaklak`, `chatango`, `minnit`, `widgetbot`, `tlkio` or `none`) plus that provider's settings. |
| Monetisation tracker | `data/site.json` → `goal`. |

Do not move or rename: `googled2cfd0bd9607ef8b.html` (Search Console), `privacy.html`, `terms.html` (Google API audit), and the "SmokeRoach Channel Manager" text in `index.html` (#about).
