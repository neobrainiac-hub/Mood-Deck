MOOD DECK — DAY 18 UPDATE
Community preview, experience polish and KJV reader reliability

WHAT'S INCLUDED
- A redesigned Community page with a local username/handle, a small local demo directory, friend add/remove, post creation, likes, comments and deleting your own posts.
- Clear prototype notice and community safety guidance.
- The existing KJV reader remains integrated. Successfully loaded chapters are cached on this device. A request timeout and clearer connection messages have been added.
- Existing Mood Deck pages, scripts, assets, storage keys and reading-plan data are retained.

IMPORTANT COMMUNITY LIMITATION
This is a front-end prototype only. Usernames, friends, posts, likes and comments are stored in this browser's localStorage. The demo directory contains sample accounts so the interactions can be tested. It is NOT a real multi-user social network: other people on different devices cannot find the account, see posts, receive friend requests or interact with this feed.

A REAL COMMUNITY RELEASE REQUIRES
- A secure backend and database.
- Real authentication and verified account identity.
- Server-side username uniqueness and friend requests.
- Cloud-hosted posts, comments and media storage.
- Blocking, reporting, moderation queues, rate limits and community rules.
- Privacy, age-appropriate safeguards, account deletion and data export.
Do not treat localStorage profiles as secure authentication or publish sensitive information in this prototype.

BIBLE API
The Word keeps the KJV endpoint already used by the tested project: https://api.getbible.net/v3/kjv/{bookId}/{chapter}.json
A first-time chapter load requires internet access. Successfully loaded chapters are cached in localStorage for later use on the same browser/device. This project does not bundle the entire Bible database offline. This package adds a 15-second request timeout and clearer error feedback; it does not replace the working API endpoint.

TEST CHECKLIST
1. Run index.html through VS Code Live Server.
2. Open Community. Save a username (3–20 letters, numbers or underscores).
3. Search and add @hopefulheart, @quietgrowth or @faithinprogress; remove a friend again.
4. Create a post, like it, open comments, add a comment, then delete your own post.
5. Refresh and confirm your username, friends and posts remain in this browser.
6. Open The Word. Load a chapter not previously opened, then navigate to another chapter.
7. Disconnect internet and reopen a chapter already cached; it should still load. A chapter never cached requires internet.
8. Check the home app navigation links to Community and The Word.

PRIVACY
This is a local prototype. Community data is not uploaded to a server. Clearing this browser's site data can erase it. Do not use real sensitive personal information.
