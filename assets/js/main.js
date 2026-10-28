/* SmokeRoach hub: renders videos, news, gear and the chat from /data/*.json */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var get = function (u) { return fetch(u, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(u); return r.json(); }); };
  var fmtN = function (n) { return Number(n).toLocaleString("en-GB"); };
  var fmtDate = function (d) { return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); };
  var ago = function (d) {
    var days = Math.floor((Date.now() - new Date(d)) / 864e5);
    if (days < 1) return "today"; if (days === 1) return "yesterday"; if (days < 7) return days + " days ago";
    if (days < 30) { var w = Math.floor(days / 7); return w + (w === 1 ? " week ago" : " weeks ago"); }
    return fmtDate(d);
  };
  var ytId = /^[A-Za-z0-9_-]{11}$/;
  var safeUrl = function (u) { return /^(https?:|mailto:)/i.test(u || "") ? u : "#"; };
  var thumb = function (id, q) { return "https://i.ytimg.com/vi/" + id + "/" + (q || "hqdefault") + ".jpg"; };

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- reveal on scroll ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  var watch = function (root) { (root || document).querySelectorAll(".reveal:not(.in)").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); }); };
  watch();

  /* ---------- site settings: goal + chat ---------- */
  get("data/site.json").then(function (s) {
    var g = s.goal || {};
    if (g.watchHoursTarget) {
      $("#goal-label").textContent = g.label || "Road to monetisation";
      $("#wh-text").textContent = fmtN(g.watchHours) + " / " + fmtN(g.watchHoursTarget);
      $("#sub-text").textContent = fmtN(g.subscribers) + " / " + fmtN(g.subscribersTarget);
      if (g.asOf) $("#goal-asof").textContent = "As of " + fmtDate(g.asOf) + " · watching full videos helps loads";
      setTimeout(function () {
        $("#wh-bar").style.setProperty("--p", Math.min(100, g.watchHours / g.watchHoursTarget * 100) + "%");
        $("#sub-bar").style.setProperty("--p", Math.min(100, g.subscribers / g.subscribersTarget * 100) + "%");
      }, 300);
    }
    loadChat(s.chat || {});
  }).catch(function () { loadChat({ provider: "klaklak", klaklak: { room: "smokeroach-hub-0151", theme: "dark" } }); });

  function loadChat(c) {
    var box = $("#chat-embed"), open = $("#chat-open"), p = c.provider, cfg = c[p] || {}, src = "";
    var frame = function (url, title) {
      box.innerHTML = '<iframe src="' + esc(url) + '" title="' + esc(title) + '" allow="clipboard-write" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    };
    if (p === "klaklak" && cfg.room) {
      src = "https://klaklak.com/embed/" + encodeURIComponent(cfg.room) + (cfg.theme && cfg.theme !== "light" ? "?theme=" + encodeURIComponent(cfg.theme) : "");
      frame(src, "SmokeRoach community chat room"); open.href = "https://klaklak.com/" + encodeURIComponent(cfg.room);
    } else if (p === "tlkio" && cfg.channel) {
      src = "https://embed.tlk.io/" + encodeURIComponent(cfg.channel) + (cfg.theme ? "?theme=" + encodeURIComponent(cfg.theme) : "");
      frame(src, "SmokeRoach community chat room"); open.href = "https://tlk.io/" + encodeURIComponent(cfg.channel);
    } else if (p === "minnit" && cfg.url) {
      frame(cfg.url, "SmokeRoach community chat room"); open.href = cfg.url;
    } else if (p === "widgetbot" && cfg.server && cfg.channel) {
      src = "https://e.widgetbot.io/channels/" + encodeURIComponent(cfg.server) + "/" + encodeURIComponent(cfg.channel);
      frame(src, "SmokeRoach Discord chat"); open.href = "https://discord.com/channels/" + encodeURIComponent(cfg.server) + "/" + encodeURIComponent(cfg.channel);
    } else if (p === "chatango" && cfg.handle) {
      box.innerHTML = "";
      var sc = document.createElement("script");
      sc.id = "cid0020000" + Math.floor(Math.random() * 1e9);
      sc.setAttribute("data-cfasync", "false"); sc.async = true; sc.src = "https://st.chatango.com/js/gz/emb.js";
      sc.style.cssText = "width:100%;height:100%;";
      sc.text = JSON.stringify({ handle: cfg.handle, arch: "js", styles: { a: "24094a", b: 100, c: "FFFFFF", d: "FFFFFF", k: "150630", l: "150630", m: "24094a", n: "FFFFFF", p: "12", q: "24094a", r: 100, t: 0, usricon: 1, surl: 0, allowpm: 0, cnrs: "0.35", fwtickm: 1 } });
      box.appendChild(sc); open.href = "https://" + encodeURIComponent(cfg.handle) + ".chatango.com/";
    } else {
      box.innerHTML = '<div class="chat-empty">The chat room is getting set up. Come back soon, or say hi in the YouTube comments in the meantime!</div>';
      open.style.display = "none";
    }
  }

  /* ---------- videos ---------- */
  function lite(el, id, title) {
    el.style.backgroundImage = "url('" + thumb(id, "maxresdefault") + "'), url('" + thumb(id, "hqdefault") + "')";
    el.addEventListener("click", function () {
      el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + esc(title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    }, { once: true });
  }
  get("data/videos.json").then(function (d) {
    var vids = (d.videos || []).filter(function (v) { return !v.short && ytId.test(v.id); });
    if (!vids.length) throw new Error("no videos");
    var f = vids[0], isNew = (Date.now() - new Date(f.published)) < 7 * 864e5;
    var feat = $("#feature");
    feat.classList.remove("skeleton"); feat.classList.add("reveal");
    feat.innerHTML = '<button class="lite" type="button" aria-label="Play: ' + esc(f.title) + '"><span class="play"></span></button>' +
      '<div class="info"><span class="badge ' + (isNew ? "new" : "") + '">' + (isNew ? "New video" : "Latest video") + '</span>' +
      '<h3>' + esc(f.title) + '</h3><div class="meta">' + ago(f.published) + (f.views != null ? " · " + fmtN(f.views) + " views" : "") + '</div>' +
      '<div class="gactions"><a class="btn btn-yt btn-sm" href="' + esc(f.url) + '" target="_blank" rel="noopener">Watch on YouTube</a></div></div>';
    lite(feat.querySelector(".lite"), f.id, f.title);
    $("#video-grid").innerHTML = vids.slice(1, 7).map(function (v) {
      return '<a class="card vcard reveal" href="' + esc(v.url) + '" target="_blank" rel="noopener">' +
        '<div class="thumb"><img loading="lazy" src="' + thumb(v.id, "mqdefault") + '" srcset="' + thumb(v.id, "mqdefault") + ' 320w, ' + thumb(v.id, "hqdefault") + ' 480w, ' + thumb(v.id, "sddefault") + ' 640w" sizes="(max-width:640px) 42vw, 380px" alt="" width="320" height="180"></div>' +
        '<div class="body"><h3>' + esc(v.title) + '</h3><div class="meta">' + ago(v.published) + (v.views != null ? " · " + fmtN(v.views) + " views" : "") + '</div></div></a>';
    }).join("");
    watch();
  }).catch(function () {
    var feat = $("#feature"); feat.classList.remove("skeleton");
    feat.innerHTML = '<div class="info"><h3>Our videos live on YouTube</h3><div class="gactions"><a class="btn btn-yt btn-sm" href="https://www.youtube.com/@smoke_roach/videos" target="_blank" rel="noopener">Watch now</a></div></div>';
  });

  /* ---------- news ---------- */
  get("data/news.json").then(function (d) {
    var posts = (d.posts || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    $("#news-list").innerHTML = posts.map(function (p) {
      var src = p.video && ytId.test(p.video) ? thumb(p.video, "mqdefault") : (p.image && /^assets\//.test(p.image) ? p.image : "");
      var t = src ? '<a class="pthumb' + (p.video ? "" : " pimg") + '" href="' + esc(safeUrl(p.link)) + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img loading="lazy" src="' + esc(src) + '" alt=""></a>' : "";
      return '<article class="card post reveal">' + t + '<div><span class="tag tag-' + esc(p.tag) + '">' + esc(p.tag || "News") + '</span><time class="pdate" datetime="' + esc(p.date) + '">' + fmtDate(p.date) + '</time>' +
        '<h3>' + esc(p.title) + '</h3><p>' + esc(p.body) + '</p>' +
        (p.link ? '<a class="go" href="' + esc(safeUrl(p.link)) + '" target="_blank" rel="noopener">' + esc(p.linkText || "Read more") + '</a>' : "") + '</div></article>';
    }).join("");
    watch();
  }).catch(function () { $("#news-list").innerHTML = '<p>News is loading slowly. Try refreshing.</p>'; });

  /* ---------- merch ---------- */
  get("data/merch.json").then(function (d) {
    if (d.shopUrl) $("#shop-all").href = safeUrl(d.shopUrl);
    var lastGroup = null, hasGroups = (d.items || []).some(function (m) { return m.group; });
    $("#merch-list").innerHTML = (d.items || []).map(function (m) {
      var url = esc(safeUrl(m.url));
      var g = m.group || (hasGroups ? "The originals" : null), head = "";
      if (g !== lastGroup) { lastGroup = g; if (g) head = '<h3 class="mgroup">' + esc(g) + '</h3>'; }
      return head + '<article class="card mcard reveal">' + (m.isNew ? '<span class="mnew">New</span>' : "") +
        '<a class="mimg" href="' + url + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img loading="lazy" width="800" height="800" src="' + esc(m.image) + '" alt="' + esc(m.name) + '"></a>' +
        '<div class="minfo"><h3>' + esc(m.name) + '</h3><p>' + esc(m.blurb) + '</p>' +
        '<div class="mrow">' + (m.price ? '<div class="mprice">' + esc(m.price) + '</div>' : "") + '<a class="btn btn-green btn-sm" href="' + url + '" target="_blank" rel="noopener" aria-label="' + esc((m.cta || "Buy now") + ": " + m.name) + '">' + esc(m.cta || "Buy now") + ' ↗</a></div></div></article>';
    }).join("") + '<a class="card mpromo reveal" href="' + esc(safeUrl(d.shopUrl || "https://smokeroach.teemill.com/")) + '" target="_blank" rel="noopener">' +
      '<span class="kicker k-gold">The full SmokeRoach shop</span><span class="mbig">More crew designs</span>' +
      '<p>Budget-travel tees from the crew, printed to order on organic cotton by Teemill. New drops land here first.</p><span class="btn btn-gold btn-sm">Browse the shop ↗</span></a>';
    watch();
  }).catch(function () { $("#merch-list").innerHTML = '<p>Merch is loading slowly. <a href="https://smokeroach.teemill.com/" target="_blank" rel="noopener">Visit the shop</a>.</p>'; });

  /* ---------- gear & socials ---------- */
  var icons = {
    youtube: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.2v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.6a5.8 5.8 0 1 0 5 5.8V9.1a7.4 7.4 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.2" fill="#fff" stroke="none"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></svg>'
  };
  get("data/links.json").then(function (d) {
    if (d.note) $("#gear-note").textContent = "ℹ️ " + d.note;
    $("#gear-list").innerHTML = (d.gear || []).map(function (g) {
      return '<article class="card gcard reveal"><span class="aff ' + (g.affiliate ? "yes" : "") + '">' + (g.affiliate ? "Affiliate link" : "Not an affiliate link") + '</span>' +
        '<div class="gicon" aria-hidden="true">' + esc(g.emoji || "⭐") + '</div><h3>' + esc(g.name) + '</h3><p>' + esc(g.blurb) + '</p><div class="gactions">' +
        '<a class="btn btn-green btn-sm" href="' + esc(safeUrl(g.url)) + '" target="_blank" rel="' + (g.affiliate ? "sponsored noopener" : "noopener") + '">' + esc(g.cta || "Check it out") + '</a>' +
        (g.video ? '<a class="btn btn-ghost btn-sm" href="' + esc(safeUrl(g.video)) + '" target="_blank" rel="noopener">▶ ' + esc(g.videoText || "Watch") + '</a>' : "") + '</div></article>';
    }).join("");
    $("#social-list").innerHTML = (d.socials || []).map(function (s) {
      var mail = /^mailto:/.test(s.url);
      return '<a class="card social reveal" href="' + esc(safeUrl(s.url)) + '"' + (mail ? "" : ' target="_blank" rel="noopener"') + '><span class="ic ic-' + esc(s.icon) + '">' + (icons[s.icon] || "") + '</span><span><b>' + esc(s.name) + '</b><small>' + esc(s.handle) + '</small></span></a>';
    }).join("");
    watch();
  }).catch(function () {});
})();
