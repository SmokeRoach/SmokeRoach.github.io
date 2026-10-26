SmokeRoach: De Wallen — open-world Amsterdam (browser, Three.js)

Play: open index.html over http(s) (any static host). Desktop: WASD/arrows move, mouse look, Shift run,
Space jump, E/F enter/exit vehicle or interact, M map, Esc pause, Tab players, T chat, V push-to-talk, O open mic.
Touch: on-screen stick + buttons; big TALK button for voice.

Day/night: automatic 24-minute cycle (20 min day, 4 min night, smooth dusk/dawn), driven by the real clock
so every player sees the same time of day. No manual control.

420 jet pack: hop on and off a scooter 4 times and a glowing "420" jet pack spawns in front of you
(again every further 4 hops). Walk into it or press E. Space = up, Shift/Ctrl = down, WASD = fly.
Rooftops are solid: land and walk on them.

Online (up to 8 per room): title screen -> PLAY ONLINE -> nickname -> Public lobby or a room code.
Serverless peer-to-peer (Trystero over public Nostr relays for signalling, WebRTC for data + voice).
A 9th player gets "room full" (a full public lobby overflows to lobby-2, -3 ...). Positions, animation,
vehicles and jet pack sync; NPCs, police and missions stay local to each player.
Voice is opt-in: press the mic button (or tap TALK on phones) and allow the microphone. Hold V / TALK to
speak, or toggle open mic. Voices are positional (louder when near). Per-player mute in the Tab list.
Needs HTTPS (or localhost) for the microphone. Some strict networks block peer-to-peer (no TURN relay).

Debug: ?debug enables test hooks (window.SRA), &t=HOUR fixes the time, &norender, &autojoin=CODE|lobby&nick=X,
&loopnet (test-only same-browser transport).

Credits: map data © OpenStreetMap contributors, ODbL. Three.js (MIT), Trystero (MIT). All textures procedural.
