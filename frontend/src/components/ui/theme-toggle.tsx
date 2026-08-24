// src/components/theme-toggle.tsx
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

export function ThemeToggle({ className, ...props }: React.ComponentProps<"button">) {
    const { theme, setTheme } = useTheme()

    return (
        <button
            type="button"
            data-slot="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "size-9",
                className
            )}
            {...props}
        >
            <Sun className="size-4 scale-100 transition-transform dark:scale-0" />
            <Moon className="absolute size-4 scale-0 transition-transform dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}