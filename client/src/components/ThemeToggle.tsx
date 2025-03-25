"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store"
import { setTheme } from "../store/slices/themeSlice"
import { Button } from "./ui/Button"
import { Moon, Sun } from "lucide-react"

/**
 * Theme toggle component
 */
export default function ThemeToggle() {
  const dispatch = useDispatch()
  const { theme } = useSelector((state: RootState) => state.theme)

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    dispatch(setTheme(newTheme))
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

