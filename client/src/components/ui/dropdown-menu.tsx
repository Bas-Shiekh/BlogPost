"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"

/**
 * Simple dropdown menu implementation without Radix UI
 */

interface DropdownMenuProps {
  children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative inline-block text-left">{children}</div>
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

export function DropdownMenuTrigger({ children, asChild = false }: DropdownMenuTriggerProps) {
  const context = useDropdownContext()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    context.setOpen(!context.open)
  }

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
      "aria-expanded": context.open,
      "aria-haspopup": true,
    })
  }

  return (
    <button onClick={handleClick} aria-expanded={context.open} aria-haspopup={true}>
      {children}
    </button>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  align?: "start" | "end" | "center"
  forceMount?: boolean
}

export function DropdownMenuContent({
  children,
  className,
  align = "center",
  forceMount = false,
}: DropdownMenuContentProps) {
  const context = useDropdownContext()
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        context.setOpen(false)
      }
    }

    if (context.open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [context.open, context])

  if (!context.open && !forceMount) {
    return null
  }

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80",
        "mt-1 top-full",
        alignClasses[align],
        className,
      )}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean
}

export function DropdownMenuItem({ className, children, inset, onClick, ...props }: DropdownMenuItemProps) {
  const context = useDropdownContext()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    context.setOpen(false)
  }

  return (
    <button
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
}

// Context for dropdown state
interface DropdownContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined)

// Provider component
export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return <DropdownContext.Provider value={{ open, setOpen }}>{children}</DropdownContext.Provider>
}

// Custom hook to use dropdown context
function useDropdownContext() {
  const context = React.useContext(DropdownContext)
  if (context === undefined) {
    throw new Error("useDropdownContext must be used within a DropdownProvider")
  }
  return context
}

// Wrap DropdownMenu with provider
const OriginalDropdownMenu = DropdownMenu
export { OriginalDropdownMenu as DropdownMenuRoot }

function DropdownMenuWithProvider({ children }: DropdownMenuProps) {
  return (
    <DropdownProvider>
      <OriginalDropdownMenu>{children}</OriginalDropdownMenu>
    </DropdownProvider>
  )
}

