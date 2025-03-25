import type React from "react"
import Header from "./Header"

/**
 * Layout component for consistent page structure
 */
interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
      <footer className="py-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Blog App
        </div>
      </footer>
    </div>
  )
}

