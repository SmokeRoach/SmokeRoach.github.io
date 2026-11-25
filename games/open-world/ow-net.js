// SmokeRoach Open World: accounts, cloud saves, chat, inventory and trades (Supabase). Shared by the Marketplace page and the game.
// With no backend configured everything falls back to guest/local mode.
import { SUPABASE_URL, SUPABASE_ANON_KEY, EMAIL_DOMAIN } from './config.js';
const HERE = new URL('.', import.meta.url).href;
export const online = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
let sb = null, user = null, profile = null, initP = null;
const loadLib = () => new Promise((res, rej) => { if (window.supabase?.createClient) return res(); const s = document.createElement('script'); s.src = HERE + 'vendor/supabase.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
export function init() { return initP || (initP = (async () => { if (!online) return false; await loadLib(); sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, storageKey: 'sr_ow_auth', autoRefreshToken: true } }); const { data } = await sb.auth.getSession(); user = data.session?.user || null; if (user) await loadProfile(); sb.auth.onAuthStateChange((_e, s) => { user = s?.user || null; if (!user) profile = null; }); return true; })()); }
async function loadProfile() { const { data } = await sb.from('profiles').select('id,username,cash').eq('id', user.id).maybeSingle(); profile = data; return data; }
export const signedIn = () => !!(sb && user);
export const me = () => profile;
export const client = () => sb;
export const cleanName = s => String(s || '').trim();
export const validName = s => /^[A-Za-z0-9_]{3,16}$/.test(s);
const email = u => u.toLowerCase() + '@' + EMAIL_DOMAIN;
const nice = e => { const m = (e?.message || String(e || '')).replace(/^.*?:\s*/, ''); if (/already registered|already exists|duplicate|unique/i.test(m)) return 'That username is taken.'; if (/invalid login/i.test(m)) return 'Wrong username or password.'; return m || 'Something went wrong.'; };
export async function signUp(name, pass) { await init(); if (!online) throw new Error('Accounts are switching on soon. Play as a guest for now.'); name = cleanName(name); if (!validName(name)) throw new Error('Usernames are 3 to 16 letters, numbers or _.'); if (String(pass).length < 6) throw new Error('Password needs at least 6 characters.');
  const { data: taken } = await sb.from('profiles').select('id').ilike('username', name).maybeSingle(); if (taken) throw new Error('That username is taken.');
  const { data, error } = await sb.auth.signUp({ email: email(name), password: pass, options: { data: { username: name } } }); if (error) throw new Error(nice(error)); user = data.user; if (!data.session) { const r = await sb.auth.signInWithPassword({ email: email(name), password: pass }); if (r.error) throw new Error(nice(r.error)); user = r.data.user; } await loadProfile(); return profile; }
export async function logIn(name, pass) { await init(); if (!online) throw new Error('Accounts are switching on soon. Play as a guest for now.'); const { data, error } = await sb.auth.signInWithPassword({ email: email(cleanName(name)), password: pass }); if (error) throw new Error(nice(error)); user = data.user; await loadProfile(); return profile; }
export async function logOut() { if (sb) await sb.auth.signOut(); user = null; profile = null; }
const rpc = async (fn, args) => { await init(); if (!signedIn()) throw new Error('Sign in first.'); const { data, error } = await sb.rpc(fn, args); if (error) throw new Error(nice(error)); return data; };
// --- saves
export async function pushSave(snap, delta = 0) { const r = await rpc('save_progress', { p_state: snap, p_delta: Math.round(delta) || 0 }); if (profile && r) profile.cash = r.cash; return r; }
export async function pullSave() { await init(); if (!signedIn()) return null; const { data } = await sb.from('saves').select('state,updated_at').eq('user_id', user.id).maybeSingle(); await loadProfile(); return data ? { ...data.state, cash: profile?.cash } : { cash: profile?.cash }; }
// write the account save into this browser so the game boots at the account's spot
export function applyToLocal(st) { try { const LS = localStorage; for (const k of Object.keys(LS)) if (k.startsWith('sra_') && !/^sra_(music|sfx|sens|q)$/.test(k)) LS.removeItem(k); for (const [k, v] of Object.entries(st?.sra || {})) if (k.startsWith('sra_')) LS.setItem(k, v); if (typeof st?.cash === 'number') LS.setItem('sra_money', JSON.stringify(st.cash)); if (st?.pos) LS.setItem('sr_ow_pos', JSON.stringify(st.pos)); else LS.removeItem('sr_ow_pos'); sessionStorage.removeItem('arrivedLiverpool'); sessionStorage.removeItem('srResume'); sessionStorage.removeItem('holtTries'); } catch (e) { } }
export function localSnap() { const o = {}; for (const k of Object.keys(localStorage)) if (k.startsWith('sra_')) o[k] = localStorage.getItem(k); let pos = null, inv = {}; try { pos = JSON.parse(localStorage.getItem('sr_ow_pos')); inv = JSON.parse(localStorage.getItem('sr_ow_inv')) || {}; } catch (e) { } return { pos, sra: o, inv, t: Date.now() }; }
// --- loot + inventory + trades
export const claimLoot = spot => rpc('claim_loot', { p_spot: spot });
export const importGuest = items => rpc('import_guest', { p_items: items || {} });
export async function inventory() { await init(); if (!signedIn()) return null; const { data } = await sb.from('inventory').select('item_id,qty').eq('user_id', user.id).gt('qty', 0); return Object.fromEntries((data || []).map(r => [r.item_id, r.qty])); }
export const createTrade = (item, wantCash, wantItem) => rpc('create_trade', { p_item: item, p_want_cash: wantCash || null, p_want_item: wantItem || null });
export const cancelTrade = id => rpc('cancel_trade', { p_id: id });
export async function acceptTrade(id) { const r = await rpc('accept_trade', { p_id: id }); if (profile && r?.cash != null) profile.cash = r.cash; return r; }
export async function trades() { await init(); if (!online) return []; const { data } = await sb.from('trades').select('*').or('status.eq.open,closed_at.gt.' + new Date(Date.now() - 864e5).toISOString()).order('created_at', { ascending: false }).limit(60); return data || []; }
// --- chat
export async function chatHistory() { await init(); if (!online) return []; const { data } = await sb.from('chat').select('id,username,body,created_at').order('created_at', { ascending: false }).limit(60); return (data || []).reverse(); }
export async function chatSend(body) { await init(); if (!signedIn()) throw new Error('Sign in to chat.'); const { error } = await sb.from('chat').insert({ body: String(body).slice(0, 240), username: profile?.username || '?' }); if (error) throw new Error(nice(error)); }
export async function subscribe(onChat, onTrade) { await init(); if (!online) return () => { }; const ch = sb.channel('ow-public').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat' }, p => onChat?.(p.new)).on('postgres_changes', { event: '*', schema: 'public', table: 'trades' }, p => onTrade?.(p.new)).subscribe(); return () => sb.removeChannel(ch); }
