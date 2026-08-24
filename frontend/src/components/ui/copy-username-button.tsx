import { useState, useRef, useEffect } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

function CopyUsernameButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
  }

  const handleCopy = () => {
    // State di-set SEBELUM await, biar React Aria nangkep ini sebagai
    // hasil langsung dari interaksi klik (bukan microtask terpisah)
    clearTimers()
    setCopied(true)
    setIsOpen(true)

    navigator.clipboard.writeText(username)

    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      resetTimeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, 200)
    }, 1500)
  }

  // Kalau mouse beneran ninggalin area tombol, paksa tutup + reset,
  // apapun status timer yang masih jalan — ini yang benerin bug "nyangkut"
  const handleMouseLeave = () => {
    clearTimers()
    setIsOpen(false)
    resetTimeoutRef.current = setTimeout(() => {
      setCopied(false)
    }, 500)
  }

  useEffect(() => clearTimers, [])

  return (
    <div onMouseLeave={handleMouseLeave}>
      <TooltipTrigger isOpen={isOpen} onOpenChange={setIsOpen} delay={200}>
        <Button
          variant="link"
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-md p-1 transition-colors text-foreground/50 hover:text-foreground"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
        <Tooltip
          className={cn(
            "rounded-md px-2 py-1 text-xs bg-stone-800 text-white transition-colors duration-200",
            copied && "bg-emerald-500! text-white!"
          )}
        >
          {copied ? "Copied!" : "Copy Username"}
        </Tooltip>
      </TooltipTrigger>
    </div>
  )
}

export { CopyUsernameButton }