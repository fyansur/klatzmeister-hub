import { Navbar, NavbarBrand, NavbarActions, NavbarContent } from "./components/ui/header"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LightRays } from "@/components/ui/light-rays"
import { KineticText } from "@/components/ui/kinetic-text"
import { useEffect, useState } from "react"
import { Particles } from "@/components/ui/particles"
import { useTheme } from "./components/ui/theme-provider"
import { useLanyard } from "use-lanyard"
import { Clock, ExternalLink, Loader2 } from "lucide-react"
import { ActivityCard } from "./components/ui/activity"
import { PlaylistTracks } from "./components/ui/playlist-tracks"
import { ProfileCard } from "@/components/ui/profile-card"

function App() {
  const PLAYLIST_ID = import.meta.env.VITE_SPOTIFY_PLAYLIST_ID;
  const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;
  const USER_ID = import.meta.env.VITE_DISCORD_USER_ID as `${bigint}`

  const { resolvedTheme } = useTheme()
  const [particleColor, setParticleColor] = useState("#ffffff")
  const [raysColor, setRaysColor] = useState("#ffffff")

  useEffect(() => {
    setParticleColor(resolvedTheme === "dark" ? "#ffffff" : "#000000")
    setRaysColor(resolvedTheme === "dark" ? "oklch(0.37 0.00 0)" : "oklch(0.72 0.00 0)")
  }, [resolvedTheme])

  const presence = useLanyard(USER_ID)
  const [isMinTimePassed, setIsMinTimePassed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimePassed(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const isLoading = !isMinTimePassed || !presence

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background dark:bg-stone-950 gap-4">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm font-medium tracking-widest text-muted-foreground animate-pulse uppercase">
          ./initializing
        </p>
      </div>
    )
  }

  const globalName = presence.discord_user?.global_name
  const visibleActivities = presence.activities?.filter((a) => a.type !== 4) ?? []

  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center space-y-6 dark:bg-stone-950">
        <Navbar className="fade-in animate-in duration-300">
          <NavbarContent>
            <NavbarBrand className="lowercase">./{globalName}</NavbarBrand>
            <NavbarActions>
              <ThemeToggle />
            </NavbarActions>
          </NavbarContent>
        </Navbar>

        <main className="flex xl:px-0 px-6 pb-6 w-full max-w-6xl flex-col items-center justify-center gap-6 flex-1 fade-in animate-in duration-300">
          <div className="grid xl:grid-cols-3 grid-cols-1 items-start xl:items-stretch justify-center gap-6 w-full h-full">

            {/* Col [ 1-2-3] : Banner */}
            <div className="xl:col-span-3 border rounded-xl flex-1 relative h-fit w-full items-center md:p-6 overflow-hidden">
              <LightRays color={raysColor} className="z-0" />
              <Particles color={particleColor} className="absolute inset-0 z-0" quantity={150} ease={100} refresh />
              <div className="relative z-10 grid grid-cols-2">
                <div className="col-span-2">
                  <span className="flex lg:py-0 py-6 text-5xl font-bold text-center justify-center z-99">
                    <KineticText text={`${globalName}`} />
                  </span>
                </div>
              </div>
            </div>

            {/* Col 4: Profile Card*/}
            <ProfileCard presence={presence} />

            { /* Col 5: Activity */}
            <div className="relative w-full flex-1 h-full">
              <div className="xl:absolute xl:inset-0 relative w-full h-full flex flex-col overflow-hidden rounded-xl border dark:bg-stone-250">
                <div className="flex flex-col h-full p-6">
                  <span className="flex items-center gap-1 pb-6 mb-6 shrink-0 text-sm text-muted-foreground uppercase tracking-widest justify-between border-b">
                    <p>ACTIVITY</p><Clock size="16" />
                  </span>
                  <div className={`flex-1 overflow-y-scroll scrollbar-none scroll-fade space-y-3 flex flex-col ${visibleActivities.length === 0 ? 'justify-center' : ''}`}>
                    {visibleActivities.length === 0 ? (
                      <span className="relative text-xs text-muted-foreground w-full text-center">No recent activity</span>
                    ) : (
                      visibleActivities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} kv={presence.kv} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            { /* Col 6: Playlist Tracks */}
            <div className="relative w-full flex-1 h-full">
              <div className="xl:absolute xl:inset-0 relative w-full h-64 xl:h-full flex flex-col overflow-hidden rounded-xl border dark:bg-stone-250">
                <div className="flex flex-col h-full p-6">
                  <span className="flex items-center gap-1 pb-6 mb-6 shrink-0 text-sm text-muted-foreground uppercase tracking-widest justify-between border-b">
                    <p><a href={SPOTIFY_PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">WHAT'S ON MY PLAYLIST <ExternalLink size="16" /></a></p><i className="bi bi-spotify" />
                  </span>
                  <div className="flex-1 overflow-y-scroll scrollbar-none scroll-fade space-y-6">
                    <PlaylistTracks />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}

export default App