'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Pickaxe,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero,
  Gamepad2
} from 'lucide-react'
import { RiDiscordFill } from '@remixicon/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/components/wallet-provider'
import { useTranslation } from '@/hooks/use-translation'
import { useSidebar } from '@/components/sidebar-provider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useWalletStatus, useWalletStore } from '@/lib/store/walletStore'
import { DISCORD_INVITE_URL } from '@/lib/const'

export function Sidebar() {
  const pathname = usePathname()

  const walletStatus = useWalletStatus()
  const { t } = useTranslation()
  const walletStore = useWalletStore()
  const { isCollapsed, toggleSidebar, shouldShowSidebar } = useSidebar()
  const [delay, setDelay] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.IPC) {
      try {
        const { getDelay } = window.IPC

        function getOnDelay() {
          const delay = getDelay()
          setDelay(delay)
        }
        getOnDelay()
        setInterval(() => {
          getOnDelay()
        }, 3000)
      } catch (err) {
        console.error('init error:', err)
      }
    }
  }, [])

  const routes = [
    {
      name: t('home'),
      path: '/',
      icon: <Home className="h-5 w-5" />
    },
    {
      name: t('mining'),
      path: '/mining/',
      icon: <Pickaxe className="h-5 w-5" />
    },
    {
      name: t('referrals'),
      path: '/referrals/',
      icon: <Users className="h-5 w-5" />
    },
    {
      name: t('games'),
      path: '/games/',
      icon: <Gamepad2 className="h-5 w-5" />
    },
    {
      name: t('settings'),
      path: '/settings/',
      icon: <Settings className="h-5 w-5" />
    }
  ]

  const copyWalletAddress = () => {
    if (!walletStore.address) return
    navigator.clipboard.writeText(walletStore.address)
    toast({
      title: t('copied'),
      description: t('walletAddress') + ' ' + t('copied')
    })
  }

  const logout = () => {
    walletStatus.setIsLock(true)
  }

  // Don't render sidebar if not logged in or wallet not created
  if (walletStatus.isLock || !walletStore.address) {
    return null
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          'flex flex-col h-screen border-r border-yellow-300 dark:border-yellow-900/50 bg-gradient-to-b from-yellow-50 to-pink-50 dark:from-gray-900 dark:to-yellow-900/20 transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-48'
        )}
      >
        <div className="p-2 border-b border-yellow-300 dark:border-yellow-900/50 flex items-center justify-between">
          <div className={cn('flex items-center gap-2', isCollapsed && 'justify-center')}>
            <img src="/images/logo.png" alt="KUNKUN" className="w-10 h-10" />
            {!isCollapsed && <h1 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 truncate">KUNKUN</h1>}
          </div>
        </div>

        {!isCollapsed && (
          <div className="px-3 py-2 border-b border-yellow-300 dark:border-yellow-900/50">
            <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400 truncate flex items-center justify-between">
              <p>{t('userId')}</p>
              <Tooltip>
                <TooltipTrigger>
                  <RiDiscordFill
                    onClick={() => (window as any).nw?.Shell.openExternal(DISCORD_INVITE_URL)}
                    className={cn(
                      'h-5 w-5',
                      walletStore.discordId ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-600 line-through'
                    )}
                  />
                </TooltipTrigger>

                <TooltipContent>{walletStore.discordId ? t('discordBound') : t('discordUnbound')}</TooltipContent>
              </Tooltip>
            </div>
            <p
              className="text-xs text-yellow-700 dark:text-yellow-400 truncate cursor-pointer hover:underline"
              onClick={copyWalletAddress}
              title={t('copied')}
            >
              {walletStore.address}
            </p>
          </div>
        )}

        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-1">
            {routes.map((route) => (
              <li key={route.path}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={route.path}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'w-full h-10 justify-center text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/30',
                            pathname === route.path && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                          )}
                        >
                          {route.icon}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{route.name}</TooltipContent>
                  </Tooltip>
                ) : (
                  <Link href={route.path}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/30',
                        pathname === route.path && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                      )}
                    >
                      {route.icon}
                      <span className="ml-2">{route.name}</span>
                    </Button>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-2 border-b border-yellow-300 dark:border-yellow-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(() => {
              let SignalIcon = SignalHigh
              let color = '#22c55e' // green-500
              let bars = 3
              if (delay === 0) {
                SignalIcon = SignalZero
                color = '#ef4444' // red-500
                bars = 0
              } else if (delay > 0 && delay < 100) {
                SignalIcon = SignalHigh
                color = '#22c55e' // green-500
                bars = 3
              } else if (delay >= 100 && delay < 500) {
                SignalIcon = SignalMedium
                color = '#fbbf24' // amber-400
                bars = 2
              } else if (delay >= 500) {
                SignalIcon = SignalLow
                color = '#f59e42' // orange-400
                bars = 1
              }
              return (
                <div className="flex items-center">
                  <SignalIcon color={color} className="h-5 w-5" />
                  {!isCollapsed && (
                    <span className="ml-1 text-xs" style={{ color }}>
                      {delay === 0 ? '/' : `${delay}ms`}
                    </span>
                  )}
                </div>
              )
            })()}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30 p-1 h-auto"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="p-2 border-t border-yellow-300 dark:border-yellow-900/50">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={logout}
                  className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{t('logout')}</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
