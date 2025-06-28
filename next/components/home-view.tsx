'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pagination } from '@/components/ui/pagination'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/hooks/use-translation'
import { useHydrated } from '@/hooks/useHydrated'
import { useWalletStatus, useWalletStore } from '@/lib/store/walletStore'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import Decimal from 'decimal.js'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export function HomeView() {
  const walletStore = useWalletStore()
  const walletStatus = useWalletStatus()
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const { t } = useTranslation()
  const { toast } = useToast()
  const [transferList, setTransferList] = useState<TransferItem[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [chainAddress, setChainAddress] = useState(walletStore.chainAddress)
  const [lastSignTime, setLastSignTime] = useState<LastSignTime>({
    amount: '0',
    createAt: ''
  })
  const [isGetLastSignTime, setIsGetLastSignTime] = useState(false)
  const [signCooldown, setSignCooldown] = useState<number>(0)
  const [nextTime, setNextTime] = useState<string>('')
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false)
  const [signVerification, setSignVerification] = useState('')

  async function getBalanceFunc() {
    if (!walletStore.address || !walletStore.key) return
    const { getBalance } = window.P2P

    try {
      const balance = await getBalance(walletStore.address, walletStore.key)
      walletStore.setBalance(balance.amount)
      walletStore.setDiscordId(balance.discordId)
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

  async function getTransferFunc() {
    if (!walletStore.address || !walletStore.key) return
    const { getTransfer } = window.P2P

    try {
      const transfer = await getTransfer(walletStore.address, page, pageSize)

      setTransferList(transfer.list)
      setTotal(transfer.meta.total)
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

  async function getLastSignTimeFunc() {
    if (!walletStore.address || !walletStore.key) return
    const { getLastSignTime } = window.P2P
    try {
      const lastSignTime = await getLastSignTime(walletStore.address)
      setLastSignTime(lastSignTime)
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

  const updateSignCooldown = () => {
    if (!lastSignTime?.createAt) {
      setSignCooldown(100)
      return
    }

    const lastSignDate = new Date(lastSignTime.createAt)
    const now = new Date()
    const timeDiff = now.getTime() - lastSignDate.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    setNextTime(new Date(lastSignDate.getTime() + 2 * 60 * 60 * 1000).toLocaleString())

    if (hoursDiff >= 2) {
      setSignCooldown(100)
    } else {
      const progress = (hoursDiff / 2) * 100
      setSignCooldown(Math.min(Math.max(progress, 0), 100))
    }
  }

  useEffect(() => {
    setChainAddress(walletStore.chainAddress)
    getBalanceFunc()
    getLastSignTimeFunc()
  }, [walletStore.address, walletStore.key])

  useEffect(() => {
    getTransferFunc()
  }, [walletStore.address, walletStore.key, page, pageSize])

  useEffect(() => {
    updateSignCooldown()

    const interval = setInterval(() => {
      updateSignCooldown()
    }, 60000)

    return () => clearInterval(interval)
  }, [lastSignTime])

  async function onWalletSign() {
    if (!walletStore.address || !walletStore.key) return

    if (signCooldown < 100) {
      const lastSignDate = new Date(lastSignTime.createAt)
      const now = new Date()
      const timeDiff = now.getTime() - lastSignDate.getTime()
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      const remainingHours = Math.max(0, 2 - hoursDiff)
      const remainingMinutes = Math.floor((remainingHours % 1) * 60)

      toast({
        title: t('signCooldown'),
        description: `${t('nextSignIn')} ${Math.floor(remainingHours)}h ${remainingMinutes}m`,
        variant: 'default'
      })

      return
    }

    setIsSignDialogOpen(true)
  }

  async function handleSignConfirm() {
    if (signVerification.trim().toLowerCase() !== 'i love kunkun') {
      toast({
        title: t('error'),
        description: t('invalidSignVerification'),
        variant: 'destructive'
      })
      return
    }

    const { walletSign } = window.P2P
    try {
      await walletSign(walletStore.address, walletStore.key)
      getLastSignTimeFunc()
      setSignCooldown(0)
      setIsSignDialogOpen(false)
      setSignVerification('')

      toast({
        title: t('success'),
        description: t('sign') + ' ' + t('success'),
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

  const hydrated = useHydrated()
  if (!hydrated) return null

  if (!walletStore.address || walletStatus.isLock) {
    return null
  }

  // Get transaction icon and color
  const getTransactionIcon = (amount: string) => {
    if (+amount > 0) {
      return <ArrowDownLeft className="h-5 w-5 text-green-600" />
    } else if (+amount < 0) {
      return <ArrowUpRight className="h-5 w-5 text-red-600" />
    }

    return <ArrowDownLeft className="h-5 w-5 text-gray-400" />
  }

  const getTransactionBg = (amount: string) => {
    if (+amount > 0) {
      return 'bg-green-100 dark:bg-green-900/30'
    } else if (+amount < 0) {
      return 'bg-red-100 dark:bg-red-900/30'
    }
    return ''
  }

  const getTransactionColor = (amount: string) => {
    if (+amount > 0) {
      return 'text-green-600 dark:text-green-400'
    } else if (+amount < 0) {
      return 'text-red-600 dark:text-red-400'
    }
    return 'text-gray-400'
  }

  const handleWithdrawClick = () => {
    setWithdrawAmount('')
    setIsWithdrawDialogOpen(true)
  }

  const handleWithdrawConfirm = async () => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(chainAddress)) {
      toast({
        title: t('error'),
        description: t('invalidAddress'),
        variant: 'destructive'
      })
      return
    }

    try {
      const { txHash } = await window.P2P.payChain(walletStore.key, withdrawAmount, chainAddress)
      setIsWithdrawDialogOpen(false)
      setWithdrawAmount('')
      walletStore.setChainAddress(chainAddress)
      toast({
        title: t('success'),
        description: txHash,
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

    // setIsWithdrawing(true)
    // const success = await withdraw(withdrawAmount)
    // setIsWithdrawing(false)
    // if (success) {
    //   setIsWithdrawDialogOpen(false)
    // }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img src="/images/placeholder-logo2.png" alt="KUNKUN" className="w-10" />
        <h1 className="text-2xl font-bold text-yellow-500">{t('home')}</h1>
      </div>

      <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-yellow-700 dark:text-yellow-400">{t('currentBalance')}</CardTitle>
            <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80">{t('yourTokenBalance')}</CardDescription>
          </div>
          <div className="flex flex-row  items-center ">
            <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
              <div
                className="h-2 bg-yellow-400 rounded-full dark:bg-yellow-600 transition-all duration-300 ease-in-out"
                style={{ width: `${signCooldown}%` }}
              ></div>
              {signCooldown < 100 && (
                <div className="text-xs text-yellow-600/80 dark:text-yellow-500/80">
                  {t('nextSignIn')} {nextTime}
                </div>
              )}
              {signCooldown >= 100 && <div className="text-xs text-green-600 dark:text-green-400">{t('canSignAgain')}</div>}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onWalletSign}
              disabled={signCooldown < 100}
              className={`border-yellow-400 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/30 ${
                signCooldown < 100 ? 'opacity-50 cursor-not-allowed' : ''
              } ml-5`}
            >
              {signCooldown >= 100 ? t('sign') : `${Math.floor(signCooldown)}%`}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {Number(new Decimal(walletStore.balance).toFixed(2)).toLocaleString()} KUNKUN
          </div>
          <div className="mt-3 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleWithdrawClick}
              className="border-yellow-400 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              {t('withdraw')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-yellow-700 dark:text-yellow-400">{t('transactionHistory')}</CardTitle>
            <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80">{t('recentTransactions')}</CardDescription>
          </div>

          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} recordsText={t('records')} />
        </CardHeader>
        <CardContent className="max-h-[350px] overflow-y-auto">
          <div className="space-y-3">
            {transferList.length > 0 ? (
              transferList.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b border-yellow-200 dark:border-yellow-900/50 pb-3">
                  <div className="flex items-center">
                    <div className={cn('p-1.5 rounded-full mr-2', getTransactionBg(tx.amount))}>{getTransactionIcon(tx.amount)}</div>
                    <div>
                      <div className="font-medium text-yellow-700 dark:text-yellow-400 text-sm">{tx.type}</div>
                      <div className="text-xs text-yellow-600/70 dark:text-yellow-500/70">
                        {formatDistanceToNow(new Date(tx.create), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={getTransactionColor(tx.amount)}>
                      {' '}
                      {Number(new Decimal(tx.amount).toFixed(2)).toLocaleString()} KUNKUN
                    </div>
                    <div className="text-xs text-yellow-600/70 dark:text-yellow-500/70">{tx.tag2 ? tx.tag2 : tx.tag}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-yellow-600/70 dark:text-yellow-500/70">{t('noTransactions')}</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-[400px] border-2 border-yellow-400 bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-yellow-700 dark:text-yellow-400">{t('withdrawalConfirmation')}</DialogTitle>
            <DialogDescription className="text-yellow-600/80 dark:text-yellow-500/80">{t('minimumWithdrawal')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="amount" className="text-right text-yellow-700 dark:text-yellow-400">
                {t('withdrawalAmount')}
              </Label>
              <Input
                id="amount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="col-span-3 border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                min="10000"
                step="1"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="address" className="text-right text-yellow-700 dark:text-yellow-400">
                {t('to')}
              </Label>
              <Input
                id="amount"
                type="text"
                value={chainAddress}
                onChange={(e) => setChainAddress(e.target.value)}
                className="col-span-3 border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsWithdrawDialogOpen(false)}
              className="border-yellow-400 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleWithdrawConfirm}
              disabled={
                isWithdrawing ||
                !withdrawAmount ||
                Number.parseFloat(withdrawAmount) < 10000 ||
                Number.parseFloat(withdrawAmount) > Number.parseFloat(walletStore.balance)
              }
              className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700"
            >
              {isWithdrawing ? t('processing') : t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
        <DialogContent className="sm:max-w-[400px] border-2 border-yellow-400 bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-yellow-700 dark:text-yellow-400">{t('signVerification')}</DialogTitle>
            <DialogDescription className="text-yellow-600/80 dark:text-yellow-500/80">{t('enterSignVerification')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="verification" className="text-right text-yellow-700 dark:text-yellow-400 select-none">
                {t('verification')}
              </Label>
              <Input
                id="verification"
                type="text"
                value={signVerification}
                onChange={(e) => setSignVerification(e.target.value)}
                className="col-span-3 border-yellow-300 focus:border-yellow-500 dark:border-yellow-900 dark:focus:border-yellow-700"
                placeholder="I love Kunkun"
                onPaste={(e) => e.preventDefault()}
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSignDialogOpen(false)
                setSignVerification('')
              }}
              className="border-yellow-400 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleSignConfirm}
              className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700"
            >
              {t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
