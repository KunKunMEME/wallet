'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    IPC: IPC
    P2P: P2P
  }
}

export default function WalletInit() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.require) {
      try {
        const path = window.require('path')
        const fs = window.require('fs')
        let ipcInit, p2pInit

        const fileName = 'kunkunWallet.js'
        if (fs.existsSync(path.join(process.cwd(), 'dist', fileName))) {
          const { ipcInit: ipcInit1, p2pInit: p2pInit1 } = window.require(path.join(process.cwd(), 'dist', fileName))
          ipcInit = ipcInit1
          p2pInit = p2pInit1
        } else if (fs.existsSync(path.join(process.cwd(), fileName))) {
          const { ipcInit: ipcInit1, p2pInit: p2pInit1 } = window.require(path.join(process.cwd(), fileName))
          ipcInit = ipcInit1
          p2pInit = p2pInit1
        } else if (fs.existsSync(path.join(process.cwd(), 'app', fileName))) {
          const { ipcInit: ipcInit1, p2pInit: p2pInit1 } = window.require(path.join(process.cwd(), 'app', fileName))
          ipcInit = ipcInit1
          p2pInit = p2pInit1
        }

        window.IPC = ipcInit()
        window.P2P = p2pInit()
        console.log(window.IPC, window.P2P)
      } catch (err) {
        console.error('init error:', err)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.nw) {
      // window.addEventListener('keydown', (e) => {
      //   if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      //     console.log('🔄 Reloading NW.js window...')
      //     window.nw.Window.get().reload()
      //   }
      // })
    }
  }, [])

  return null
}
