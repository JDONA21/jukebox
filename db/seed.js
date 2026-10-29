import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

import { createTrack } from "#db/queries/tracks";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";

async function seed() {
  for (let i = 1; i <= 20; i++) {
    await createTrack(`Track ${i}`, 10000);
  }

  for (let i = 1; i <= 10; i++) {
    await createPlaylist(`Playlist ${i}`, "2608 bootcamp");

    for (let j = 1; j <= 20; j++) {
      await createPlaylistTrack(i, j);
    }
  }
}
