import { useState, useEffect } from "react"
import vscodeIcon from "@/assets/visual-studio-code-icons/vscode.svg"
import fallbackBackground from "@/assets/fallback_background.jpg"
import { SpotifyProgress } from "./spotify-progress"


const VSCODE_APP_NAME = "Visual Studio Code"
const VSCODE_STATUS_LABEL = "WORKING ON"

interface Activity {
    id: string
    name: string
    type: number
    details?: string
    state?: string
    timestamps?: { start?: number; end?: number }
    assets?: {
        large_image?: string
        large_text?: string
        small_image?: string
        small_text?: string
    }
    application_id?: string
    kv?: Record<string, string>
}
interface ActivityCardProps {
    activity: Activity
    kv?: Record<string, string>
}

const ACTIVITY_TYPE_LABEL: Record<number, string> = {
    0: "Playing",
    1: "Streaming",
    2: "Listening to",
    3: "Watching",
    4: "Custom Status",
    5: "Competing in",
}

function getAssetUrl(assetKey: string | undefined, applicationId: string | undefined) {
    if (!assetKey) return null

    if (assetKey.startsWith("spotify:")) {
        const imageId = assetKey.split(":")[1]
        return `https://i.scdn.co/image/${imageId}`
    }

    if (assetKey.startsWith("mp:")) {
        return `https://media.discordapp.net/${assetKey.slice(3)}`
    }

    if (applicationId) {
        return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetKey}.png`
    }

    return null
}

function formatElapsed(start?: number) {
    if (!start) return null
    const diff = Date.now() - start

    const totalSeconds = Math.floor(diff / 1000)
    const seconds = totalSeconds % 60
    const minutes = Math.floor(totalSeconds / 60) % 60
    const hours = Math.floor(totalSeconds / 3600)

    const pad = (n: number) => n.toString().padStart(2, "0")

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    }
    return `${pad(minutes)}:${pad(seconds)}`
}

function ActivityCard({ activity, kv }: ActivityCardProps) {
    const [, setTick] = useState(0)

    useEffect(() => {
        if (!activity.timestamps?.start) return

        const interval = setInterval(() => {
            setTick((prev) => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [activity.timestamps?.start])

    const imageUrl = getAssetUrl(activity.assets?.large_image, activity.application_id)
    const label = ACTIVITY_TYPE_LABEL[activity.type] ?? "Doing"
    
    const isVSCode = activity.name === VSCODE_APP_NAME

    return (
        <>
            <div className="relative flex flex-col items-center gap-3 rounded-lg border dark:bg-stone-950 overflow-hidden">
                {(imageUrl || fallbackBackground) && (
                    <div
                        className="z-0 absolute inset-0 bg-cover bg-center scale-110 blur-xs brightness-50 dark:brightness-30"
                        style={{
                            backgroundImage: `url(${imageUrl || fallbackBackground})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                )}
                <div className="w-full h-full rounded-lg z-10 p-3 space-y-3 text-foreground">
                    <div className="flex flex-row items-center justify-between gap-3 w-full">
                        <div className="truncate space-y-1 flex-1">
                            {isVSCode ? (
                                <div className="text-[10px] flex flex-col font-medium text-background/50 dark:text-foreground/50">
                                    <span className="uppercase font-light tracking-widest">{VSCODE_STATUS_LABEL}</span>
                                </div>
                            ) : (
                                <div className="text-[10px] flex flex-col font-medium text-background/50 dark:text-foreground/50">
                                    <span className="uppercase font-light tracking-widest">{label}&nbsp;{activity.name}</span>
                                </div>
                            )}

                            {isVSCode ? (
                                <p className="truncate text-sm font-semibold text-background dark:text-foreground">
                                    {kv?.currentproject}
                                </p>
                            ) : (
                                <>
                                    {activity.details && (
                                        <p className="truncate text-sm font-semibold text-background dark:text-foreground">
                                            {activity.details}
                                        </p>
                                    )}
                                </>
                            )}

                            {activity.state && (
                                <p className="truncate text-xs text-background/50 dark:text-foreground/50">{activity.state}</p>
                            )}

                            {activity.type !== 2 && activity.timestamps?.start && (
                                <p className="text-xs text-background/50 dark:text-foreground/50">
                                    {formatElapsed(activity.timestamps.start)}
                                </p>
                            )}
                        </div>

                        <div className="self-start shrink-0 bg-background dark:bg-foreground ">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={activity.assets?.large_text ?? activity.name}
                                    className="size-16 object-cover"
                                />
                            ) : isVSCode ? (
                                <div className="flex size-16 items-center justify-center">
                                    <img
                                        src={vscodeIcon}
                                        alt={activity.assets?.large_text ?? activity.name}
                                        className="size-10 object-cover"
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {activity.name === "Spotify" && activity.timestamps?.start && activity.timestamps?.end && (
                        <div className="w-full">
                            <SpotifyProgress
                                start={activity.timestamps.start}
                                end={activity.timestamps.end} />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export { ActivityCard }
export type { Activity }