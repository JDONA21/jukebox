import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";

// sends array of all play lists
router.get("/", async (req, res) => {
  const playlists = await getPlaylists();
  res.send(playlists);
});

// creates a new empty playlist
router.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");

  const { name, description } = req.body;
  if (!name || !description)
    return res.status(400).send("Request body requires: name, description");

  const playlist = await createPlaylist(name, description);
  res.status(201).send(playlist);
});

// finds playlist, if it exists, and makes it available to every route that uses:id
router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

// sends a playlists specified by id
router.get("/:id", (req, res) => {
  res.send(req.playlist);
});

// sends all tracks in the playlists
router.get("/:id/tracks", async (req, res) => {
  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.send(tracks);
});
// adds a new track to the playlists
router.post("/:id/tracks", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");

  const { trackId } = req.body;
  if (!trackId) return res.status(400).send("Request body requires: trackId");

  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});
