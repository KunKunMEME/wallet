'use client'

import { useWalletStatus, useWalletStore } from '@/lib/store/walletStore'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export function GamesView() {
  const walletStore = useWalletStore()
  const walletStatus = useWalletStatus()
  const walletAddress = useWalletStore((state) => state.address)
  const walletKey = useWalletStore((state) => state.key)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 当地址或锁定状态变化时，重置加载状态
    setIsLoading(true)
    
    const myFrame = document.getElementById('myFrame')
    console.log('myFrame', myFrame)

    if (myFrame) {
      ;(window as any).SharedBus = {
        async onRpc(type: string, data: Record<string, any>) {
          try {
            console.log('next:', type, data)

            const res = await window.P2P.onPrc(type, data, walletKey)
            return res
          } catch (error) {
            throw error
          }
        }
      }
    }
  }, [walletStore.address, walletStatus.isLock, walletKey, setIsLoading])

  if (!walletStore.address || walletStatus.isLock) {
    return null
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isLoading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
            <div className="text-yellow-600 font-medium">游戏加载中...</div>
          </div>
        </div>
      )}
      <iframe 
        id="myFrame" 
        src="http://game.kunkun.fyi/index.html" 
        style={{ width: '100%', height: '100%', border: 'none' }} 
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}
