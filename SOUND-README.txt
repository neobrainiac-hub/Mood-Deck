MOOD DECK — THE SOUND UPDATE

WHAT'S INCLUDED
- A redesigned, responsive Sound page that follows Mood Deck's warm cream, sage and forest visual system.
- Three original procedural ambient soundscapes stored locally in assets/audio:
  * soft-rain.wav
  * ocean-waves.wav
  * forest-morning.wav
- Audio playback controls, looping playback, volume control and a compact floating player.
- Sound filters for calm, focus and rest.
- Favourites saved locally in this browser using localStorage.
- Spoken Psalm 23:1 using the browser's built-in text-to-speech voice.
- Spotify discovery links and an official Spotify embed field for playlist, album, track, show or episode URLs.

SPOTIFY SCOPE / LIMITATIONS
This is not a Spotify account connection or OAuth login. It embeds a Spotify item the user chooses and provides links to Spotify searches. Spotify controls playback and may require sign-in or restrict playback depending on account, region, device and item. A real account-linking flow requires a Spotify Developer app, approved redirect URI and secure authentication implementation. Keep client secrets out of frontend files; the later backend phase should handle secure token exchange.

LOCAL DATA
Favourites and the selected Spotify embed URL are stored in this browser only. They are not synced between devices or accounts.

AUDIO
The included WAV files are original procedurally generated ambient soundscapes made for this prototype. They are short loops (14–18 seconds) with gentle fade edges. They are not field recordings. They are bundled in the project, so they do not need an external audio service.

TEST CHECKLIST
1. Open pages/music.html through a local server (recommended) or the project's existing local preview.
2. Play each of the three sounds; check pause/resume, volume and stop.
3. Switch between All sounds, I need calm, I need focus and I need rest.
4. Save and unsave favourites; refresh and confirm favourites remain in this browser.
5. Listen to Psalm 23:1 and stop narration.
6. Paste a public Spotify playlist or album link and choose Add player. Confirm the official Spotify embed appears. Try a malformed/non-Spotify URL and confirm validation message.
7. Check the page at desktop and mobile widths.

No Supabase, backend, API key or paid subscription is required for the included ambient audio or Spotify embed-link feature. Spotify's own playback requirements still apply to Spotify content.
