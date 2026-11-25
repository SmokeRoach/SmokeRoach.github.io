import * as N from './ow-net.js';
import { ITEMS, BY_ID, RARITY } from './catalog.js';
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const J = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const BAD = /\b(c+u+n+t+s?|f+u+c+k+\w*|n+i+g+g+\w*|f+a+g+g?o*t*s?|r+e+t+a+r+d+s?|w+h+o+r+e+s?|s+l+u+t+s?|p+a+k+i+s?|s+p+a+s+t+i*c*s?|k+i+k+e+s?|c+h+i+n+k+s?)\b/gi;
const clean = s => s.replace(BAD, '****');
let mode = 'sign', myInv = {}, tradeRows = [];
const fmtT = t => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const spotTxt = p => !p ? 'new game (starts in De Wallen)' : p.lvl === 'lp' ? 'Holt Road, Liverpool' : 'De Wallen, Amsterdam';

function renderAuth() { const s = N.signedIn(); $('out').hidden = s; $('in').hidden = !s; if (s) { $('uname').textContent = N.me()?.username || ''; $('cash').textContent = '£' + (N.me()?.cash ?? 0); }
  $('spot').textContent = spotTxt(J('sr_ow_pos', null)); $('where').textContent = J('sr_ow_pos', null) ? '📍 Play drops you back at ' + spotTxt(J('sr_ow_pos', null)) + '.' : '';
  $('play').textContent = J('sr_ow_pos', null) ? '▶ CONTINUE' : '▶ PLAY';
  if (!N.online) $('amode').innerHTML = '<b>Accounts and chat are switching on very soon.</b> Until then you can play as a guest; your spot and items save on this device.';
  for (const id of ['sGo', 'csend', 'cmsg', 'sItem', 'sCash']) $(id).disabled = !s;
  $('cmsg').placeholder = s ? 'Say something…' : N.online ? 'Sign in to chat' : 'Chat opens when accounts switch on';
}
async function renderInv() { const s = N.signedIn(); myInv = s ? (await N.inventory().catch(() => null)) || {} : J('sr_ow_inv', {});
  const ids = Object.keys(myInv).filter(k => myInv[k] > 0 && BY_ID[k]);
  $('inv').innerHTML = ids.length ? ids.map(k => { const it = BY_ID[k]; return `<div class="it" title="${esc(it.desc)}" style="border-color:${RARITY[it.rarity].col}"><span class="q">×${myInv[k]}</span><span class="ic">${it.icon}</span>${esc(it.name)}</div>`; }).join('') : '<p class="mut" style="grid-column:1/-1">Nothing yet. Walk into the gold crates at the Oude Kerk (Amsterdam) and the Blue Nile Superstore on Holt Road (Liverpool).</p>';
  $('invnote').textContent = s ? '' : ids.length ? 'Guest items stay on this device. Make an account to sell them (your first few common finds come with you).' : '';
  $('sItem').innerHTML = ids.length ? ids.map(k => `<option value="${k}">${BY_ID[k].icon} ${esc(BY_ID[k].name)} (×${myInv[k]})</option>`).join('') : '<option value="">No items to sell yet</option>';
}
const RANK = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
const ago = t => { const s = (Date.now() - new Date(t)) / 1000; return s < 60 ? 'just now' : s < 3600 ? Math.floor(s / 60) + ' min ago' : s < 86400 ? Math.floor(s / 3600) + ' h ago' : Math.floor(s / 86400) + ' d ago'; };
let myRows = [];
function lstHtml(t) { const it = BY_ID[t.item_id] || { icon: '❔', name: t.item_id, rarity: 'common' }; const R = RARITY[it.rarity] || RARITY.common; const mine = N.me() && t.seller === N.me().id;
  const btn = mine ? '<button class="btn ghost sm" data-c="' + t.id + '">Cancel listing</button>' : `<button class="btn sm" data-a="${t.id}" ${N.signedIn() ? '' : 'disabled title="Sign in to buy"'}>Buy now · £${t.want_cash}</button>`;
  return `<div class="lst" style="border-color:${R.col}" data-id="${t.id}"><span class="ic">${it.icon}</span><h3>${esc(it.name)}</h3><span class="pill" style="align-self:flex-start;background:${R.col};color:#111">${R.label}</span><span class="pr">£${t.want_cash}</span><span class="by">by <b>${esc(t.seller_name)}</b> · ${ago(t.created_at)}</span>${btn}</div>`; }
