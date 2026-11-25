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
  // --- later in-game sources (hooked up by gameplay later): arms dealer, garages, coffeeshop merch, tobacco/sweet shops, Sur-Ron bikes
  { id: 'wp_knife', name: 'Kitchen knife', icon: '🔪', spot: 'arms', cat: 'weapon', rarity: 'common', desc: 'Basic blade. Close range only.' },
  { id: 'wp_butterfly', name: 'Butterfly knife', icon: '🗡️', spot: 'arms', cat: 'weapon', rarity: 'uncommon', desc: 'Flicks open with a satisfying clack.' },
  { id: 'wp_pistol', name: '9mm pistol', icon: '🔫', spot: 'arms', cat: 'weapon', rarity: 'uncommon', desc: 'Reliable sidearm, 15-round mag.' },
  { id: 'wp_revolver', name: 'Revolver', icon: '🔫', spot: 'arms', cat: 'weapon', rarity: 'rare', desc: 'Six shots, big kick.' },
  { id: 'wp_smg', name: 'SMG', icon: '🔫', spot: 'arms', cat: 'weapon', rarity: 'rare', desc: 'Sprays fast, empties faster.' },
  { id: 'wp_shotgun', name: 'Pump shotgun', icon: '🔫', spot: 'arms', cat: 'weapon', rarity: 'rare', desc: 'Clears a doorway.' },
  { id: 'wp_rifle', name: 'Assault rifle', icon: '🔫', spot: 'arms', cat: 'weapon', rarity: 'epic', desc: 'Full-auto, long range.' },
  { id: 'wp_sniper', name: 'Sniper rifle', icon: '🎯', spot: 'arms', cat: 'weapon', rarity: 'epic', desc: 'One shot from across the canal.' },
  { id: 'wp_grenade', name: 'Grenade', icon: '💣', spot: 'arms', cat: 'weapon', rarity: 'rare', desc: 'Pull the pin, count to three.' },
  { id: 'wp_rpg', name: 'RPG', icon: '🚀', spot: 'arms', cat: 'weapon', rarity: 'legendary', desc: 'Rocket launcher. Absolutely not subtle.' },
  { id: 'veh_hatch', name: 'Battered hatchback', icon: '🚗', spot: 'garage', cat: 'vehicle', rarity: 'uncommon', desc: 'From the garage. 140k on the clock, starts first time (mostly).' },
  { id: 'veh_van', name: 'White Transit-style van', icon: '🚐', spot: 'garage', cat: 'vehicle', rarity: 'uncommon', desc: 'Ladder rack, mystery dents.' },
  { id: 'veh_cab', name: 'Black cab', icon: '🚕', spot: 'garage', cat: 'vehicle', rarity: 'rare', desc: 'Proper Liverpool hackney.' },
  { id: 'veh_saloon', name: 'Blacked-out saloon', icon: '🚘', spot: 'garage', cat: 'vehicle', rarity: 'rare', desc: 'Tints, alloys, loud exhaust.' },
  { id: 'veh_sports', name: 'Sports car', icon: '🏎️', spot: 'garage', cat: 'vehicle', rarity: 'epic', desc: 'Fastest thing on the Strand.' },
  { id: 'veh_surron', name: 'Sur-Ron e-bike', icon: '🏍️', spot: 'surron', cat: 'vehicle', rarity: 'epic', desc: 'Silent electric dirt bike. Hidden in Amsterdam, or chained up off Holt Road.' },
  { id: 'cz_bag', name: 'Chongyz Lounge man bag', icon: '👜', spot: 'chongyz', cat: 'merch', rarity: 'uncommon', desc: 'Cross-body bag, Chongyz Lounge logo.' },
  { id: 'cz_cap', name: 'Chongyz Lounge cap', icon: '🧢', spot: 'chongyz', cat: 'merch', rarity: 'uncommon', desc: 'Snapback with the Chongyz Lounge badge.' },
  { id: 'cz_hoodie', name: 'Chongyz Lounge hoodie', icon: '🧥', spot: 'chongyz', cat: 'merch', rarity: 'rare', desc: 'Heavyweight Chongyz Lounge hoodie.' },
  { id: 'cz_tee', name: 'Chongyz Lounge t-shirt', icon: '👕', spot: 'chongyz', cat: 'merch', rarity: 'common', desc: 'Chongyz Lounge tee.' },
  { id: 'cz_grinder', name: 'Chongyz Lounge grinder', icon: '⚙️', spot: 'chongyz', cat: 'rolling', rarity: 'uncommon', desc: 'Four-piece grinder from behind the Chongyz counter.' },
  { id: 'cr_bag', name: 'Chillin Rooms man bag', icon: '👜', spot: 'chillin', cat: 'merch', rarity: 'uncommon', desc: 'Cross-body bag with the 麻 logo.' },
  { id: 'cr_cap', name: 'Chillin Rooms cap', icon: '🧢', spot: 'chillin', cat: 'merch', rarity: 'uncommon', desc: 'Chillin Rooms cap, Holt Road.' },
  { id: 'cr_hoodie', name: 'Chillin Rooms hoodie', icon: '🧥', spot: 'chillin', cat: 'merch', rarity: 'rare', desc: 'Black Chillin Rooms hoodie, blue 麻 neon print.' },
  { id: 'cr_tee', name: 'Chillin Rooms t-shirt', icon: '👕', spot: 'chillin', cat: 'merch', rarity: 'common', desc: 'Chillin Rooms tee.' },
  { id: 'cr_grinder', name: 'Chillin Rooms grinder', icon: '⚙️', spot: 'chillin', cat: 'rolling', rarity: 'uncommon', desc: 'Grinder from behind the Chillin Rooms counter.' },
  { id: 'rl_skins', name: 'Rolling skins', icon: '📜', spot: 'tobacco', cat: 'rolling', rarity: 'common', desc: 'Only from tobacco shops and sweet shops; the coffeeshops don\'t sell them.' },
  { id: 'rl_roach', name: 'Roach card', icon: '🧾', spot: 'tobacco', cat: 'rolling', rarity: 'common', desc: 'Card for roaches. Tear, fold, roll.' },
  { id: 'rl_tobacco', name: 'Pouch of tobacco', icon: '🍂', spot: 'tobacco', cat: 'rolling', rarity: 'common', desc: 'Rolling tobacco for the mix.' },
];
for (const i of ITEMS) if (!i.cat) i.cat = /hoodie|wabcap/.test(i.id) ? 'merch' : /grinder|skins/.test(i.id) ? 'rolling' : 'souvenir';
export const BY_ID = Object.fromEntries(ITEMS.map(i => [i.id, i]));
export const CATS = { souvenir: '🎁 Souvenirs', merch: '🧢 Merch', rolling: '🌿 Rolling kit', weapon: '🔫 Weapons', vehicle: '🚗 Vehicles' };
export const SPOTS = { kerk: { name: 'Oude Kerk', cooldown: 300 }, shop: { name: 'Kensington big shop', cooldown: 300 }, arms: { name: 'arms dealer' }, garage: { name: 'garages' }, surron: { name: 'Sur-Ron spots' }, chongyz: { name: 'Chongyz Lounge' }, chillin: { name: 'Chillin Rooms' }, tobacco: { name: 'tobacco & sweet shops' } };
export function rollItem(spot, r = Math.random) { const pool = ITEMS.filter(i => i.spot === spot); let tot = 0; for (const i of pool) tot += RARITY[i.rarity].w; let x = r() * tot; for (const i of pool) { x -= RARITY[i.rarity].w; if (x <= 0) return i; } return pool[0]; }
