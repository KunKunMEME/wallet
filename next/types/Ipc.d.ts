interface IPC {
  getDelay: () => number

  getNewAddress: (label?: string) => { address: string; walletKey: string; label: string }

  validateAddress: (address: string) => boolean

  MD5: (str: string, key: string) => string
}
