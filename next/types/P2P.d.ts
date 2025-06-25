interface P2P {
  encPassword: (password: string) => string
  getBalance: (address: string, key: string) => Promise<{ address: string; amount: string; discordId: string }>
  setRelativeAddress: (address: string, key: string, relativeAddress: string) => Promise<boolean>
  getTransfer: (address: string, page: number, pageSize: number) => Promise<Page<TransferItem>>
  getRelativeInfo: (address: string) => Promise<RelativeInfo>
  getRelativeList: (address: string, page: number, pageSize: number) => Promise<Page<RelativeList>>
  payChain: (walletKey: string, amount: string, address: string) => Promise<{ txHash: string }>
  getMiningInfo: (address: string) => Promise<MiningInfoP2P>
  getMiningList: (address: string, page: number, pageSize: number) => Promise<Page<MiningList>>
  getAddressTotalPower: (address: string, date?: string) => Promise<AddressTotalPower>
  walletSign: (address: string, key: string) => Promise<void>
  getLastSignTime: (address: string) => Promise<LastSignTime>
  unbindDiscordId: (key: string, address: string) => Promise<{}>
}
