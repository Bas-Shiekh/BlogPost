"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

/**
 * Simple toast component
 */
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export function Toast({
  className,
  variant = "default",
  children,
  open: controlledOpen,
  onOpenChange,
  ...props
}: ToastProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(true)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(value)
    }
    onOpenChange?.(value)
  }

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all animate-in slide-in-from-right-full",
        variant === "destructive" && "border-destructive bg-destructive text-destructive-foreground",
        variant === "default" && "border bg-background text-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <button
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        onClick={() => setOpen(false)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

export function ToastTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm font-semibold", className)} {...props} />
}

export function ToastDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm opacity-90", className)} {...props} />
}

export function ToastViewport({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className,
      )}
      {...props}
    />
  )
}

