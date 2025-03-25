import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

/**
 * Theme types
 */
type ThemeType = "light" | "dark" | "system"

/**
 * Get initial theme from localStorage or default to system
 */
const getInitialTheme = (): ThemeType => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("blog-theme") as ThemeType | null
    return storedTheme || "system"
  }
  return "system"
}

/**
 * Apply theme to document
 */
const applyTheme = (theme: ThemeType) => {
  const root = window.document.documentElement
  root.classList.remove("light", "dark")

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    root.classList.add(systemTheme)
    return
  }

  root.classList.add(theme)
}

/**
 * Theme slice for Redux
 */
const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: getInitialTheme(),
  },
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload
      localStorage.setItem("blog-theme", action.payload)
      applyTheme(action.payload)
    },
  },
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer

