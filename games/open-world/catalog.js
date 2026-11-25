// SmokeRoach Open World item catalogue (shared by the game and the Marketplace page; keep both copies identical).
// spot: where it drops. 'kerk' = Oude Kerk (top of De Wallen, Amsterdam); 'shop' = the big shop on Kensington (Liverpool).
export const RARITY = { common: { w: 60, col: '#b8c0c8', label: 'Common' }, uncommon: { w: 25, col: '#73d216', label: 'Uncommon' }, rare: { w: 11, col: '#3aa0ff', label: 'Rare' }, epic: { w: 3, col: '#c061ff', label: 'Epic' }, legendary: { w: 1, col: '#ffb000', label: 'Legendary' } };
export const ITEMS = [
  { id: 'ams_tulip', name: 'Tulip bulb', icon: '🌷', spot: 'kerk', rarity: 'common', desc: 'A proper Dutch tulip bulb. Smells of soil and church candles.' },
  { id: 'ams_magnet', name: 'Clog fridge magnet', icon: '👞', spot: 'kerk', rarity: 'common', desc: 'Tiny wooden clog. Every nan in Liverpool wants one.' },
  { id: 'ams_postcard', name: 'Canal postcard', icon: '🖼️', spot: 'kerk', rarity: 'common', desc: '"Wish you were here" from the Oudezijds Voorburgwal.' },
  { id: 'ams_stroop', name: 'Stroopwafel tin', icon: '🍪', spot: 'kerk', rarity: 'common', desc: 'Sealed tin of stroopwafels. Holds its value, unlike the euro.' },
  { id: 'ams_lighter', name: 'XXX lighter', icon: '🔥', spot: 'kerk', rarity: 'uncommon', desc: 'Red Amsterdam XXX clipper. Never leaves your pocket.' },
  { id: 'ams_bell', name: 'Oude Kerk bell charm', icon: '🔔', spot: 'kerk', rarity: 'uncommon', desc: 'Little brass bell from the oldest church in the city.' },
  { id: 'ams_guilder', name: 'Old guilder coin', icon: '🪙', spot: 'kerk', rarity: 'rare', desc: 'A pre-euro guilder found between the church pews.' },
  { id: 'ams_key', name: 'Brass church key', icon: '🗝️', spot: 'kerk', rarity: 'legendary', desc: 'A heavy old key from the Oude Kerk tower. Nobody knows what it opens.' },
  { id: 'lp_liverbird', name: 'Liver Bird keyring', icon: '🐦', spot: 'shop', rarity: 'common', desc: 'Every Scouser\'s keys need one.' },
  { id: 'lp_scouse', name: 'Tin of scouse', icon: '🥫', spot: 'shop', rarity: 'common', desc: 'Blind scouse, even. Still a meal.' },
  { id: 'lp_skins', name: 'King-size skins', icon: '📜', spot: 'shop', rarity: 'common', desc: 'A booklet of king-size papers with tips.' },
  { id: 'lp_hoodie', name: 'SmokeRoach hoodie', icon: '🧥', spot: 'shop', rarity: 'uncommon', desc: 'Official SmokeRoach merch. Black, comfy, smells faintly of the Chillin Rooms.' },
  { id: 'lp_grinder', name: 'SmokeRoach grinder', icon: '⚙️', spot: 'shop', rarity: 'uncommon', desc: 'Four-piece metal grinder with the roach logo.' },
  { id: 'lp_wabcap', name: 'WAB Where Ash Burns cap', icon: '🧢', spot: 'shop', rarity: 'rare', desc: 'Black WAB cap. Limited run.' },
  { id: 'lp_ticket', name: 'Golden SmokeBus ticket', icon: '🎫', spot: 'shop', rarity: 'rare', desc: 'A gold ticket for the SmokeBus, Amsterdam to Holt Road.' },
  { id: 'lp_gunner', name: 'Gunner plush', icon: '🐶', spot: 'shop', rarity: 'epic', desc: 'Champagne Bullmastiff plush with floppy ears. Drools a bit.' },
];
export const BY_ID = Object.fromEntries(ITEMS.map(i => [i.id, i]));
export const SPOTS = { kerk: { name: 'Oude Kerk', cooldown: 300 }, shop: { name: 'Kensington big shop', cooldown: 300 } };
export function rollItem(spot, r = Math.random) { const pool = ITEMS.filter(i => i.spot === spot); let tot = 0; for (const i of pool) tot += RARITY[i.rarity].w; let x = r() * tot; for (const i of pool) { x -= RARITY[i.rarity].w; if (x <= 0) return i; } return pool[0]; }