function renderTrades() { const q = $('fq').value.trim().toLowerCase(), r = $('fr').value, a = $('fa').value, so = $('fs').value;
  let L = tradeRows.filter(t => { const it = BY_ID[t.item_id]; if (!it) return false; if (r && it.rarity !== r) return false; if (a && it.cat !== a) return false; if (q && !(it.name.toLowerCase().includes(q) || String(t.seller_name).toLowerCase().includes(q))) return false; return true; });
  L.sort(so === 'plo' ? (x, y) => x.want_cash - y.want_cash : so === 'phi' ? (x, y) => y.want_cash - x.want_cash : so === 'rar' ? (x, y) => RANK[BY_ID[y.item_id].rarity] - RANK[BY_ID[x.item_id].rarity] || x.want_cash - y.want_cash : (x, y) => new Date(y.created_at) - new Date(x.created_at));
  $('shop').innerHTML = L.length ? L.map(lstHtml).join('') : `<p class="mut">${!N.online ? 'The Marketplace opens as soon as accounts switch on.' : tradeRows.length ? 'Nothing matches those filters.' : 'Nothing for sale yet. Find items at the Oude Kerk and the big shop on Holt Road, then put them up here.'}</p>`;
  $('mine').innerHTML = !N.signedIn() ? '<p class="mut">Sign in to sell.</p>' : myRows.length ? myRows.slice(0, 20).map(t => { const it = BY_ID[t.item_id] || { icon: '❔', name: t.item_id }; const st = t.status === 'open' ? `<button class="btn ghost sm" data-c="${t.id}">Cancel</button>` : t.status === 'done' ? `<span class="pill" style="background:#73d216;color:#111">SOLD to ${esc(t.buyer_name)}</span>` : '<span class="pill">Cancelled</span>'; return `<div class="mrow"><span class="ic">${it.icon}</span><span class="grow">${esc(it.name)} · <b style="color:var(--gold)">£${t.want_cash ?? '-'}</b><br><span class="mut" style="font-size:12px">${ago(t.created_at)}</span></span>${st}</div>`; }).join('') : '<p class="mut">You have nothing for sale.</p>'; }
async function loadTrades() { try { tradeRows = await N.listings(); $('berr').textContent = ''; } catch (e) { tradeRows = []; $('berr').textContent = N.online ? 'Could not load the Marketplace: ' + e.message : ''; } myRows = await N.myListings().catch(() => []); renderTrades(); }
function addMsg(m) { const d = document.createElement('div'); d.className = 'msg'; d.innerHTML = `<b>${esc(m.username)}</b><time>${fmtT(m.created_at)}</time><div>${esc(clean(m.body))}</div>`; const L = $('chatLog'); const atEnd = L.scrollTop + L.clientHeight > L.scrollHeight - 30; L.appendChild(d); while (L.children.length > 120) L.firstChild.remove(); if (atEnd) L.scrollTop = L.scrollHeight; }

$('tSign').onclick = () => { mode = 'sign'; $('tSign').classList.add('on'); $('tLog').classList.remove('on'); $('aGo').textContent = 'Create account'; $('p').autocomplete = 'new-password'; };
$('tLog').onclick = () => { mode = 'log'; $('tLog').classList.add('on'); $('tSign').classList.remove('on'); $('aGo').textContent = 'Log in'; $('p').autocomplete = 'current-password'; };
$('aGo').onclick = async () => { $('aerr').textContent = ''; $('aGo').disabled = true; try {
    if (mode === 'sign') { await N.signUp($('u').value, $('p').value); await N.importGuest(J('sr_ow_inv', {})).catch(() => { }); const lm = +J('sra_money', 20) || 0; await N.pushSave(N.localSnap(), Math.max(0, Math.min(lm - 20, 500))); N.applyToLocal(await N.pullSave()); }
    else { await N.logIn($('u').value, $('p').value); const st = await N.pullSave(); if (st?.pos || st?.sra) N.applyToLocal(st); else { await N.pushSave(N.localSnap(), 0); N.applyToLocal(await N.pullSave()); } }
    $('p').value = ''; renderAuth(); await renderInv(); renderTrades();
  } catch (e) { $('aerr').textContent = e.message; } $('aGo').disabled = false; };
