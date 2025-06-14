'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useWallet } from '@/components/wallet-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { useWalletStatus, useWalletStore } from '@/lib/store/walletStore'
import { useToast } from '@/hooks/use-toast'

export function LoginForm() {
  const { isLoggedIn, login, isWalletCreated } = useWallet()
  const walletStore = useWalletStore()
  const walletStatus = useWalletStatus()
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const { toast } = useToast()

  // useEffect(() => {
  //   walletStatus.setIsLock(true)
  // }, [])
  const handleLogin = async (e: React.FormEvent) => {
    const { encPassword, getBalance } = window.P2P

    const passwordMD = encPassword(password)

    if (passwordMD === walletStore.password) {
      walletStatus.setIsLock(false)
    } else {
      toast({
        title: t('loginFailed'),
        description: t('incorrectPassword'),
        variant: 'destructive'
      })
    }
  }

  if (!walletStore.address || !walletStatus.isLock) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 dark:from-gray-900 dark:to-yellow-900/20">
      <Card className="w-full max-w-md border-2 border-yellow-400 bg-white dark:bg-gray-900">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/images/kunkun-full.png" alt="KUNKUN" className="w-24 h-24" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-yellow-600 dark:text-yellow-400">KUNKUN {t('wallet')}</CardTitle>
          <CardDescription className="text-center text-yellow-600/80 dark:text-yellow-500/80">{t('enterPasswordToLogin')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-yellow-700 dark:text-yellow-400">
                {t('walletPassword')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('enterYourPassword')}
                  className="pl-10 border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700"
              disabled={isLoading}
            >
              {isLoading ? t('loggingIn') : t('login')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
function setError(arg0: string) {
  throw new Error('Function not implemented.')
}
