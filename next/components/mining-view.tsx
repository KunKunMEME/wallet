'use client'

import { useWallet } from '@/components/wallet-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatDistanceToNow, set } from 'date-fns'
import { Pickaxe, Clock, TrendingUp, Download } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWalletStore, useWalletStatus } from '@/lib/store/walletStore'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import Decimal from 'decimal.js'
import { Pagination } from './ui/pagination'
import { formatNumberWithUnit } from '@/lib/utils'

export function MiningView() {
  const { miningData, miners, hashrateData, isLoggedIn } = useWallet()
  const walletStore = useWalletStore()
  const walletStatus = useWalletStatus()
  const { t } = useTranslation()
  const { toast } = useToast()
  const [miningInfo, setMiningInfo] = useState<MiningInfoP2P>({
    cpu: {
      amount: '0',
      unpaid: '0',
      workers: 0,
      hashrate: '0'
    },
    gpu: {
      amount: '0',
      unpaid: '0',
      workers: 0,
      hashrate: '0'
    }
  })
  const [miningList, setMiningList] = useState<MiningList[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [AddressTotalPower, setAddressTotalPower] = useState<AddressTotalPower>({
    cpu: [
      {
        time: '1990-01-01T00:00:00Z',
        hashrate: '0',
        workers: 0
      }
    ],
    gpu: [
      {
        time: '1990-01-01T00:00:00Z',
        hashrate: '0',
        workers: 0
      }
    ]
  })

  const getMiningInfo = async () => {
    try {
      const miningInfo = await window.P2P.getMiningInfo(walletStore.address)
      setMiningInfo(miningInfo)
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

  const getMiningList = async () => {
    try {
      const miningList = await window.P2P.getMiningList(walletStore.address, page, pageSize)
      setMiningList(miningList.list)
      setTotal(miningList.meta.total)
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

  const getAddressTotalPower = async () => {
    try {
      const totalPower = await window.P2P.getAddressTotalPower(walletStore.address)
      setAddressTotalPower(totalPower)
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
    getMiningInfo()
    getAddressTotalPower()
  }, [walletStore.address])

  useEffect(() => {
    getMiningList()
  }, [walletStore.address, page, pageSize])

  if (!walletStore.address || walletStatus.isLock) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img src="/images/mining.png" alt="KUNKUN Miner" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-yellow-500">{t('mining')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-1 pt-3 flex flex-row items-center">
            <Pickaxe className="h-5 w-5 mr-2 text-yellow-500" />

            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{t('totalMined')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="">
              <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                {Number(new Decimal(miningInfo.cpu.amount).add(miningInfo.gpu.amount).toFixed(2)).toLocaleString()}
              </div>
              <p className="text-xs text-yellow-500">CPU : {Number(miningInfo.cpu.amount).toLocaleString()}</p>
              <p className="text-xs text-yellow-500">GPU : {Number(miningInfo.gpu.amount).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-1 pt-3 flex flex-row items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-yellow-500" />
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{t('unpaid')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                {Number(new Decimal(miningInfo.cpu.unpaid).add(miningInfo.gpu.unpaid).toFixed(2)).toLocaleString()}
              </div>
            </div>
            <p className="text-xs text-yellow-500">CPU : {Number(miningInfo.cpu.unpaid).toLocaleString()}</p>
            <p className="text-xs text-yellow-500">GPU : {Number(miningInfo.gpu.unpaid).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-1 pt-3 flex flex-row items-center">
            <Clock className="h-5 w-5 mr-2 text-yellow-500" />
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{t('hashrate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                {formatNumberWithUnit(new Decimal(miningInfo.cpu.hashrate).add(miningInfo.gpu.hashrate).toFixed())}H/s
              </div>
            </div>
            <p className="text-xs text-yellow-500">CPU : {formatNumberWithUnit(miningInfo.cpu.hashrate)}H/s</p>
            <p className="text-xs text-yellow-500">GPU : {formatNumberWithUnit(miningInfo.gpu.hashrate)}H/s</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="miners" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-yellow-100 dark:bg-yellow-900/30">
          <TabsTrigger
            value="miners"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white dark:data-[state=active]:bg-yellow-600"
          >
            {t('minerList')}
          </TabsTrigger>
          <TabsTrigger
            value="hashrate"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white dark:data-[state=active]:bg-yellow-600"
          >
            {t('hashrateChart')}
          </TabsTrigger>
          <TabsTrigger
            value="help"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white dark:data-[state=active]:bg-yellow-600"
          >
            {t('help')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="miners" className="mt-3">
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-yellow-200 dark:border-yellow-900/50">
                      <TableHead className="text-yellow-700 dark:text-yellow-400">{t('name')}</TableHead>
                      <TableHead className="text-yellow-700 dark:text-yellow-400">{t('device')}</TableHead>
                      <TableHead className="text-yellow-700 dark:text-yellow-400">{t('hashrate')}</TableHead>
                      <TableHead className="text-yellow-700 dark:text-yellow-400">{t('balance')}</TableHead>
                      <TableHead className="text-yellow-700 dark:text-yellow-400">{t('paid')}</TableHead>
                      <TableHead className="text-yellow-700 dark:text-yellow-400">{t('status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {miningList.map((miner) => (
                      <TableRow key={miner.id} className="border-b border-yellow-200 dark:border-yellow-900/50">
                        <TableCell className="font-medium text-yellow-700 dark:text-yellow-400">{miner.user}</TableCell>
                        <TableCell className="text-yellow-600 dark:text-yellow-500">{miner.type}</TableCell>
                        <TableCell className="text-yellow-600 dark:text-yellow-500">{formatNumberWithUnit(miner.hashrate)}H/s</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-yellow-600 dark:text-yellow-500">
                              {Number(Decimal(miner.balance || '0').toFixed(2)).toLocaleString()}{' '}
                            </div>
                            <Progress
                              value={(Number.parseFloat(miner.balance) / 100) * 100}
                              className="h-1 bg-yellow-200 dark:bg-yellow-900/50"
                              indicatorClassName="bg-yellow-500 dark:bg-yellow-600"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-yellow-600 dark:text-yellow-500">
                            {Number(Decimal(miner.amount || '0').toFixed(2)).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={miner.state === 'online' ? 'success' : 'destructive'}
                            className={
                              miner.state === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''
                            }
                          >
                            {miner.state === 'online' ? t('online') : t('offline')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} recordsText={t('records')} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hashrate" className="mt-3">
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-700 dark:text-yellow-400">{t('hashrateChart')}</CardTitle>
              <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80">{t('last24Hours')}</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <div className="w-full h-full">
                <HashrateChart data={AddressTotalPower} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="mt-3">
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-700 dark:text-yellow-400">{t('downloadMiner')}</CardTitle>
              <CardDescription className="text-yellow-600/80 dark:text-yellow-500/80">{t('downloadMinerDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* CPU Mining Section */}
                <div className="border-b border-yellow-200 dark:border-yellow-900/50 pb-4">
                  <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">CPU {t('mining')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mb-1">{t('poolAddress')}:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                          <span className="text-xs">{t('lowDifficulty')}: cpu.kunkun.fyi:9000</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => navigator.clipboard.writeText('cpu.kunkun.fyi:9000')}>
                            <span className="sr-only">Copy</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          </Button>
                        </div>
                        <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                          <span className="text-xs">{t('highDifficulty')}: cpu.kunkun.fyi:9001</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => navigator.clipboard.writeText('cpu.kunkun.fyi:9001')}>
                            <span className="sr-only">Copy</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mb-1">{t('software')}:</h4>
                      <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                        <span className="text-xs">XMRig</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => (window as any).nw?.Shell.openExternal('https://github.com/xmrig/xmrig/releases')}>
                          <span className="sr-only">Download</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* GPU Mining Section */}
                <div className="pb-4">
                  <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">GPU {t('mining')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mb-1">{t('poolAddress')}:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                          <span className="text-xs">{t('lowDifficulty')}: gpu.kunkun.fyi:9100</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => navigator.clipboard.writeText('gpu.kunkun.fyi:9100')}>
                            <span className="sr-only">Copy</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          </Button>
                        </div>
                        <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                          <span className="text-xs">{t('highDifficulty')}: gpu.kunkun.fyi:9101</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => navigator.clipboard.writeText('gpu.kunkun.fyi:9101')}>
                            <span className="sr-only">Copy</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      {/* <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mb-1">{t('software')}:</h4> */}
                      <div className="space-y-1">
                        <div className="flex flex-col space-y-0.5">
                          <h5 className="text-xs font-medium text-yellow-600 dark:text-yellow-500 mb-0.5">AMD {t('gpuCards')}:</h5>
                          <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 py-1 px-2 rounded">
                            <span className="text-xs">TeamRedMiner</span>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => (window as any).nw?.Shell.openExternal('https://github.com/todxx/teamredminer/releases')}>
                              <span className="sr-only">Download</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            </Button>
                          </div>
                          <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 py-1 px-2 rounded">
                            <span className="text-xs">LolMiner</span>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => (window as any).nw?.Shell.openExternal('https://github.com/Lolliedieb/lolMiner-releases/releases')}>
                              <span className="sr-only">Download</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-0.5">
                          <h5 className="text-xs font-medium text-yellow-600 dark:text-yellow-500 mb-0.5">NVIDIA {t('gpuCards')}:</h5>
                          <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 py-1 px-2 rounded">
                            <span className="text-xs">T-Rex</span>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => (window as any).nw?.Shell.openExternal('https://github.com/trexminer/T-Rex/releases')}>
                              <span className="sr-only">Download</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            </Button>
                          </div>
                          <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 py-1 px-2 rounded">
                            <span className="text-xs">NBMiner</span>
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => (window as any).nw?.Shell.openExternal('https://github.com/NebuTech/NBMiner/releases')}>
                              <span className="sr-only">Download</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mining Command Generator */}
                <div className="border-t border-yellow-200 dark:border-yellow-900/50 pt-4">
                  <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">{t('miningCommandGenerator')}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mb-1 block">{t('deviceType')}</label>
                        <select 
                          className="w-full rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 dark:focus:ring-yellow-600"
                          defaultValue="cpu"
                          id="deviceType"
                          onChange={(e) => {
                            const deviceType = e.target.value;
                            const minerSoftwareSelect = document.getElementById('minerSoftware') as HTMLSelectElement;
                            
                            // Clear existing options
                            while (minerSoftwareSelect.options.length > 0) {
                              minerSoftwareSelect.remove(0);
                            }
                            
                            // Add appropriate options based on device type
                            if (deviceType === 'cpu') {
                              const option = document.createElement('option');
                              option.value = 'xmrig';
                              option.text = 'XMRig';
                              minerSoftwareSelect.add(option);
                            } else if (deviceType === 'amd') {
                              const option1 = document.createElement('option');
                              option1.value = 'teamredminer';
                              option1.text = 'TeamRedMiner';
                              minerSoftwareSelect.add(option1);
                              
                              const option2 = document.createElement('option');
                              option2.value = 'lolminer';
                              option2.text = 'LolMiner';
                              minerSoftwareSelect.add(option2);
                            } else if (deviceType === 'nvidia') {
                              const option1 = document.createElement('option');
                              option1.value = 'trex';
                              option1.text = 'T-Rex';
                              minerSoftwareSelect.add(option1);
                              
                              const option2 = document.createElement('option');
                              option2.value = 'nbminer';
                              option2.text = 'NBMiner';
                              minerSoftwareSelect.add(option2);
                            }
                          }}
                        >
                          <option value="cpu">CPU</option>
                          <option value="amd">GPU - AMD</option>
                          <option value="nvidia">GPU - NVIDIA</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mb-1 block">{t('minerSoftware')}</label>
                        <select 
                          className="w-full rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 dark:focus:ring-yellow-600"
                          defaultValue="xmrig"
                          id="minerSoftware"
                        >
                          <option value="xmrig">XMRig</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mb-1 block">{t('difficulty')}</label>
                      <select 
                        className="w-full rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 dark:focus:ring-yellow-600"
                        defaultValue="low"
                        id="difficulty"
                      >
                        <option value="low">{t('lowDifficulty')}</option>
                        <option value="high">{t('highDifficulty')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mb-1 block">{t('workerName')}</label>
                      <input 
                        type="text" 
                        className="w-full rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 dark:focus:ring-yellow-600"
                        placeholder="worker1"
                        id="workerName"
                      />
                    </div>
                    <div>
                      <Button 
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700"
                        onClick={() => {
                          const deviceType = (document.getElementById('deviceType') as HTMLSelectElement).value;
                          const minerSoftware = (document.getElementById('minerSoftware') as HTMLSelectElement).value;
                          const difficulty = (document.getElementById('difficulty') as HTMLSelectElement).value;
                          const workerName = (document.getElementById('workerName') as HTMLInputElement).value || 'worker1';
                          
                          let command = '';
                          let poolAddress = '';
                          
                          if (deviceType === 'cpu') {
                            poolAddress = difficulty === 'low' ? 'cpu.kunkun.fyi:9000' : 'cpu.kunkun.fyi:9001';
                            command = `./xmrig -o ${poolAddress} -u ${walletStore.address}.${workerName} -a rx/0 -k`;
                          } else if (deviceType === 'amd') {
                            poolAddress = difficulty === 'low' ? 'gpu.kunkun.fyi:9100' : 'gpu.kunkun.fyi:9101';
                            if (minerSoftware === 'teamredminer') {
                              command = `teamredminer -a kawpow -o stratum+tcp://${poolAddress} -u ${walletStore.address}.${workerName} -p x`;
                            } else if (minerSoftware === 'lolminer') {
                              command = `lolMiner --algo kawpow --pool ${poolAddress} --user ${walletStore.address}.${workerName}`;
                            }
                          } else if (deviceType === 'nvidia') {
                            poolAddress = difficulty === 'low' ? 'gpu.kunkun.fyi:9100' : 'gpu.kunkun.fyi:9101';
                            if (minerSoftware === 'trex') {
                              command = `t-rex -a kawpow -o stratum+tcp://${poolAddress} -u ${walletStore.address}.${workerName} -p x`;
                            } else if (minerSoftware === 'nbminer') {
                              command = `nbminer -a kawpow -o stratum+tcp://${poolAddress} -u ${walletStore.address}.${workerName}`;
                            }
                          }
                          
                          // Update UI with command
                          const commandElement = document.getElementById('miningCommand');
                          if (commandElement) {
                            commandElement.textContent = command;
                          }
                          
                          // Show the command section
                          const commandSection = document.getElementById('commandSection');
                          if (commandSection) {
                            commandSection.classList.remove('hidden');
                          }
                        }}
                      >
                        {t('generateCommand')}
                      </Button>
                    </div>
                    <div id="commandSection" className="hidden">
                      <label className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mb-1 block">{t('miningCommand')}</label>
                      <div className="relative">
                        <pre className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-xs overflow-x-auto" id="miningCommand"></pre>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={() => {
                            const commandElement = document.getElementById('miningCommand');
                            if (commandElement && commandElement.textContent) {
                              navigator.clipboard.writeText(commandElement.textContent);
                              toast({
                                title: t('copied'),
                                description: t('commandCopied'),
                              });
                            }
                          }}
                        >
                          <span className="sr-only">Copy</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-yellow-200 dark:border-yellow-900/50 pt-3">
              <div className="text-xs text-yellow-600/80 dark:text-yellow-500/80">{t('minerInstructions')}</div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function HashrateChart({ data }: { data: AddressTotalPower }) {
  // Calculate min and max values for scales
  const maxHashrate =
    Math.max(Math.max(...data.cpu.map((d) => Number(d.hashrate))), Math.max(...data.gpu.map((d) => Number(d.hashrate)))) * 1.1
  const minHashrate = Math.max(
    0,
    Math.min(Math.min(...data.cpu.map((d) => Number(d.hashrate))), Math.min(...data.gpu.map((d) => Number(d.hashrate)))) * 0.9
  )
  const maxWorkers = Math.max(...data.cpu.map((d) => d.workers), ...data.gpu.map((d) => d.workers)) * 1.1

  // Chart dimensions
  const height = 250
  const width = 600
  const padding = { top: 20, right: 60, bottom: 30, left: 60 }

  // Calculate scales
  const xScale = (i: number) => (width - padding.left - padding.right) * (i / (data.cpu.length - 1)) + padding.left
  const yScaleHashrate = (value: number) =>
    height - padding.bottom - (height - padding.top - padding.bottom) * ((value - minHashrate) / (maxHashrate - minHashrate))
  const yScaleWorkers = (value: number) => height - padding.bottom - (height - padding.top - padding.bottom) * (value / maxWorkers)

  // Generate paths
  const pathDataCPU = data.cpu
    .map((d, i) => {
      const x = xScale(i)
      const y = yScaleHashrate(Number(d.hashrate))
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  const pathDataGPU = data.gpu
    .map((d, i) => {
      const x = xScale(i)
      const y = yScaleHashrate(Number(d.hashrate))
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((percent) => {
        const y = yScaleHashrate(minHashrate + (maxHashrate - minHashrate) * (percent / 100))
        return (
          <g key={`grid-y-${percent}`}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#fde68a" strokeDasharray="5,5" opacity="0.3" />
          </g>
        )
      })}

      {/* X-axis labels */}
      {data.cpu
        .filter((_, i) => i % 16 === 0)
        .map((d, i) => (
          <text key={`x-label-${i}`} x={xScale(i * 16)} y={height - padding.bottom + 15} textAnchor="middle" fontSize="10" fill="#f59e0b">
            {new Date(d.time).toLocaleTimeString()}
          </text>
        ))}

      {/* Left Y-axis (Hashrate) */}
      <text
        transform={`rotate(-90, ${padding.left / 3}, ${height / 2})`}
        x={padding.left / 3}
        y={height / 2}
        textAnchor="middle"
        fontSize="10"
        fill="#f59e0b"
      >
        MH/s
      </text>
      {[0, maxHashrate / 2, maxHashrate].map((value, i) => (
        <text key={`y-hashrate-${i}`} x={padding.left - 5} y={yScaleHashrate(value)} textAnchor="end" fontSize="10" fill="#f59e0b">
          {Math.round(value)}
        </text>
      ))}

      {/* Right Y-axis (Workers) */}
      <text
        transform={`rotate(-90, ${width - padding.right / 3}, ${height / 2})`}
        x={width - padding.right / 3}
        y={height / 2}
        textAnchor="middle"
        fontSize="10"
        fill="#2563eb"
      >
        Workers
      </text>
      {[0, maxWorkers / 2, maxWorkers].map((value, i) => (
        <text key={`y-workers-${i}`} x={width - padding.right + 5} y={yScaleWorkers(value)} textAnchor="start" fontSize="10" fill="#2563eb">
          {Math.round(value)}
        </text>
      ))}

      {/* Workers bars */}
      {data.cpu.map((d, i) => (
        <rect
          key={`workers-cpu-${i}`}
          x={xScale(i) - 2}
          y={yScaleWorkers(d.workers)}
          width="2"
          height={height - padding.bottom - yScaleWorkers(d.workers)}
          fill="#f59e0b"
          opacity="0.3"
        />
      ))}
      {data.gpu.map((d, i) => (
        <rect
          key={`workers-gpu-${i}`}
          x={xScale(i) + 2}
          y={yScaleWorkers(d.workers)}
          width="2"
          height={height - padding.bottom - yScaleWorkers(d.workers)}
          fill="#2563eb"
          opacity="0.3"
        />
      ))}

      {/* Lines */}
      <path d={pathDataCPU} fill="none" stroke="#f59e0b" strokeWidth="2" />
      <path d={pathDataGPU} fill="none" stroke="#2563eb" strokeWidth="2" />

      {/* Data points */}
      {data.cpu
        .filter((_, i) => i % 8 === 0)
        .map((d, i) => (
          <circle key={`point-cpu-${i}`} cx={xScale(i * 8)} cy={yScaleHashrate(Number(d.hashrate))} r="3" fill="#f59e0b" />
        ))}
      {data.gpu
        .filter((_, i) => i % 8 === 0)
        .map((d, i) => (
          <circle key={`point-gpu-${i}`} cx={xScale(i * 8)} cy={yScaleHashrate(Number(d.hashrate))} r="3" fill="#2563eb" />
        ))}

      {/* Legend */}
      <g transform={`translate(${padding.left + 10}, ${padding.top + 10})`}>
        <line x1="0" y1="0" x2="20" y2="0" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="10" cy="0" r="3" fill="#f59e0b" />
        <text x="25" y="4" fontSize="10" fill="#f59e0b">
          CPU
        </text>

        <line x1="60" y1="0" x2="80" y2="0" stroke="#2563eb" strokeWidth="2" />
        <circle cx="70" cy="0" r="3" fill="#2563eb" />
        <text x="85" y="4" fontSize="10" fill="#2563eb">
          GPU
        </text>
      </g>
    </svg>
  )
}
