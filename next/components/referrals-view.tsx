'use client'
import { useWallet } from '@/components/wallet-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Users, Gift, Share2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useTranslation } from '@/hooks/use-translation'
import { useWalletStore, useWalletStatus } from '@/lib/store/walletStore'
import { useEffect, useState } from 'react'
import Decimal from 'decimal.js'
import { Pagination } from './ui/pagination'

export function ReferralsView() {
  const { referralData, isLoggedIn } = useWallet()
  const { toast } = useToast()
  const { t } = useTranslation()
  const walletStore = useWalletStore()
  const walletStatus = useWalletStatus()
  const [referralInfo, setReferralInfo] = useState<RelativeInfo>({
    LV1Count: 0,
    LV2Count: 0,
    LV1Amount: '0',
    LV2Amount: '0'
  })
  const [relativeList, setRelativeList] = useState<RelativeList[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)

  const getReferralInfo = async () => {
    if (!walletStore.address || !walletStore.key) return
    const { getRelativeInfo } = window.P2P
    try {
      const relativeInfo = await getRelativeInfo(walletStore.address)

      setReferralInfo(relativeInfo)
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
  const getRelativeList = async () => {
    if (!walletStore.address || !walletStore.key) return
    const { getRelativeList } = window.P2P
    try {
      const relativeList = await getRelativeList(walletStore.address, page, pageSize)

      setRelativeList(relativeList.list)
      setTotal(relativeList.meta.total)
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

  useEffect(() => {
    getReferralInfo()
  }, [walletStore.address, walletStore.key])
  useEffect(() => {
    getRelativeList()
  }, [walletStore.address, walletStore.key, page, pageSize])

  if (!walletStore.address || walletStatus.isLock) {
    return null
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(walletStore.address)
    toast({
      title: t('copied'),
      description: t('referralCodeCopied')
    })
  }

  const shareReferralLink = () => {
    const link = `https://yourapp.com/register?ref=${referralData.code}`
    navigator.clipboard.writeText(link)
    toast({
      title: t('copied'),
      description: t('referralLinkCopied')
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img src="/images/lv.png" alt="KUNKUN" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-yellow-500">{t('referrals')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{t('totalReferrals')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400 ">
                <p className="flex flex-row items-center">
                  <Users className="h-5 w-5 mr-2 text-yellow-500" /> {referralInfo.LV1Count + referralInfo.LV2Count} {t('people')}
                </p>
                <p className="text-xs text-yellow-500">
                  {t('level1Referrals')} : {referralInfo.LV1Count}
                </p>
                <p className="text-xs text-yellow-500">
                  {t('level2Referrals')} : {referralInfo.LV2Count}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{t('referralRewards')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                <p className="flex flex-row items-center">
                  <Gift className="h-5 w-5 mr-2 text-yellow-500" />{' '}
                  {new Decimal(referralInfo.LV1Amount).add(referralInfo.LV2Amount).toFixed(2)}
                </p>

                <p className="text-xs text-yellow-500">
                  {t('level1Referrals')} : {new Decimal(referralInfo.LV1Amount).toFixed(2)}
                </p>
                <p className="text-xs text-yellow-500">
                  {t('level2Referrals')} : {new Decimal(referralInfo.LV2Amount).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{t('myReferralCode')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-xl font-bold mr-2 text-yellow-700 dark:text-yellow-400">{walletStore.address}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyReferralCode}
                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-2">
          {/* <CardTitle className="text-yellow-700 dark:text-yellow-400">{t('shareReferralLink')}</CardTitle> */}
          <CardDescription className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{t('inviteFriends')}</CardDescription>
          <div className="text-xs text-yellow-600/80 dark:text-yellow-500/80">{t('referralBonusExplanation')}</div>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-md flex justify-between items-center">
            <div className="text-sm truncate text-yellow-700 dark:text-yellow-400 text-center flex-1">{walletStore.address}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyReferralCode}
              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-1  ">
          <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400 flex flex-row items-center justify-between">
            <p> {t('referralRewardsList')}</p>
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} recordsText={t('records')} />
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-yellow-200 dark:border-yellow-900/50 max-h-[200px] overflow-y-auto">
            <div className="grid grid-cols-[160px_80px_auto_60px_auto] p-2 text-xs font-medium border-b border-yellow-200 dark:border-yellow-900/50 bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
              <div>{t('userId')}</div>
              <div>{t('registrationDate')}</div>
              <div>{t('rewards')}</div>
              <div>LV2</div>
              <div>LV2 rewards</div>
            </div>
            {relativeList.map((ref) => (
              <div
                key={ref.address}
                className="grid grid-cols-[160px_80px_auto_60px_auto] p-2 text-xs border-b border-yellow-200 dark:border-yellow-900/50 last:border-0 text-yellow-600 dark:text-yellow-500"
              >
                <div className="truncate">{ref.address}</div>
                <div>{new Date(ref.time).toLocaleDateString()}</div>
                <div>{new Decimal(ref.amount).toFixed(2)}</div>
                <div>{ref.LV2Total}</div>
                <div>{new Decimal(ref.LV2Amount).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
