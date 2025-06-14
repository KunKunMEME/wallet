import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/components/wallet-provider"
import { SidebarProvider } from "@/components/sidebar-provider"
import { Sidebar } from "@/components/sidebar"
import Init from './init'

// const inter = Inter({ subsets: ["latin"] })
//className={inter.className}
export const metadata: Metadata = {
  title: "KUNKUN Wallet",
  description: "Manage your KUNKUN tokens with ease",
    generator: 'kunkun.fyi'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        <Init />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <WalletProvider>
            <SidebarProvider>
              <div className="flex min-h-screen max-h-[725px]  overflow-hidden">
                <Sidebar />
                <main className="flex-1 p-4 overflow-y-auto">{children}</main>
              </div>
              <Toaster />
            </SidebarProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
