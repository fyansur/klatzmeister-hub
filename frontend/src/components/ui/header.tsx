import * as React from "react"

import { cn } from "@/lib/utils"

function Navbar({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="navbar"
      className={cn(
        "sticky top-0 z-50 w-full dark:bg-stone-950 border-b dark:border-stone-800",
        className
      )}
      {...props}
    />
  )
}

function NavbarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-content"
      className={cn(
        "px-6 xl:px-0 mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4",
        className
      )}
      {...props}
    />
  )
}

function NavbarBrand({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-brand"
      className={cn("flex items-center gap-2 font-semibold dark:text-stone-100", className)}
      {...props}
    />
  )
}

function NavbarNav({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-nav"
      className={cn(
        "flex flex-1 items-center justify-center gap-6 text-sm text-muted-foreground *:transition-colors *:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function NavbarActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-actions"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  )
}

export { Navbar, NavbarContent, NavbarBrand, NavbarNav, NavbarActions }