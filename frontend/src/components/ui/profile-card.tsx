import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { CopyUsernameButton } from "@/components/ui/copy-username-button"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Monitor } from "lucide-react"
import profile from "@/data/discord-profile.json"

export function ProfileCard({ presence }: { presence: any }) {
  const GITHUB_URL = import.meta.env.VITE_GITHUB_URL
  const SPOTIFY_URL = import.meta.env.VITE_SPOTIFY_URL
  const STEAM_URL = import.meta.env.VITE_STEAM_URL
  const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL

  const { discord_user, kv } = presence
  
  const statusColor = presence.discord_status === "online" ? "text-green-500" : presence.discord_status === "idle" ? "text-yellow-500" : presence.discord_status === "dnd" ? "text-red-500" : "text-gray-500"
  const statusText = presence.discord_status === "online" ? "ONLINE" : presence.discord_status === "idle" ? "IDLE" : presence.discord_status === "dnd" ? "DND" : "OFFLINE"

  const guildBadgeUrl = discord_user.primary_guild?.badge ? `https://cdn.discordapp.com/clan-badges/${discord_user.primary_guild.identity_guild_id}/${discord_user.primary_guild.badge}?size=16` : null
  const avatarUrl = discord_user.avatar ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=256${discord_user.avatar.startsWith("a_") ? "&animated=true" : ""}` : null
  const decorationUrl = discord_user.avatar_decoration_data?.sku_id ? `https://cdn.discordapp.com/media/v1/collectibles-shop/${discord_user.avatar_decoration_data.sku_id}/animated.webp` : null

  return (
    <div className="relative w-full flex-1 overflow-hidden rounded-xl border dark:bg-stone-950">
      <div className="h-32 w-full overflow-hidden grayscale brightness-70 z-0">
        <img src={profile.banner_url} alt="Banner" className="h-full w-full object-cover inset-shadow-md" />
      </div>
      <div className="z-0">
        {presence.active_on_discord_desktop && (
          <TooltipTrigger>
            <span className="absolute top-6 left-6 rounded-sm w-fit p-1 text-green-500 flex gap-3 text-xs items-center bg-background border dark:bg-stone-950"><Monitor size="20" /></span>
            <Tooltip>Active on Desktop</Tooltip>
          </TooltipTrigger>
        )}
        <span className={`absolute top-6 right-6 rounded-sm w-fit p-1 border bg-background dark:bg-stone-950 flex gap-1 text-xs items-center font-black ${statusColor} h-7.5`}>
          {statusText}
        </span>
      </div>

      <div className="absolute top-17 left-1/2 -translate-x-1/2">
        <div className="relative size-30">
          <img src={avatarUrl ?? undefined} alt="Avatar" className="size-30 rounded-full border-4 border-background dark:border-stone-950 duration-300 dark:bg-stone-950 object-cover" />
          {decorationUrl && <img src={decorationUrl} alt="" className="pointer-events-none absolute inset-0 size-30 scale-110" />}
        </div>
      </div>
      
      <div className="h-fit pb-6 pt-20 dark:bg-stone-950 px-6 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="leading-none text-2xl font-bold">{discord_user.global_name}</span>
          <CopyUsernameButton username={discord_user.username} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="leading-none text-sm text-muted-foreground font-semibold">{discord_user.username} ● him | 25</span>
          <span className="border rounded-sm w-fit px-1 py-0.5 text-muted-foreground flex gap-1 text-xs items-center font-black">
            <TooltipTrigger>
              <div className="flex gap-1 items-center">
                <img src={guildBadgeUrl ?? undefined} />
                {discord_user.primary_guild?.tag}
              </div>
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
            {/* social media  */}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full border rounded-md text-base px-3 dark:text-muted-foreground items-center dark:bg-stone-900 flex gap-2"><i className="bi bi-github"></i></Button>
          </a>
          <a href={SPOTIFY_URL} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full border rounded-md p-3 text-base dark:text-muted-foreground dark:bg-stone-900 flex items-center justify-center gap-2"><i className="bi bi-spotify"></i></Button>
          </a>
          <a href={STEAM_URL} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full border rounded-md p-3 text-base dark:text-muted-foreground dark:bg-stone-900 flex items-center justify-center gap-2"><i className="bi bi-steam"></i></Button>
          </a>
          <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full border rounded-md p-3 text-base dark:text-muted-foreground dark:bg-stone-900 flex items-center justify-center gap-2"><i className="bi bi-globe"></i></Button>
          </a>
        </div>
      </div>
    </div>
  )
}