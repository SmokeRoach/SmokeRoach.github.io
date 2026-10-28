COFFEESHOP BALOU — LOGO DROP FOLDER
===================================
Drop the real Balou logo files here, named exactly:

  public/assets/balou/logo1.png   <- main logo (the big sign above the front door, the blade sign, wall frames)
  public/assets/balou/logo2.png   <- optional: 2nd image (round logo behind the counter + a framed panel)
  public/assets/balou/logo3.png   <- optional: framed panel, 1st-floor lounge
  public/assets/balou/logo4.png   <- optional: framed panel, top floor

(.jpg / .webp / .svg with the same names also work.) Any missing slot reuses logo1; if there is no logo at all the game
draws its own text-sign "COFFEESHOP BALOU". After dropping files just run `npx vite build` (the build lists the files in
assets/balou/logos.json automatically) and publish the dist folder — no code changes needed.
