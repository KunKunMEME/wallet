import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WalletStore {
  label: string
  address: string
  key: string
  balance: string
  password: string
  referralAddress: string
  chainAddress: string
  setLabel: (label: string) => void
  setAddress: (address: string) => void
  setKey: (key: string) => void
  setBalance: (balance: string) => void
  setPassword: (password: string) => void
  setReferralAddress: (referralAddress: string) => void
  setChainAddress: (chainAddress: string) => void
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      label: '',
      address: '',
      key: '',
      balance: '0',
      password: '',
      referralAddress: '',
      chainAddress: '',
      setLabel: (label: string) => set({ label }),
      setAddress: (address: string) => set({ address }),
      setKey: (key: string) => set({ key }),
      setBalance: (balance: string) => set({ balance }),
      setPassword: (password: string) => set({ password }),
      setReferralAddress: (referralAddress: string) => set({ referralAddress }),
      setChainAddress: (chainAddress: string) => set({ chainAddress })
    }),
    {
      name: 'wallet-store'
    }
  )
)

export const useWalletStatus = create<{
  isLock: boolean
  setIsLock: (isLock: boolean) => void
}>((set) => ({
  isLock: true,
  setIsLock: (isLock: boolean) => set({ isLock })
}))
