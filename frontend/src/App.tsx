import { Navbar, NavbarBrand, NavbarActions, NavbarContent } from "./components/ui/header"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LightRays } from "@/components/ui/light-rays"
import { KineticText } from "@/components/ui/kinetic-text"
import { useEffect, useState } from "react"
import { Particles } from "@/components/ui/particles"
import { useTheme } from "./components/ui/theme-provider"
import { useLanyard } from "use-lanyard"
import profile from "@/data/discord-profile.json"
import { Clock, ExternalLink, Monitor } from "lucide-react"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { CopyUsernameButton } from "@/components/ui/copy-username-button"
import { Separator } from "./components/ui/separator"
import { Button } from "./components/ui/button"
import { ActivityCard } from "./components/ui/activity"
import { PlaylistTracks } from "./components/ui/playlist-tracks"

function App() {

  const GITHUB_URL = import.meta.env.VITE_GITHUB_URL
  const SPOTIFY_URL = import.meta.env.VITE_SPOTIFY_URL
  const STEAM_URL = import.meta.env.VITE_STEAM_URL
  const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL
  const PLAYLIST_ID = import.meta.env.VITE_SPOTIFY_PLAYLIST_ID;
  const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;
  const USER_ID = import.meta.env.VITE_DISCORD_USER_ID as `${bigint}`

  const { resolvedTheme } = useTheme()

  const [particleColor, setParticleColor] = useState("#ffffff")
  useEffect(() => {
    setParticleColor(resolvedTheme === "dark" ? "#ffffff" : "#000000")
  }, [resolvedTheme])

  const [raysColor, setRaysColor] = useState("#ffffff")
  useEffect(() => {
    setRaysColor(resolvedTheme === "dark" ? "oklch(0.37 0.00 0)" : "oklch(0.72 0.00 0)")
  }, [resolvedTheme])

  const presence = useLanyard(USER_ID)

  if (!presence) {
    return <p className="text-white/50">Loading...</p>
  }

  const { discord_user, kv, activities } = presence

  // Discord Status
  const statusColor = presence.discord_status === "online" ? "text-green-500" : presence.discord_status === "idle" ? "text-yellow-500" : presence.discord_status === "dnd" ? "text-red-500" : "text-gray-500"
  const statusText = presence.discord_status === "online" ? "ONLINE" : presence.discord_status === "idle" ? "IDLE" : presence.discord_status === "dnd" ? "DND" : "OFFLINE"


  // Discord CDN URLs
  const guildBadgeUrl = discord_user.primary_guild?.badge ? `https://cdn.discordapp.com/clan-badges/${discord_user.primary_guild.identity_guild_id}/${discord_user.primary_guild.badge}?size=16` : null

  const avatarUrl = discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=256${discord_user.avatar.startsWith("a_") ? "&animated=true" : ""
    }`
    : null

  const decorationUrl = discord_user.avatar_decoration_data?.sku_id
    ? `https://cdn.discordapp.com/media/v1/collectibles-shop/${discord_user.avatar_decoration_data.sku_id}/animated.webp`
    : null


  const visibleActivities = activities?.filter((a) => a.type !== 4) ?? []

  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center space-y-6 dark:bg-stone-950">
        <Navbar>
          <NavbarContent>
            <NavbarBrand className="lowercase">./{discord_user.global_name}</NavbarBrand>
            <NavbarActions>
              <ThemeToggle />
            </NavbarActions>
          </NavbarContent>
        </Navbar>
        <main className="flex xl:px-0 px-6 pb-6 w-full max-w-6xl flex-col items-center justify-center gap-6 flex-1">
          {/* Main Wrapper */}
          <div className="grid xl:grid-cols-3 grid-cols-1 items-start xl:items-stretch justify-center gap-6 w-full h-full">

            {/* Col [ 1-2-3] : Banner */}
            <div className="xl:col-span-3 border rounded-xl flex-1 relative h-fit w-full items-center md:p-6 overflow-hidden">
              <LightRays
                color={raysColor} className="z-0" />
              <Particles
                color={particleColor}
                className="absolute inset-0 z-0"
                quantity={150}
                ease={100}
                refresh
              />
              <div className="relative z-10 grid grid-cols-2">
                <div className="col-span-2">
                  <span className="flex lg:py-0 py-6 text-5xl font-bold text-center justify-center z-99">
                    <KineticText text={`${discord_user.global_name}`} /></span>
                </div>
              </div>
            </div>

            {/* Col 4: Profile Card + Activity + Playlist Tracks */}
            <div className="relative w-full flex-1 overflow-hidden rounded-xl border dark:bg-stone-950">

              {/* Profile Card */}
              <div className="h-32 w-full overflow-hidden grayscale brightness-70 z-0">
                <img src={profile.banner_url} alt="Banner" className="h-full w-full object-cover inset-shadow-md" />
              </div>
              <div className="z-0">
                {presence.active_on_discord_desktop && (
                  <TooltipTrigger>
                    <span className="absolute top-6 left-6 rounded-sm w-fit p-1 text-green-500 flex gap-3 text-xs items-center bg-background border dark:bg-stone-950 "><Monitor size="20" /></span>
                    <Tooltip>Active on Desktop</Tooltip>
                  </TooltipTrigger>
                )}

                <span className={`absolute top-6 right-6 rounded-sm w-fit p-1 border bg-background dark:bg-stone-950 flex gap-1 text-xs items-center font-black ${statusColor} h-7.5`}>
                  {statusText}
                </span>
              </div>

              {/* Avatar + decoration + status, overlap ke banner */}
              <div className="absolute top-17 left-1/2 -translate-x-1/2  transition-transform duration-300">
                <div className="relative size-30">
                  <img
                    src={avatarUrl ?? undefined}
                    alt="Avatar"
                    className="size-30 rounded-full border-4 border-background dark:border-stone-950  duration-300 dark:bg-stone-950 object-cover"
                  />

                  {decorationUrl && (
                    <img
                      src={decorationUrl}
                      alt=""
                      className="pointer-events-none absolute inset-0 size-30 scale-110"
                    />
                  )}
                </div>
              </div>
              {/* Body content */}
              <div
                className="h-fit pb-6 pt-20 dark:bg-stone-950 px-6 space-y-1.5"
              >
                <div className="flex items-center gap-1.5">
                  <span className="leading-none text-2xl font-bold">{discord_user.global_name}</span>
                  <CopyUsernameButton username={discord_user.username} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="leading-none text-sm text-muted-foreground font-semibold">{discord_user.username} ● him | 25</span>
                  <span className="border rounded-sm w-fit px-1 py-0.5 text-muted-foreground flex gap-1 text-xs items-center font-black">
                    <TooltipTrigger>
                      <div className="flex gap-1 items-center">
                        <img src={guildBadgeUrl ?? undefined}></img>
                        {discord_user.primary_guild?.tag}</div>
                      <Tooltip>{discord_user.primary_guild?.tag}</Tooltip>
                    </TooltipTrigger>
                  </span>
                </div>
                <Separator className="my-3" />
                <div className="text-sm text-muted-foreground dark:bg-stone-900 p-3 border rounded-md">
                  {kv.about}
                </div>
                <Separator className="my-3" />
                <div className="grid grid-cols-4 gap-3">
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full border rounded-md text-base px-3 dark:text-muted-foreground items-center dark:bg-stone-900 flex gap-2">
                      <i className="bi bi-github"></i>
                    </Button>
                  </a>
                  <a href={SPOTIFY_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full border rounded-md p-3 text-base dark:text-muted-foreground dark:bg-stone-900 flex items-center justify-center gap-2">
                      <i className="bi bi-spotify"></i>
                    </Button>
                  </a>
                  <a href={STEAM_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full border rounded-md p-3 text-base dark:text-muted-foreground dark:bg-stone-900 flex items-center justify-center gap-2">
                      <i className="bi bi-steam"></i>
                    </Button>
                  </a>
                  <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full border rounded-md p-3 text-base dark:text-muted-foreground dark:bg-stone-900 flex items-center justify-center gap-2">
                      <i className="bi bi-globe"></i>
                    </Button>
                  </a>
                </div>
              </div>
            </div>

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
                      visibleActivities.length > 0 && visibleActivities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} kv={kv} />
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
          {/* Row 2: */}
          {/* <div className="grid xl:grid-cols-3 grid-cols-1 items-start justify-center gap-6 w-full flex-1">

            <div className="xl:col-span-2 border rounded-xl relative h-full w-full items-center md:p-6 overflow-hidden">
            </div>
            <div className="xl:col-span-1 relative h-full w-full items-center overflow-hidden flex flex-col gap-6 flex-1">
              <div className="xl:col-span-1 border rounded-xl relative h-fit w-full items-center md:p-8 overflow-hidden flex flex-col flex-3">
                test
              </div>
              <div className="xl:col-span-1 border rounded-xl relative h-full w-full items-center md:p-8 overflow-hidden flex flex-col flex-1">
                test
              </div>
            </div>
          </div> */}
        </main>
      </div>
    </>
  )
}

export default App
