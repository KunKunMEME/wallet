'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useWallet } from '@/components/wallet-provider'
import { AlertCircle, Bus, Check } from 'lucide-react'
import { useState } from 'react'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Language } from '@/components/wallet-provider'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/hooks/use-translation'
import { useWalletStatus, useWalletStore } from '@/lib/store/walletStore'

export function SettingsView() {
  const { withdrawalAddress, setWithdrawalAddress, setWalletPassword, isLoggedIn, language, setLanguage, setReferralCode } = useWallet()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newReferralCode, setNewReferralCode] = useState('')
  const [addressSaved, setAddressSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation()
  const walletStore = useWalletStore()
  const walletStatus = useWalletStatus()
  const [newWithdrawalAddress, setNewWithdrawalAddress] = useState(walletStore.chainAddress)

  if (!walletStore.address || walletStatus.isLock) {
    return null
  }

  const handleSaveAddress = () => {
    if (newWithdrawalAddress && /^0x[a-fA-F0-9]{40}$/.test(newWithdrawalAddress)) {
      setWithdrawalAddress(newWithdrawalAddress)
      walletStore.setChainAddress(newWithdrawalAddress)
      setAddressSaved(true)
      setTimeout(() => setAddressSaved(false), 3000)
    } else {
      toast({
        title: t('addressFormatError'),
        description: t('enterValidBep20Address'),
        variant: 'destructive'
      })
    }
  }

  const handleSavePassword = async () => {
    setPasswordError('')
    setIsLoading(true)
    const { encPassword } = window.P2P
    if (!currentPassword) {
      setPasswordError(t('pleaseEnterCurrentPassword'))
      setIsLoading(false)
      return
    }

    if (encPassword(currentPassword) !== walletStore.password) {
      setPasswordError(t('incorrectPassword'))
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setPasswordError(t('passwordMinLength'))
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('passwordsDoNotMatch'))
      setIsLoading(false)
      return
    }

    // const success = await setWalletPassword(currentPassword, newPassword)

    walletStore.setPassword(encPassword(newPassword))

    setPasswordSaved(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setPasswordSaved(false), 3000)

    setIsLoading(false)
  }

  const handleLanguageChange = (value: Language) => {
    setLanguage(value)
  }

  const handleApplyReferralCode = async () => {
    if (newReferralCode) {
      const isAddress = window.IPC.validateAddress(newReferralCode)

      if (!isAddress) {
        toast({
          title: t('error'),
          description: t('invalidReferralCode')
        })
        return
      }

      try {
        await window.P2P.setRelativeAddress(walletStore.address, walletStore.key, newReferralCode)
        setNewReferralCode('')
        walletStore.setReferralAddress(newReferralCode)
        toast({
          title: t('success'),
          description: t('referralCodeApplied'),
          variant: 'default'
        })
      } catch (error: any) {
        if (error?.type === 'error') {
          toast({
            title: t('error'),
            description: error?.msg,
            variant: 'destructive'
          })
        }
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img src="/images/set.png" alt="KUNKUN" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-yellow-500">{t('settings')}</h1>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-yellow-100 dark:bg-yellow-900/30">
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white dark:data-[state=active]:bg-yellow-600"
          >
            {t('account')}
          </TabsTrigger>
          <TabsTrigger
            value="withdrawal"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white dark:data-[state=active]:bg-yellow-600"
          >
            {t('withdrawal')}
          </TabsTrigger>
          <TabsTrigger
            value="referral"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white dark:data-[state=active]:bg-yellow-600"
          >
            {t('referral')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-3 space-y-3">
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-700 dark:text-yellow-400">{t('language')}</CardTitle>
              <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80">{t('selectLanguage')}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue={language} onValueChange={handleLanguageChange as (value: string) => void}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="en" className="text-yellow-500 border-yellow-400 focus:ring-yellow-500" />
                  <Label htmlFor="en" className="text-yellow-700 dark:text-yellow-400">
                    {t('english')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="zh" id="zh" className="text-yellow-500 border-yellow-400 focus:ring-yellow-500" />
                  <Label htmlFor="zh" className="text-yellow-700 dark:text-yellow-400">
                    {t('chinese')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ru" id="ru" className="text-yellow-500 border-yellow-400 focus:ring-yellow-500" />
                  <Label htmlFor="ru" className="text-yellow-700 dark:text-yellow-400">
                    {t('russian')}
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-700 dark:text-yellow-400">{t('changePassword')}</CardTitle>
              <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80">{t('setOrChangePassword')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-yellow-700 dark:text-yellow-400">
                    {t('currentPassword')}
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                  />
                </div>

                <Separator className="bg-yellow-200 dark:bg-yellow-900/50" />

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-yellow-700 dark:text-yellow-400">
                    {t('newPassword')}
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-yellow-700 dark:text-yellow-400">
                    {t('confirmNewPassword')}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                  />
                </div>

                {passwordError && <div className="text-sm text-red-500">{passwordError}</div>}

                {passwordSaved && (
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <Check className="h-4 w-4 mr-1" /> {t('passwordUpdated')}
                  </div>
                )}

                <Button
                  onClick={handleSavePassword}
                  disabled={isLoading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700"
                >
                  {isLoading ? t('updating') : t('updatePassword')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawal" className="mt-3">
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-700 dark:text-yellow-400">{t('withdrawalAddress')}</CardTitle>
              <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80">{t('setWithdrawalAddress')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="withdrawal-address" className="text-yellow-700 dark:text-yellow-400">
                    {t('bep20Address')}
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="withdrawal-address"
                      placeholder="0x..."
                      value={newWithdrawalAddress}
                      onChange={(e) => setNewWithdrawalAddress(e.target.value)}
                      className="border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                    />
                    <Button
                      onClick={handleSaveAddress}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700"
                    >
                      {t('save')}
                    </Button>
                  </div>
                  {addressSaved && (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <Check className="h-4 w-4 mr-1" /> {t('addressSaved')}
                    </div>
                  )}
                </div>

                <Alert className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t('caution')}</AlertTitle>
                  <AlertDescription className="text-xs">{t('cautionText')}</AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referral" className="mt-3">
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-700 dark:text-yellow-400">{t('referralCode')}</CardTitle>
              <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80">
                {walletStore.referralAddress ? `${t('usedReferralCode')}: ${walletStore.referralAddress}` : t('enterReferralCode')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!walletStore.referralAddress ? (
                <div className="flex space-x-2">
                  <Input
                    placeholder={t('referralCode')}
                    value={newReferralCode}
                    onChange={(e) => setNewReferralCode(e.target.value)}
                    disabled={!!walletStore.referralAddress}
                    className="border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                  />
                  <Button
                    onClick={handleApplyReferralCode}
                    disabled={!!walletStore.referralAddress || !newReferralCode}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700"
                  >
                    {t('apply')}
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-yellow-600/80 dark:text-yellow-500/80">{t('alreadyUsedReferralCode')}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
