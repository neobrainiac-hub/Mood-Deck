# Mood Deck — modular multi-page foundation (KJV build)

Mood Deck uses HTML, CSS and vanilla JavaScript. It has no React dependency or build step.

## Open the project
1. Extract the ZIP.
2. Open the folder in VS Code.
3. Start a local server (for example, VS Code Live Server) and open `index.html`.
4. The Bible reader and 365-day plan use local JSON files and an online KJV chapter service. A local server is recommended because browsers restrict `fetch()` from `file://` pages.

## Preserved prototype
The original working Mood Deck prototype remains in `index.html`, `styles/main.css` and `scripts/prototype.js`. Its profile, mood check-ins, journal, insights, Elo reflection library, Mood Play, export and existing storage keys have not been intentionally renamed:
- `moodDeckV2Profile`
- `moodDeckV2Entries`
- `moodDeckV2Journal`
- `moodDeckV2Garden`

The original script remains intact to reduce regression risk while the application is restructured incrementally.

## What changed in this build
- Mobile navigation now exposes Home, Check-in, Journal, Insights, Elo, Mood Play, The Word, The Sound, Ripple Room, Community and Profile. The bottom navigation scrolls horizontally on small screens.
- Mood Deck now uses a reusable SVG brand mark (`assets/mood-deck-mark.svg`).
- Elo's chat header uses the illustrated avatar already present in the original prototype (`assets/elo-avatar.svg`).
- The Word has a working KJV reader interface with all 66 book names, all 1,189 chapter selectors, reference jumping, text-size controls, browser read-aloud, bookmarks and local chapter caching.
- KJV verse text is fetched one chapter at a time from KJV JSON endpoint (`https://api.getbible.net/v3/kjv/{bookId}/{chapter}.json`). Previously opened chapters are cached in localStorage. The entire 31,102-verse corpus is not embedded in this ZIP; chapters not yet cached need an internet connection.
- The 365-day plan assigns all 1,189 canonical chapters across 365 days in sequence, without omitting chapters. Completion is stored locally.
- The Sound includes a generated ambient tone using Web Audio and browser text-to-speech for Psalm 23:1. These are functional browser-generated experiences, not licensed recordings or studio voices.
- Ripple Room now has a Canvas water environment, animated rings, pointer/touch ripples, four reflection modes, optional generated ambient sound and private local reflections.
- The new pages share responsive horizontal navigation.

## KJV source and rights
The KJV endpoint is retained from the previously tested project build. This package does not independently certify the endpoint's availability, licensing terms or service limits; verify the provider's current terms and the applicable Bible edition rights before public or commercial distribution.

## Important boundaries
- Bible chapters are loaded from the online service and cached individually. This build does not include a full offline copy of all 66 books.
- The 365-day schedule is a sequential reading allocation, not a devotional or thematic plan.
- The Sound does not yet contain commercial gospel tracks or recorded human narration. Those require artist/label permission or licensed sources.
- Ripple Room is a lightweight Canvas prototype, not the final advanced WebGL/3D water simulation.
- Community now has a local-only prototype for usernames, a demo friend directory, friend add/remove, posts, likes and comments. It is not a live multi-user service. Real public posting requires a secure backend, authentication, moderation, reporting, privacy and safeguarding features.
- Elo is still an offline reflection prototype, not a live LLM assistant.

## Local accounts and privacy
The current profile remains local-only. It is not secure authentication and does not provide email verification, cloud backup or cross-device sync. Mood entries and journal content remain in browser localStorage unless the user exports or clears them.

## Verification performed for this handoff

- JavaScript syntax checked with Node.js for all project scripts.
- All six HTML pages parsed successfully.
- The generated reading plan contains 365 days and 1,189 unique chapter references; every chapter from Genesis 1 through Revelation 22 appears exactly once.
- The uploaded prototype's original `scripts/prototype.js` was retained without edits.

## Day 11 — Revisit This Moment

The Journal page now includes a gentle **Revisit This Moment** experience. It selects a past mood check-in (preferring entries from earlier dates), shows the original mood, note, and triggers when available, and lets you save a new reflection linked to that moment. Saved revisit reflections are stored locally under `moodDeckV2Revisits` and displayed in the Journal page. No mood is framed as something the user should have "gotten over".


### Day 11 testing
- Save at least two mood check-ins on different dates (or test with existing entries).
- Open Journal and confirm Revisit This Moment shows an older check-in.
- Try another moment and confirm the displayed check-in changes when candidates are available.
- Write and save a revisit reflection; confirm it appears under saved revisit reflections after refresh.
- Test with an entry that has no note and with one that has triggers.
- Confirm older data is still present and unchanged.


## Day 14 — Welcome & personalization polish
- Refined profile setup copy to make the local, private nature of the space clearer.
- Added a small name-change hint and focus-visible states to profile setup controls.
- Clarified that optional email is not used to create an account in this prototype.
- Merged the updated The Word reader from the tested API-fix package while preserving the Day 11 Revisit This Moment feature.


## Day 16 update — Understanding Your Patterns
Insights now includes a gentle reflection based on the user's recent check-ins and a summary of recurring influences. The wording is descriptive rather than diagnostic. Existing local storage keys remain unchanged. See `DAY-16-README.txt` for the test checklist.


## Day 18 — Community preview and Bible reliability
- Added a local-only Community prototype with profile handles, sample discoverable accounts, friend add/remove, posts, likes, comments and post deletion.
- Added explicit UI and documentation that community data stays in this browser and is not shared across devices.
- Kept the tested KJV API endpoint and added a 15-second timeout plus clearer timeout/network error messages. Successfully loaded chapters continue to cache locally.
- See `DAY-18-README.txt` for limitations and a complete test checklist.
