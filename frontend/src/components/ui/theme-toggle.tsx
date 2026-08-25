import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ui/theme-provider"
import { Button } from "./button"
import { useState, useRef } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ThemeToggle({ className, ...props }: React.ComponentProps<typeof Button>) {
    const { theme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    
    const hasWarned = useRef(false)

    return (
        <AlertDialogTrigger
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (open && theme === "light") {
                    setTheme("dark")
                    return
                }
                if (open && theme === "dark" && hasWarned.current) {
                    setTheme("light")
                    return
                }
                setIsOpen(open)
            }}
        >
            <Button
                variant="outline"
                size="icon"
                className={className}
                {...props}
            >
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 transition-transform dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 transition-transform dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
            <AlertDialog>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Flashbang!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Please make sure to look away from the screen before proceeding.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            setTheme("light")
                            hasWarned.current = true
                            setIsOpen(false)
                        }}
                    >
                        Proceed
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialog>
        </AlertDialogTrigger>
    )
}