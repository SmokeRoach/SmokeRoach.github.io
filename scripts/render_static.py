#!/usr/bin/env python3
"""Write the latest videos, gear and social links straight into index.html as plain HTML.

Why: search engines (and anyone with JavaScript off) then see real titles and links
without running main.js. main.js still runs and simply replaces this HTML with the
same cards, so the look does not change.

Run from the repo root:  python3 scripts/render_static.py
update_videos.py calls this automatically after it refreshes data/videos.json.
Only the bits between <!--STATIC:name--> and <!--/STATIC:name--> are touched.
"""
import html, json, os, re
from datetime import datetime

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
INDEX = os.path.join(ROOT, "index.html")
esc = lambda s: html.escape("" if s is None else str(s), quote=True)
ICON = {  # same icons as main.js
    "youtube": '<svg viewBox="0 0 24 24"><path fill="#fff" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>',
    "tiktok": '<svg viewBox="0 0 24 24"><path fill="#fff" d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.2v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.6a5.8 5.8 0 1 0 5 5.8V9.1a7.4 7.4 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5z"/></svg>',
    "x": '<svg viewBox="0 0 24 24"><path fill="#fff" d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.2L1.8 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.5l11.2 14.5z"/></svg>',
    "link": '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    "instagram": '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.2" fill="#fff" stroke="none"/></svg>',
    "mail": '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></svg>',
}
safe = lambda u: u if re.match(r"^(https?:|mailto:)", u or "", re.I) else "#"
th = lambda i, q: f"https://i.ytimg.com/vi/{i}/{q}.jpg"


def day(iso):
    d = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    return f"{d.day} {d.strftime('%b %Y')}"


def meta(v):
    return day(v["published"]) + (f" · {v['views']:,} views" if v.get("views") is not None else "")


def feature(v):
    return (f'<a class="lite" href="{esc(v["url"])}" target="_blank" rel="noopener" aria-label="Play: {esc(v["title"])}" '
            f'style="background-image:url(\'{th(v["id"], "hqdefault")}\')"><span class="play"></span></a>'
            f'<div class="info"><span class="badge">Latest video</span><h3>{esc(v["title"])}</h3><div class="meta">{meta(v)}</div>'
            f'<div class="gactions"><a class="btn btn-yt btn-sm" href="{esc(v["url"])}" target="_blank" rel="noopener">Watch on YouTube</a></div></div>')


def vcard(v):
    return (f'<a class="card vcard" href="{esc(v["url"])}" target="_blank" rel="noopener"><div class="thumb">'
            f'<img loading="lazy" src="{th(v["id"], "mqdefault")}" alt="{esc(v["title"])}" width="320" height="180"></div>'
            f'<div class="body"><h3>{esc(v["title"])}</h3><div class="meta">{meta(v)}</div></div></a>')


def gcard(g):
    return (f'<article class="card gcard"><span class="aff {"yes" if g.get("affiliate") else ""}">{"Affiliate link" if g.get("affiliate") else "Not an affiliate link"}</span>'
            f'<div class="gicon" aria-hidden="true">{esc(g.get("emoji") or "⭐")}</div><h3>{esc(g["name"])}</h3><p>{esc(g.get("blurb"))}</p><div class="gactions">'
            f'<a class="btn btn-green btn-sm" href="{esc(safe(g.get("url")))}" target="_blank" rel="{"sponsored noopener" if g.get("affiliate") else "noopener"}">{esc(g.get("cta") or "Check it out")}</a>'
            + (f'<a class="btn btn-ghost btn-sm" href="{esc(safe(g["video"]))}" target="_blank" rel="noopener">▶ {esc(g.get("videoText") or "Watch")}</a>' if g.get("video") else "")
            + '</div></article>')


def social(s):
    tgt = "" if s["url"].startswith("mailto:") else ' target="_blank" rel="noopener"'
    return (f'<a class="card social" href="{esc(safe(s["url"]))}"{tgt}>'
            f'<span class="ic ic-{esc(s.get("icon"))}">{ICON.get(s.get("icon"), "")}</span><span><b>{esc(s["name"])}</b><small>{esc(s.get("handle"))}</small></span></a>')


def put(page, name, body):
    pat = re.compile(r"(<!--STATIC:%s-->).*?(<!--/STATIC:%s-->)" % (name, name), re.S)
    if not pat.search(page):
        raise SystemExit(f"marker STATIC:{name} missing from index.html")
    return pat.sub(lambda m: m.group(1) + body + m.group(2), page)


def main():
    vids = [v for v in json.load(open(os.path.join(ROOT, "data", "videos.json"), encoding="utf-8"))["videos"]
            if not v.get("short") and re.fullmatch(r"[A-Za-z0-9_-]{11}", v["id"])]
    links = json.load(open(os.path.join(ROOT, "data", "links.json"), encoding="utf-8"))
    page = open(INDEX, encoding="utf-8").read()
    if vids:
        page = put(page, "feature", feature(vids[0]))
        page = put(page, "grid", "".join(vcard(v) for v in vids[1:7]))
    page = put(page, "gear", "".join(gcard(g) for g in links.get("gear", [])))
    page = put(page, "socials", "".join(social(s) for s in links.get("socials", [])))
    open(INDEX, "w", encoding="utf-8").write(page)
    print(f"index.html: static feature + {min(6, max(0, len(vids) - 1))} videos, {len(links.get('gear', []))} gear, {len(links.get('socials', []))} social links")


if __name__ == "__main__":
    main()
