net-config.json — optional TURN relay settings, read by the game at runtime (edit on GitHub, no rebuild needed).

Recommended (Metered Open Relay, free 20 GB/month):
  { "iceServersUrl": "https://YOURAPP.metered.live/api/v1/turn/credentials?apiKey=CREDENTIAL_API_KEY", "iceServers": [] }
  Use the credential-scoped API key (TURN Server -> Credentials -> Get credential -> Show API Key),
  NEVER the account Secret Key from the Developers page.

Alternative: static servers  { "iceServers": [ { "urls": ["turn:host:3478"], "username": "...", "credential": "..." } ] }
The in-game 📶 panel shows whether TURN produced a "relay" candidate.
