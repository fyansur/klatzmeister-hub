import express from "express";
import querystring from "querystring";

const router = express.Router();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
const PLAYLIST_ID = process.env.SPOTIFY_PLAYLIST_ID;

const CACHE_INTERVAL_MS = 5 * 60 * 1000; // ganti di sini kalau mau ubah frekuensi sinkron

// --- Dipakai HANYA kalau refresh token expired/di-revoke dan perlu re-authorize manual ---
router.get("/login", (req, res) => {
  const scope = "playlist-read-private playlist-read-collaborative";
  const params = querystring.stringify({
    response_type: "code",
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: querystring.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await tokenResponse.json();
  // Kalau route ini kepakai lagi, copy manual refresh_token baru ke .env
  res.json(data);
});

// --- Playlist cache ---
let cachedAccessToken = null;
let tokenExpiresAt = 0;

let cachedPlaylist = null;
let cacheUpdatedAt = null;

async function getAccessToken() {
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedAccessToken;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  const data = await response.json();
  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  return cachedAccessToken;
}

async function refreshPlaylistCache() {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(
      `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/items`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    cachedPlaylist = await result.json();
    cacheUpdatedAt = new Date();

    console.log(`Playlist cache updated at ${cacheUpdatedAt.toLocaleTimeString()}`);
  } catch (err) {
    console.error("Gagal update playlist cache:", err);
  }
}

refreshPlaylistCache();
setInterval(refreshPlaylistCache, CACHE_INTERVAL_MS);

router.get("/playlist-tracks", (req, res) => {
  if (!cachedPlaylist) {
    return res.status(503).json({ error: "Cache belum siap, coba lagi sebentar" });
  }

  res.json({ updatedAt: cacheUpdatedAt, data: cachedPlaylist });
});

export default router;