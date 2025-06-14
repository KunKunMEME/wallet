"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useWallet } from "@/components/wallet-provider"

type SidebarContextType = {
  isCollapsed: boolean
  toggleSidebar: () => void
  shouldShowSidebar: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isWalletCreated } = useWallet()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState) {
      setIsCollapsed(savedState === "true")
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  // Only show sidebar if user is logged in and wallet is created
  const shouldShowSidebar = isLoggedIn && isWalletCreated

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, shouldShowSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
