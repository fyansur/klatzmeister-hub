const API_BASE = `${import.meta.env.VITE_SPOTIFY_API_BASE_URL}`;

export async function getPlaylistTracks() {
  const res = await fetch(`${API_BASE}/playlist-tracks`, {
    credentials: "include",
  });
  
  if (!res.ok) throw new Error("Failed to fetch playlist tracks");
  return res.json();
}