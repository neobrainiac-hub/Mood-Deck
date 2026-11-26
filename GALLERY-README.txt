MOOD DECK — THE GALLERY

The Gallery is a frontend-only, private memory collection.

WHAT IT DOES
- Adds a Gallery card to Explore.
- Lets users select multiple images and videos from their device.
- Allows an optional note/caption for each selected batch.
- Stores media blobs and metadata in the browser's IndexedDB database named moodDeckGallery.
- Displays a photo/video grid, filters, preview lightbox and delete action.
- Does not upload media to a server or connect to Supabase.

LOCAL STORAGE / PRIVACY
Gallery media is stored in the browser on the current device. It does not sync between devices or browsers. Clearing site data, browser storage, or uninstalling/resetting the browser may permanently remove saved media. Users should keep their own backups of important photos and videos.

LIMITS
- Photos: 20 MB maximum per file.
- Videos: 100 MB maximum per file.
- Supported formats depend on the browser and device. The picker accepts image/* and video/*.
- Browser storage quotas vary. If the device/browser is low on storage, saving can fail.

TESTING
1. Open the app and sign in to the local profile.
2. Open Explore and choose The Gallery.
3. Select one photo and one short video, add an optional note and save.
4. Confirm both appear in the collection.
5. Try All / Photos / Videos filters.
6. Open each memory, close the preview, then delete a test item.
7. Refresh the page and confirm remaining memories are still present.

No cloud storage, account sync, or server upload is implemented in this version.