$('p').onkeydown = e => { if (e.key === 'Enter') $('aGo').click(); };
$('logout').onclick = async () => { try { await N.pushSave(N.localSnap(), 0); } catch (e) { } await N.logOut(); renderAuth(); await renderInv(); renderTrades(); };
for (const id of ['fq', 'fr', 'fa', 'fs']) $(id).oninput = renderTrades;
$('sGo').onclick = async () => { $('terr').textContent = ''; const item = $('sItem').value; if (!item) return; const cash = Math.round(+$('sCash').value); if (!(cash >= 1 && cash <= 100000)) { $('terr').textContent = 'Price must be £1 to £100,000.'; return; }
  $('sGo').disabled = true; try { await N.createTrade(item, cash); await renderInv(); await loadTrades(); } catch (e) { $('terr').textContent = e.message; } $('sGo').disabled = false; };
const act = async e => { const a = e.target.closest('[data-a]'), c = e.target.closest('[data-c]'); if (!a && !c) return; $('berr').textContent = ''; $('terr').textContent = ''; e.target.disabled = true;
  try { if (a) { const t = tradeRows.find(x => x.id === +a.dataset.a); if (t && !confirm(`Buy ${BY_ID[t.item_id]?.name} from ${t.seller_name} for £${t.want_cash}?`)) { e.target.disabled = false; return; } const r = await N.buy(+a.dataset.a); if (r?.cash != null) localStorage.setItem('sra_money', JSON.stringify(r.cash)); $('berr').innerHTML = '<span style="color:#73d216">✔ Bought! It\'s in your items.</span>'; } else await N.cancelTrade(+c.dataset.c); }
  catch (er) { $('berr').textContent = er.message; } await renderInv(); await loadTrades(); renderAuth(); };
$('shop').onclick = act; $('mine').onclick = act;
let lastSend = 0; const sendTimes = [];
$('cf').onsubmit = async e => { e.preventDefault(); $('cerr').textContent = ''; const v = $('cmsg').value.trim().replace(/\s+/g, ' '); if (!v) return; if (v.length > 240) { $('cerr').textContent = '240 characters max.'; return; }
  const now = Date.now(); while (sendTimes.length && now - sendTimes[0] > 60000) sendTimes.shift(); if (now - lastSend < 2000 || sendTimes.length >= 8) { $('cerr').textContent = 'Slow down a bit.'; return; }
  lastSend = now; sendTimes.push(now); $('csend').disabled = true; try { await N.chatSend(clean(v)); $('cmsg').value = ''; } catch (er) { $('cerr').textContent = er.message; } $('csend').disabled = false; };
$('play').onclick = async e => { if (!N.signedIn()) return; e.preventDefault(); try { const st = await N.pullSave(); const lp = J('sr_ow_pos', null); if (st?.pos && (!lp || (st.pos.t || 0) > (lp.t || 0))) N.applyToLocal(st); else if (typeof st?.cash === 'number') localStorage.setItem('sra_money', JSON.stringify(st.cash)); } catch (er) { } location.href = $('play').href; };
$('newgame').onclick = async () => { if (!confirm('Start a new game? Your saved spot, money, stamps and progress are reset (traded items and your wallet stay on your account).')) return; const keep = /^sra_(music|sfx|sens|nick|q|look)$/; for (const k of Object.keys(localStorage)) if ((k.startsWith('sra_') && !keep.test(k)) || k === 'sr_ow_pos' || k === 'sr_ow_loot' || (!N.signedIn() && k === 'sr_ow_inv')) localStorage.removeItem(k); try { sessionStorage.removeItem('arrivedLiverpool'); sessionStorage.removeItem('srResume'); } catch (er) { } if (N.signedIn()) try { await N.pushSave(N.localSnap(), 0); } catch (er) { } location.href = '../amsterdam/?fresh=1'; };

(async () => { renderAuth(); await N.init().catch(e => console.warn(e)); renderAuth(); await renderInv(); await loadTrades();
  (await N.chatHistory().catch(() => [])).forEach(addMsg); if (!N.online) $('chatLog').innerHTML = '<p class="mut">The live chat opens as soon as accounts switch on.</p>';
  N.subscribe(addMsg, () => { loadTrades(); if (N.signedIn()) renderInv(); });
  setInterval(() => { if (N.signedIn()) loadTrades(); }, 30000); window.__mk = { N, renderInv, loadTrades }; })();
