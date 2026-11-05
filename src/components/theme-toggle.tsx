"use client"

import { RiMoonLine, RiSunLine } from "@remixicon/react"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"

const STORAGE_KEY = "lang-trending:theme"

/** The `<html>` class attribute is the single source of truth for the theme. */
function getDarkSnapshot(): boolean {
  return document.documentElement.classList.contains("dark")
}

function getServerSnapshot(): boolean {
  return false
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    getDarkSnapshot,
    getServerSnapshot
  )

  function toggle() {
    const next = !dark
    document.documentElement.classList.toggle("dark", next)
    document.documentElement.style.colorScheme = next ? "dark" : "light"
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light")
    } catch {
      // Private browsing / disabled storage — the toggle still works for the session.
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggle}
    >
      {dark ? <RiSunLine /> : <RiMoonLine />}
    </Button>
  )
}
