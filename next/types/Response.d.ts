interface PageMate {
  total: number
  page: number
  pageSize: number
}

interface Page<T = any> {
  list: T[]
  meta: PageMate
}

interface TransferItem {
  id: string
  amount: string
  type: string
  create: string
  tag?: string
  tag2?: string
}

interface MiningInfoP2P {
  cpu: MiningInfo
  gpu: MiningInfo
}

interface MiningInfo {
  amount: string
  unpaid: string
  workers: number
  hashrate: string
}

interface MiningList {
  id: number
  user: string
  address: string
  hashrate: string
  balance: string
  amount: string
  type: 'CPU' | 'GPU'
  create: string
  state: 'offline' | 'online'
}

interface AddressTotalPower {
  cpu: Power[]
  gpu: Power[]
}

interface Power {
  time: string
  hashrate: string
  workers: number
}

interface RelativeInfo {
  LV1Count: number
  LV2Count: number
  LV1Amount: string
  LV2Amount: string
}

interface RelativeList {
  address: string
  amount: string
  LV2Amount: string
  LV2Total: number
  time: string
}


interface LastSignTime {
  amount: string;
  createAt: string;
}
