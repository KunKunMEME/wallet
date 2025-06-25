'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useWallet } from '@/components/wallet-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Gift, WifiOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/hooks/use-translation'
import { useWalletStatus, useWalletStore } from '@/lib/store/walletStore'

export function CreateWallet() {
  const { createWallet, isWalletCreated } = useWallet()
  const walletStore = useWalletStore()
  const walletStatus = useWalletStatus()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState('')
  const { toast } = useToast()
  const { t } = useTranslation()
  const [createLoading, setCreateLoading] = useState(false)
  const [p2pDelay, setP2pDelay] = useState(0)

  useEffect(() => {
    getP2pDelay()
    const interval = setInterval(() => {
      getP2pDelay()
    }, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (walletStore.address) {
    return null
  }

  function getP2pDelay() {
    if (typeof window !== 'undefined' && window.IPC) {
      const { getDelay } = window.IPC
      const delay = getDelay()
      setP2pDelay(delay)
    }
  }

  const handleCreateWallet = async (e: React.FormEvent) => {
    // e.preventDefault()

    if (password.length < 8) {
      setError(t('passwordMinLength'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'))
      return
    }

    if (referralCode) {
      if (typeof window !== 'undefined' && window.IPC) {
        const { validateAddress } = window.IPC

        if (!validateAddress(referralCode)) {
          setError(t('invalidReferralCode'))

          return
        }
      }
    }
    setCreateLoading(true)
    try {
      // await createWallet(password, referralCode)
      if (typeof window !== 'undefined' && window.IPC) {
        try {
          const { getNewAddress, MD5 } = window.IPC
          const { encPassword, getBalance, setRelativeAddress } = window.P2P

          const { address, label, walletKey } = getNewAddress()

          const balance = await getBalance(address, walletKey)

          walletStore.setLabel(label)
          walletStore.setAddress(address)
          walletStore.setKey(walletKey)
          walletStore.setPassword(encPassword(password))
          walletStore.setBalance(balance.amount)
          walletStatus.setIsLock(false)
          if (referralCode) {
            setRelativeAddress(address, walletKey, referralCode).then(() => {
              walletStore.setReferralAddress(referralCode)
            })
          }
          toast({
            title: t('walletCreated'),
            description: referralCode ? t('referralBonusReceived') : t('walletCreatedSuccessfully')
          })
        } catch (err) {
          console.error(err)
          if (process.env.NODE_ENV === 'development') {
            console.error(err)
          }

          setError(t('walletCreationFailed'))
        }
      }
    } catch (err) {
      setError(t('walletCreationFailed'))
      console.error(err)
    } finally {
      setCreateLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 dark:from-gray-900 dark:to-yellow-900/20">
      <Card className="w-full max-w-md border-2 border-yellow-400 bg-white dark:bg-gray-900">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/images/kunkun-full.png" alt="KUNKUN" className="w-24 h-24" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-yellow-600 dark:text-yellow-400">KUNKUN {t('wallet')}</CardTitle>
          <CardDescription className="text-center text-yellow-600/80 dark:text-yellow-500/80">{t('setYourPassword')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div  className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-yellow-700 dark:text-yellow-400">
                {t('walletPassword')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('setYourPassword')}
                  className="pl-10 border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              <p className="text-xs text-yellow-600/80 dark:text-yellow-500/80">{t('passwordMinLength')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-yellow-700 dark:text-yellow-400">
                {t('confirmPassword')}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder={t('confirmPassword')}
                className="border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral-code" className="text-yellow-700 dark:text-yellow-400">
                {t('referralCode')}
              </Label>
              <div className="relative">
                <Gift className="absolute left-3 top-3 h-4 w-4 text-yellow-500" />
                <Input
                  id="referral-code"
                  placeholder={t('enterReferralCode')}
                  className="pl-10 border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <p className="text-xs text-yellow-600/80 dark:text-yellow-500/80">{t('referralBonus')}</p>
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <Button
              onClick={handleCreateWallet}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700"
              disabled={createLoading || p2pDelay == 0}
            >
              {createLoading ? t('creating') : t('createWallet')}
            </Button>
            {p2pDelay == 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-red-600/80 dark:text-red-500/80 text-center">
                <WifiOff className="h-4 w-4" />
                {t('p2pUnlinked')}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t border-yellow-200 dark:border-yellow-900/50 pt-4">
          <div className="text-sm text-yellow-600/80 dark:text-yellow-500/80 text-center w-full">{t('termsAndConditions')}</div>
        </CardFooter>
      </Card>
    </div>
  )
}
