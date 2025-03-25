"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./Button";

/**
 * Simple alert dialog implementation without Radix UI
 */

interface AlertDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface AlertDialogContextInterface {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlertDialogContext = React.createContext<AlertDialogContextInterface | undefined>(
  undefined
);

export function AlertDialog({
  children,
  open: controlledOpen,
  onOpenChange,
}: AlertDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }
      if (onOpenChange) {
        const newValue =
          typeof value === "function"
            ? value(isControlled ? controlledOpen : uncontrolledOpen)
            : value;
        onOpenChange(newValue);
      }
    },
    [isControlled, controlledOpen, uncontrolledOpen, onOpenChange]
  );

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = useAlertDialogContext();

  const handleClick = () => {
    context.setOpen(true);
  };

  return React.cloneElement(
    React.Children.only(children) as React.ReactElement,
    {
      onClick: handleClick,
    }
  );
}

export function AlertDialogContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = useAlertDialogContext();
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        context.setOpen(false);
      }
    };

    if (context.open) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when dialog is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [context.open, context]);

  if (!context.open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 sm:rounded-lg md:w-full",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}

export function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    />
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  // eslint-disable-next-line jsx-a11y/heading-has-content
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function AlertDialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function AlertDialogAction({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        buttonVariants.variant.default,
        buttonVariants.size.default,
        className
      )}
      {...props}
    />
  );
}

export function AlertDialogCancel({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = useAlertDialogContext();

  return (
    <button
      className={cn(
        buttonVariants.variant.outline,
        buttonVariants.size.default,
        "mt-2 sm:mt-0",
        className
      )}
      onClick={(e) => {
        props.onClick?.(e);
        context.setOpen(false);
      }}
      {...props}
    />
  );
}

function useAlertDialogContext() {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error(
      "AlertDialog components must be used within an AlertDialog"
    );
  }
  return context;
}
