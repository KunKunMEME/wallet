'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
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
import { DISCORD_INVITE_URL } from '@/lib/const'

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
  const [isUnbindDialogOpen, setIsUnbindDialogOpen] = useState(false)

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

  const onUnbindDiscordId = async () => {
    try {
      await window.P2P.unbindDiscordId(walletStore.key, walletStore.address)
      walletStore.setDiscordId('')
      toast({
        title: t('success'),
        description: t('discordUnbindSuccess'),
        variant: 'default'
      })
      setIsUnbindDialogOpen(false)
    } catch (error) {
      console.log(error)
    }
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

        <TabsContent value="account" className="mt-2 space-y-2">
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="py-1 px-4">
              <CardTitle className="text-yellow-700 dark:text-yellow-400 text-base">{t('language')}</CardTitle>
              <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80 text-xs">{t('selectLanguage')}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <RadioGroup defaultValue={language} onValueChange={handleLanguageChange as (value: string) => void} className="flex px-2">
                <div className="flex items-center">
                  <RadioGroupItem value="en" id="en" className="h-3 w-3 text-yellow-500 border-yellow-400 focus:ring-yellow-500" />
                  <Label htmlFor="en" className="text-yellow-700 dark:text-yellow-400 ml-1">
                    {t('english')}
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="zh" id="zh" className="h-3 w-3 text-yellow-500 border-yellow-400 focus:ring-yellow-500" />
                  <Label htmlFor="zh" className="text-yellow-700 dark:text-yellow-400 ml-1">
                    {t('chinese')}
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="ru" id="ru" className="h-3 w-3 text-yellow-500 border-yellow-400 focus:ring-yellow-500" />
                  <Label htmlFor="ru" className="text-yellow-700 dark:text-yellow-400  ml-1">
                    {t('russian')}
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="py-1 px-4">
              <CardTitle className="text-yellow-700 dark:text-yellow-400 text-base">{t('changePassword')}</CardTitle>
              <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80 text-xs">{t('setOrChangePassword')}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current-password" className="text-yellow-700 dark:text-yellow-400 text-xs">
                    {t('currentPassword')}
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700 h-8 text-sm"
                  />
                </div>

                <Separator className="bg-yellow-200 dark:bg-yellow-900/50 my-1" />

                <div className="space-y-1">
                  <Label htmlFor="new-password" className="text-yellow-700 dark:text-yellow-400 text-xs">
                    {t('newPassword')}
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700 h-8 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirm-password" className="text-yellow-700 dark:text-yellow-400 text-xs">
                    {t('confirmNewPassword')}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700 h-8 text-sm"
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
                  className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700 h-8 text-sm py-0"
                >
                  {isLoading ? t('updating') : t('updatePassword')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Discord绑定管理 */}
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="py-1 px-4">
              <CardTitle className="text-yellow-700 dark:text-yellow-400 text-base">{t('discordManagement')}</CardTitle>
              <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80 text-xs">{t('discordBindStatus')}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <div className="space-y-2">
                {walletStore.discordId ? (
                  <>
                    <div className="flex items-center">
                      <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                        Discord ID: <span className="font-bold">{walletStore.discordId}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsUnbindDialogOpen(true)}
                      variant="destructive"
                      className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 h-8 text-sm py-0"
                    >
                      {t('unbindDiscord')}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400">{t('discordUnbound')}</div>
                    </div>

                    <Alert className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800 py-1">
                      <AlertCircle className="h-3 w-3" />
                      <AlertTitle className="text-xs">{t('bindDiscordGuide')}</AlertTitle>
                      <AlertDescription className="text-xs leading-tight">{t('bindDiscordDescription')}</AlertDescription>
                    </Alert>

                    <Button
                      onClick={() => (window as any).nw?.Shell.openExternal(DISCORD_INVITE_URL)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 h-8 text-sm py-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        className="mr-1"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                      </svg>
                      {t('joinDiscord')}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <AlertDialog open={isUnbindDialogOpen} onOpenChange={setIsUnbindDialogOpen}>
            <AlertDialogContent className="bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 border-2 border-yellow-400 max-w-sm p-4">
              <AlertDialogHeader className="pb-2">
                <AlertDialogTitle className="text-yellow-700 dark:text-yellow-400 text-base">{t('unbindDiscord')}</AlertDialogTitle>
                <AlertDialogDescription className="text-yellow-600/80 dark:text-yellow-500/80 text-xs">
                  {t('confirmUnbindDiscord')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="border-yellow-400 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30 h-8 text-sm py-0">
                  {t('cancel')}
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 h-8 text-sm py-0"
                  onClick={onUnbindDiscordId}
                >
                  {t('unbindDiscord')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="withdrawal" className="mt-2 space-y-2">
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="py-1 px-4">
              <CardTitle className="text-yellow-700 dark:text-yellow-400 text-base">{t('withdrawalAddress')}</CardTitle>
              <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80 text-xs">{t('setWithdrawalAddress')}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="withdrawal-address" className="text-yellow-700 dark:text-yellow-400 text-xs">
                    {t('bep20Address')}
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="withdrawal-address"
                      placeholder="0x..."
                      value={newWithdrawalAddress}
                      onChange={(e) => setNewWithdrawalAddress(e.target.value)}
                      className="border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700 h-8 text-sm"
                    />
                    <Button
                      onClick={handleSaveAddress}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700 h-8 text-sm py-0"
                    >
                      {t('save')}
                    </Button>
                  </div>
                  {addressSaved && (
                    <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                      <Check className="h-3 w-3 mr-1" /> {t('addressSaved')}
                    </div>
                  )}
                </div>

                <Alert className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800 py-1">
                  <AlertCircle className="h-3 w-3" />
                  <AlertTitle className="text-xs">{t('caution')}</AlertTitle>
                  <AlertDescription className="text-xs leading-tight">{t('cautionText')}</AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referral" className="mt-2 space-y-2">
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="py-1 px-4">
              <CardTitle className="text-yellow-700 dark:text-yellow-400 text-base">{t('referralCode')}</CardTitle>
              <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80 text-xs">
                {walletStore.referralAddress ? `${t('usedReferralCode')}: ${walletStore.referralAddress}` : t('enterReferralCode')}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-2">
              {!walletStore.referralAddress ? (
                <div className="flex space-x-2">
                  <Input
                    placeholder={t('referralCode')}
                    value={newReferralCode}
                    onChange={(e) => setNewReferralCode(e.target.value)}
                    disabled={!!walletStore.referralAddress}
                    className="border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700 h-8 text-sm"
                  />
                  <Button
                    onClick={handleApplyReferralCode}
                    disabled={!!walletStore.referralAddress || !newReferralCode}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700 h-8 text-sm py-0"
                  >
                    {t('apply')}
                  </Button>
                </div>
              ) : (
                <div className="text-xs text-yellow-600/80 dark:text-yellow-500/80">{t('alreadyUsedReferralCode')}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
