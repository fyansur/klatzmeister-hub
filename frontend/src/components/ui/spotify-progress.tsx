import { useEffect, useState } from "react"

function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function SpotifyProgress({ start, end }: { start: number; end: number }) {
    const [now, setNow] = useState(Date.now())

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])

    const total = end - start
    const elapsed = Math.min(Math.max(now - start, 0), total)
    const progress = (elapsed / total) * 100

    return (
        <div className="mt-2 w-full">
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full rounded-full bg-stone-100 transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="mt-3 flex justify-between text-xs text-background/50 dark:text-foreground/50">
                <span>{formatTime(elapsed)}</span>
                <span>{formatTime(total)}</span>
            </div>
        </div>
    )
}

export { SpotifyProgress }