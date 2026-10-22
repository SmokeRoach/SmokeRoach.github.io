#!/usr/bin/env python3
"""Regenerate data/videos.json from the public SmokeRoach YouTube RSS feed.

Usage (from the repo root):  python3 scripts/update_videos.py
No API key needed. Only standard-library Python 3.

- Pulls https://www.youtube.com/feeds/videos.xml?channel_id=UCA0pTyBG_pv6txNlUS_cXgw
  (YouTube's feed holds the newest ~15 uploads).
- Marks Shorts (a video is a Short if youtube.com/shorts/<id> answers 200 instead of redirecting).
- Skips any video id listed in EXCLUDE below (handy for keeping the hub on-brand).
"""
import json, os, sys, urllib.request, urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

CHANNEL_ID = "UCA0pTyBG_pv6txNlUS_cXgw"
FEED = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "videos.json")
# Video ids to leave off the hub (still on YouTube, just not featured here).
EXCLUDE = {"3w4OIvkbpTg"}

NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015",
      "m": "http://search.yahoo.com/mrss/"}
UA = {"User-Agent": "Mozilla/5.0 (SmokeRoach hub updater)"}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


def is_short(vid):
    opener = urllib.request.build_opener(NoRedirect)
    try:
        r = opener.open(urllib.request.Request(f"https://www.youtube.com/shorts/{vid}", headers=UA, method="HEAD"), timeout=15)
        return r.status == 200
    except urllib.error.HTTPError as e:
        return False  # 3xx => normal video
    except Exception:
        return None  # unknown


def main():
    xml = urllib.request.urlopen(urllib.request.Request(FEED, headers=UA), timeout=20).read()
    root = ET.fromstring(xml)
    videos = []
    for e in root.findall("a:entry", NS):
        vid = e.find("yt:videoId", NS).text
        if vid in EXCLUDE:
            continue
        stats = e.find("m:group/m:community/m:statistics", NS)
        short = is_short(vid)
        videos.append({
            "id": vid,
            "title": " ".join(e.find("a:title", NS).text.split()),
            "published": e.find("a:published", NS).text,
            "views": int(stats.get("views")) if stats is not None and stats.get("views") else None,
            "short": bool(short),
            "url": f"https://www.youtube.com/shorts/{vid}" if short else f"https://www.youtube.com/watch?v={vid}",
            "thumb": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
        })
    if not videos:
        sys.exit("Feed returned no videos; leaving data/videos.json unchanged.")
    out = {"updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
           "channel": f"https://www.youtube.com/channel/{CHANNEL_ID}", "videos": videos}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(videos)} videos ({sum(not v['short'] for v in videos)} long-form) to {os.path.normpath(OUT)}")


if __name__ == "__main__":
    main()
