"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Check } from "lucide-react";

// Create a single context for the entire dropdown
const DropdownContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  onValueChange?: (value: string) => void;
}>({
  open: false,
  setOpen: () => {},
  selectedValue: "",
  setSelectedValue: () => {},
});

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  return (
    <DropdownContext.Provider
      value={{
        open,
        setOpen,
        selectedValue,
        setSelectedValue,
        onValueChange: undefined,
      }}
    >
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const { open, setOpen } = React.useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      "aria-expanded": open,
      "aria-haspopup": true,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup="true"
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  className,
  align = "center",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const { open, setOpen } = React.useContext(DropdownContext);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "mt-1 top-full",
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuRadioGroup({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}) {
  const context = React.useContext(DropdownContext);

  // Update the context with the external value and onChange
  React.useEffect(() => {
    if (value !== undefined) {
      context.setSelectedValue(value);
    }
  }, [value, context]);

  // Create a new context with the provided onValueChange
  const contextValue = {
    ...context,
    selectedValue: value !== undefined ? value : context.selectedValue,
    onValueChange,
  };

  return (
    <DropdownContext.Provider value={contextValue}>
      <div role="radiogroup">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuRadioItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { selectedValue, setSelectedValue, onValueChange, setOpen } =
    React.useContext(DropdownContext);
  const isSelected = selectedValue === value;

  const handleClick = () => {
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(value);
    }
    setOpen(false);
  };

  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      role="radio"
      aria-checked={isSelected}
      onClick={handleClick}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected ? <Check className="h-4 w-4" /> : null}
      </span>
      {children}
    </button>
  );
}

export function DropdownMenuItem({
  className,
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
}) {
  const { setOpen } = React.useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    setOpen(false);
  };

  return (
    <button
      type="button"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />;
}
