"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cva, type VariantsProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

const SidebarContext = React.createContext(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}

const SidebarProvider = React.forwardRef(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: onOpenChangeProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openState, setOpenState] = React.useState(defaultOpen)
    const open = openProp ?? openState
    const onOpenChange = onOpenChangeProp ?? setOpenState

    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          onOpenChange(false)
        }
      }

      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }, [onOpenChange])

    const state = React.useMemo(
      () => ({
        open,
        onOpenChange,
        isMobile,
        openMobile: open && isMobile,
        setOpenMobile: (value) => {
          onOpenChange(value)
        },
      }),
      [open, onOpenChange, isMobile]
    )

    return (
      <SidebarContext.Provider value={state}>
        <div
          style={style}
          className={cn(
            "flex h-full w-full flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}>
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef(
  ({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
    const { openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className)}
          ref={ref}
          {...props}>
          {children}
        </div>
      )
    }

    return (
      <>
        <div
          onClick={() => setOpenMobile(false)}
          className={cn(
            "fixed inset-0 z-40 bg-sidebar-accent/80 transition-opacity duration-300 lg:hidden",
            openMobile ? "opacity-100" : "pointer-events-none opacity-0"
          )} />
        <div
          ref={ref}
          data-state={openMobile ? "open" : "closed"}
          data-collapsible={collapsible}
          className={cn(
            "fixed inset-y-0 z-50 h-full w-[--sidebar-width] border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out lg:relative lg:z-auto",
            side === "right" && "right-0",
            openMobile ? "translate-x-0" : side === "right" ? "translate-x-full" : "-translate-x-full",
            className
          )}
          {...props}>
          {children}
        </div>
      </>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { openMobile, setOpenMobile } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="trigger"
      onClick={(event) => {
        onClick?.(event)
        setOpenMobile(!openMobile)
      }}
      className={cn("inline-flex items-center justify-center rounded-md text-foreground [&>svg]:size-6", className)}
      {...props}
    />
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef(({ className }, ref) => (
  <button
    ref={ref}
    data-sidebar="rail"
    aria-label="Toggle Sidebar"
    onClick={() => {
      // Handle rail toggle
    }}
    className={cn(
      "absolute inset-y-0 z-20 hidden w-4 translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-2 after:left-1/2 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-foreground after:opacity-0 hover:after:opacity-100 focus-visible:after:opacity-100 focus-visible:outline-none lg:flex",
      className
    )}
  />
))
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef(({ className, ...props }, ref) => (
  <main
    ref={ref}
    className={cn(
      "relative flex min-h-svh flex-1 flex-col bg-background",
      className
    )}
    {...props}
  />
))
SidebarInset.displayName = "SidebarInset"

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="content"
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-4 overflow-auto group-[[data-collapsible=icon]]/sidebar:-mx-2 [&>*]:px-4 [&>*]:group-[[data-collapsible=icon]]/sidebar:px-2",
      className
    )}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="header"
    className={cn("flex flex-col gap-2 overflow-hidden px-4 py-4 group-[[data-collapsible=icon]]/sidebar:px-2", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="footer"
    className={cn("flex flex-col gap-2 border-t bg-sidebar p-4 group-[[data-collapsible=icon]]/sidebar:border-none group-[[data-collapsible=icon]]/sidebar:bg-inherit group-[[data-collapsible=icon]]/sidebar:px-2", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="separator"
    className={cn("mx-2 my-2 h-px bg-sidebar-border group-[[data-collapsible=icon]]/sidebar:hidden", className)}
    {...props}
  />
))
SidebarSeparator.displayName = "SidebarSeparator"

export interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {}

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-sub][data-state=open]]/menu-item:bg-sidebar-accent group-has-[[data-sidebar=menu-sub][data-state=open]]/menu-item:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      isActive: {
        true: "bg-sidebar-accent text-sidebar-accent-foreground",
        false: "",
      },
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "border border-sidebar-border bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:border-sidebar-accent",
      },
      size: {
        default: "h-8",
        sm: "h-7 text-xs",
        lg: "h-12 text-base group-data-[collapsible=icon]/sidebar:!p-0 group-data-[collapsible=icon]/sidebar:!w-8 group-data-[collapsible=icon]/sidebar:!h-8",
      },
    },
    compoundVariants: [
      {
        isActive: true,
        variant: "outline",
        className: "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-accent",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? React.Fragment : "button"
    const compProps = asChild
      ? {}
      : {
          "data-sidebar": "menu-button",
          type: "button" as const,
          ...props,
        }

    const button = (
      <Comp
        ref={ref}
        className={cn(sidebarMenuButtonVariants({ isActive, variant, size }), className)}
        {...compProps}
      />
    )

    if (!tooltip) {
      return button
    }

    return <div title={tooltip}>{button}</div>
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "border-l border-sidebar-border px-2 py-0.5 group-[[data-collapsible=icon]]/sidebar:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => (
  <li ref={ref} {...props} />
))
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef(
  ({ asChild = false, size = "sm", isActive, className, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"

    return (
      <Comp
        ref={ref}
        data-sidebar="menu-sub-button"
        className={cn(
          sidebarMenuButtonVariants({ isActive, variant: "default", size }),
          "h-7 w-full px-2",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  sidebarMenuButtonVariants,
}
