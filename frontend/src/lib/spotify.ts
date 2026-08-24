const API_BASE = "http://127.0.0.1:5000/api/spotify";

export async function getPlaylistTracks() {
  const res = await fetch(`${API_BASE}/playlist-tracks`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Gagal fetch playlist tracks");
  return res.json();
}