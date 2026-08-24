import { useEffect, useState } from "react";
import { getPlaylistTracks } from "@/lib/spotify";

interface Track {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string }[];
  external_urls: { spotify: string };
}

export function PlaylistTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPlaylistTracks()
      .then((res) => {
        const items = res.data.items ?? [];
        const mapped = items.map((entry: any) => entry.item).filter(Boolean);
        setTracks(mapped);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (error) {
    return <p className="text-sm text-muted-foreground">Failed to load playlist.</p>;
  }

  return (
    <div className="space-y-3 w-full">
        {tracks.map((track) => (
          <div key={track.id}>
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity justify-between"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate text-foreground/50">{track.name}</span>
                <span className="text-xs text-muted-foreground/50 truncate">
                  {track.artists.map((a) => a.name).join(", ")}
                </span>
              </div>
              <img
                src={track.album.images[2]?.url ?? track.album.images[0]?.url}
                alt={track.name}
                className="size-10 rounded-md object-cover"
              />
            </a>
          </div>
        ))}
    </div>
  );
}