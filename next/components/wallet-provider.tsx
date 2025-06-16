"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

// Language type
export type Language = "zh" | "en" | "ru"

// Transaction type
type Transaction = {
  id: string
  from: string
  to: string
  amount: string
  timestamp: number
  type: "withdraw" | "mining" | "referral"
}

// Mining data type
type MiningData = {
  totalMined: string
  dailyRate: string
  lastMined: number
}

// Miner type
type Miner = {
  id: string
  name: string
  device: "CPU" | "GPU"
  hashrate: string
  totalMiningTime: string
  balance: string
  payments: string
  status: "online" | "offline"
}

// Hashrate data point
type HashrateDataPoint = {
  time: string
  hashrate: number
}

// Referral data type
type ReferralData = {
  code: string
  totalReferrals: number
  level1Count: number
  level2Count: number
  totalRewards: string
  level1Referrals: Array<{
    id: number
    userId: string
    date: string
    rewards: string
  }>
  level2Referrals: Array<{
    id: number
    userId: string
    date: string
    rewards: string
  }>
}

// Wallet context type
type WalletContextType = {
  userId: string
  walletAddress: string
  balance: string
  transactions: Transaction[]
  miningData: MiningData
  miners: Miner[]
  hashrateData: HashrateDataPoint[]
  referralData: ReferralData
  withdrawalAddress: string
  usedReferralCode: string
  isLoggedIn: boolean
  isWalletCreated: boolean
  language: Language
  login: (password: string) => Promise<boolean>
  logout: () => void
  createWallet: (password: string, referralCode?: string) => Promise<boolean>
  setWithdrawalAddress: (address: string) => void
  setWalletPassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  setReferralCode: (code: string) => Promise<boolean>
  setLanguage: (lang: Language) => void
  withdraw: (amount: string) => Promise<boolean>
  generateWalletAddress: () => string
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Generate unique ID helper function
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Generate wallet address from "machine code"
function generateWalletAddressFromMachineCode() {
  // In a real app, this should use some way to get a unique machine identifier
  // Here we use a mock implementation
  const mockMachineCode = navigator.userAgent + window.screen.width + window.screen.height

  // Create a simple hash
  let hash = 0
  for (let i = 0; i < mockMachineCode.length; i++) {
    const char = mockMachineCode.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Convert to BEP20-style address format
  const hashStr = Math.abs(hash).toString(16).padStart(40, "0")
  return "0x" + hashStr
}

// Generate hashrate data for the last 24 hours (48 data points, one every 30 minutes)
function generateHashrateData() {
  const data: HashrateDataPoint[] = []
  const now = new Date()

  for (let i = 0; i < 48; i++) {
    const time = new Date(now.getTime() - (47 - i) * 30 * 60 * 1000)
    const timeStr = time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0")

    // Generate a random hashrate between 80 and 120 MH/s with some trend
    const baseHashrate = 100
    const variation = Math.sin(i / 8) * 15
    const randomFactor = Math.random() * 10 - 5
    const hashrate = Math.max(80, Math.min(120, baseHashrate + variation + randomFactor))

    data.push({
      time: timeStr,
      hashrate: Math.round(hashrate * 10) / 10,
    })
  }

  return data
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>("user_" + generateId().substring(0, 8))
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [balance, setBalance] = useState<string>("0.00")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [withdrawalAddress, setWithdrawalAddressState] = useState<string>("")
  const [usedReferralCode, setUsedReferralCodeState] = useState<string>("")
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isWalletCreated, setIsWalletCreated] = useState<boolean>(false)
  const [language, setLanguageState] = useState<Language>("zh")
  const { toast } = useToast()

  // Mock password - in a real app, this should use encrypted storage
  const [password, setPassword] = useState<string>("")

  // Mining data
  const [miningData, setMiningData] = useState<MiningData>({
    totalMined: "0.00",
    dailyRate: "10.00",
    lastMined: Date.now(),
  })

  // Miners list
  const [miners, setMiners] = useState<Miner[]>([])

  // Hashrate data
  const [hashrateData, setHashrateData] = useState<HashrateDataPoint[]>([])

  // Referral data
  const [referralData, setReferralData] = useState<ReferralData>({
    code: userId.replace("user_", "REF"),
    totalReferrals: 0,
    level1Count: 0,
    level2Count: 0,
    totalRewards: "0.00",
    level1Referrals: [],
    level2Referrals: [],
  })

  // Check if wallet exists in local storage
  useEffect(() => {
    const storedWalletData = localStorage.getItem("walletData")
    if (storedWalletData) {
      try {
        const parsedData = JSON.parse(storedWalletData)
        setIsWalletCreated(true)
        // In a real app, you would validate the data and handle encryption
      } catch (error) {
        console.error("Failed to parse wallet data:", error)
      }
    }

    // Check for stored language preference, system language, or default to English
    const storedLanguage = localStorage.getItem("language") as Language
    if (storedLanguage && ["zh", "en", "ru"].includes(storedLanguage)) {
      setLanguageState(storedLanguage)
    } else {
      // Get system language
      const systemLang = navigator.language.toLowerCase().split('-')[0]
      // Check if system language is supported
      if (["zh", "en", "ru"].includes(systemLang)) {
        setLanguageState(systemLang as Language)
      } else {
        // Default to English if system language is not supported
        setLanguageState("en")
      }
    }
  }, [])

  // Generate wallet address
  const generateWalletAddress = () => {
    const address = generateWalletAddressFromMachineCode()
    setWalletAddress(address)
    return address
  }

  // Initialize wallet address
  useEffect(() => {
    if (!walletAddress && isWalletCreated) {
      generateWalletAddress()
    }
  }, [walletAddress, isWalletCreated])

  // Create wallet function
  const createWallet = async (newPassword: string, referralCode?: string): Promise<boolean> => {
    try {
      // In a real app, you would encrypt the password and store it securely
      setPassword(newPassword)

      // Generate wallet address
      const address = generateWalletAddress()

      // Set initial balance (with bonus if referral code is provided)
      const initialBalance = referralCode ? "100.00" : "0.00"
      setBalance(initialBalance)

      // Save referral code if provided
      if (referralCode) {
        setUsedReferralCodeState(referralCode)

        // Add referral bonus transaction
        const referralTransaction: Transaction = {
          id: generateId(),
          from: "referral",
          to: address,
          amount: "100.00",
          timestamp: Date.now(),
          type: "referral",
        }
        setTransactions([referralTransaction])
      }

      // Save wallet data to local storage
      // In a real app, this would be encrypted
      const walletData = {
        address,
        created: Date.now(),
        hasReferral: !!referralCode,
      }
      localStorage.setItem("walletData", JSON.stringify(walletData))

      setIsWalletCreated(true)
      setIsLoggedIn(true) // Auto login after creation
      loadUserData() // Load user data
      return true
    } catch (error) {
      console.error("Failed to create wallet:", error)
      return false
    }
  }

  // Login function
  const login = async (inputPassword: string): Promise<boolean> => {
    // In a real app, this would use encrypted verification
    if (inputPassword === password) {
      setIsLoggedIn(true)
      loadUserData() // Load user data

      const message = language === "zh" ? "登录成功" : language === "en" ? "Login successful" : "Вход выполнен успешно"
      const description = language === "zh" ? "欢迎回来！" : language === "en" ? "Welcome back!" : "Добро пожаловать!"

      toast({
        title: message,
        description: description,
      })
      return true
    } else {
      const message = language === "zh" ? "登录失败" : language === "en" ? "Login failed" : "Ошибка входа"
      const description =
        language === "zh"
          ? "密码错误，请重试"
          : language === "en"
            ? "Incorrect password, please try again"
            : "Неверный пароль, попробуйте еще раз"

      toast({
        title: message,
        description: description,
        variant: "destructive",
      })
      return false
    }
  }

  // Logout function
  const logout = () => {
    setIsLoggedIn(false)

    const message = language === "zh" ? "已登出" : language === "en" ? "Logged out" : "Выход выполнен"
    const description =
      language === "zh"
        ? "您已安全退出钱包"
        : language === "en"
          ? "You have safely logged out of your wallet"
          : "Вы безопасно вышли из кошелька"

    toast({
      title: message,
      description: description,
    })
  }

  // Set withdrawal address
  const setWithdrawalAddress = (address: string) => {
    setWithdrawalAddressState(address)

    const message =
      language === "zh" ? "提现地址已更新" : language === "en" ? "Withdrawal address updated" : "Адрес вывода обновлен"
    const description =
      language === "zh"
        ? "您的提现地址已成功设置"
        : language === "en"
          ? "Your withdrawal address has been successfully set"
          : "Ваш адрес вывода был успешно установлен"

    toast({
      title: message,
      description: description,
    })
  }

  // Set referral code (for users who didn't enter one during wallet creation)
  const setReferralCode = async (code: string): Promise<boolean> => {
    if (usedReferralCode) {
      const message =
        language === "zh"
          ? "无法设置邀请码"
          : language === "en"
            ? "Cannot set referral code"
            : "Невозможно установить реферальный код"
      const description =
        language === "zh"
          ? "您已经使用过邀请码"
          : language === "en"
            ? "You have already used a referral code"
            : "Вы уже использовали реферальный код"

      toast({
        title: message,
        description: description,
        variant: "destructive",
      })
      return false
    }

    // In a real app, you would verify the referral code with the server
    setUsedReferralCodeState(code)

    // Add bonus to balance
    setBalance((prev) => (Number.parseFloat(prev) + 100).toFixed(2))

    // Add referral transaction
    const referralTransaction: Transaction = {
      id: generateId(),
      from: "referral",
      to: walletAddress,
      amount: "100.00",
      timestamp: Date.now(),
      type: "referral",
    }
    setTransactions((prev) => [referralTransaction, ...prev])

    const message =
      language === "zh" ? "邀请码已设置" : language === "en" ? "Referral code set" : "Реферальный код установлен"
    const description =
      language === "zh"
        ? "您已获得100 KUNKUN奖励"
        : language === "en"
          ? "You have received a 100 KUNKUN bonus"
          : "Вы получили бонус 100 KUNKUN"

    toast({
      title: message,
      description: description,
    })

    return true
  }

  // Change wallet password
  const setWalletPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // In a real app, this would use encrypted verification and storage
    if (currentPassword === password) {
      setPassword(newPassword)

      const message = language === "zh" ? "密码已更新" : language === "en" ? "Password updated" : "Пароль обновлен"
      const description =
        language === "zh"
          ? "您的钱包密码已成功修改"
          : language === "en"
            ? "Your wallet password has been successfully changed"
            : "Пароль вашего кошелька был успешно изменен"

      toast({
        title: message,
        description: description,
      })
      return true
    } else {
      const message =
        language === "zh" ? "密码修改失败" : language === "en" ? "Password change failed" : "Ошибка изменения пароля"
      const description =
        language === "zh"
          ? "当前密码错误，请重试"
          : language === "en"
            ? "Current password is incorrect, please try again"
            : "Текущий пароль неверен, попробуйте еще раз"

      toast({
        title: message,
        description: description,
        variant: "destructive",
      })
      return false
    }
  }

  // Set language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)

    const message = lang === "zh" ? "语言已更新" : lang === "en" ? "Language updated" : "Язык обновлен"
    const description =
      lang === "zh" ? "已切换到中文" : lang === "en" ? "Switched to English" : "Переключено на русский"

    toast({
      title: message,
      description: description,
    })
  }

  // Withdraw function
  const withdraw = async (amount: string): Promise<boolean> => {
    const amountNum = Number.parseFloat(amount)

    if (isNaN(amountNum) || amountNum < 1000) {
      const message = language === "zh" ? "提现失败" : language === "en" ? "Withdrawal failed" : "Ошибка вывода"
      const description =
        language === "zh"
          ? "最小提现金额为1000 KUNKUN"
          : language === "en"
            ? "Minimum withdrawal amount is 1000 KUNKUN"
            : "Минимальная сумма вывода составляет 1000 KUNKUN"

      toast({
        title: message,
        description: description,
        variant: "destructive",
      })
      return false
    }

    if (amountNum > Number.parseFloat(balance)) {
      const message = language === "zh" ? "提现失败" : language === "en" ? "Withdrawal failed" : "Ошибка вывода"
      const description =
        language === "zh" ? "余额不足" : language === "en" ? "Insufficient balance" : "Недостаточный баланс"

      toast({
        title: message,
        description: description,
        variant: "destructive",
      })
      return false
    }

    if (!withdrawalAddress) {
      const message = language === "zh" ? "提现失败" : language === "en" ? "Withdrawal failed" : "Ошибка вывода"
      const description =
        language === "zh"
          ? "请先设置提现地址"
          : language === "en"
            ? "Please set a withdrawal address first"
            : "Пожалуйста, сначала установите адрес вывода"

      toast({
        title: message,
        description: description,
        variant: "destructive",
      })
      return false
    }

    // Update balance
    setBalance((prev) => (Number.parseFloat(prev) - amountNum).toFixed(2))

    // Add withdrawal transaction
    const withdrawTransaction: Transaction = {
      id: generateId(),
      from: walletAddress,
      to: withdrawalAddress,
      amount: amount,
      timestamp: Date.now(),
      type: "withdraw",
    }
    setTransactions((prev) => [withdrawTransaction, ...prev])

    const message = language === "zh" ? "提现成功" : language === "en" ? "Withdrawal successful" : "Вывод успешен"
    const description =
      language === "zh"
        ? `已提现 ${amount} KUNKUN`
        : language === "en"
          ? `Withdrawn ${amount} KUNKUN`
          : `Выведено ${amount} KUNKUN`

    toast({
      title: message,
      description: description,
    })

    return true
  }

  // Load user data (mock)
  const loadUserData = () => {
    // In a real app, this would load data from server or local storage

    // Mock balance (if not already set from wallet creation)
    if (balance === "0.00" && !usedReferralCode) {
      setBalance("1000.00")
    }

    // Mock transaction records (if not already set from wallet creation)
    if (transactions.length === 0) {
      setTransactions([
        {
          id: generateId(),
          from: "mining",
          to: walletAddress,
          amount: "200.00",
          timestamp: Date.now() - 86400000,
          type: "mining",
        },
        {
          id: generateId(),
          from: walletAddress,
          to: "0x1111111111111111111111111111111111111111",
          amount: "50.00",
          timestamp: Date.now() - 43200000,
          type: "withdraw",
        },
        {
          id: generateId(),
          from: "mining",
          to: walletAddress,
          amount: "300.00",
          timestamp: Date.now() - 21600000,
          type: "mining",
        },
        {
          id: generateId(),
          from: "referral",
          to: walletAddress,
          amount: "30.00",
          timestamp: Date.now() - 10800000,
          type: "referral",
        },
      ])
    }

    // Mock mining data
    setMiningData({
      totalMined: "500.00",
      dailyRate: "10.00",
      lastMined: Date.now() - 3600000,
    })

    // Mock miners list
    setMiners([
      {
        id: "miner1",
        name: "Worker 1",
        device: "CPU",
        hashrate: "45 MH/s",
        totalMiningTime: "120h 45m",
        balance: "8.5",
        payments: "150.0",
        status: "online",
      },
      {
        id: "miner2",
        name: "Worker 2",
        device: "GPU",
        hashrate: "120 MH/s",
        totalMiningTime: "85h 20m",
        balance: "12.0",
        payments: "200.0",
        status: "online",
      },
      {
        id: "miner3",
        name: "Worker 3",
        device: "GPU",
        hashrate: "95 MH/s",
        totalMiningTime: "45h 10m",
        balance: "5.5",
        payments: "100.0",
        status: "offline",
      },
    ])

    // Generate hashrate data
    setHashrateData(generateHashrateData())

    // Mock referral data
    setReferralData({
      code: userId.replace("user_", "REF"),
      totalReferrals: 5,
      level1Count: 3,
      level2Count: 2,
      totalRewards: "150.00",
      level1Referrals: [
        { id: 1, userId: "user_abc123", date: "2023-05-10", rewards: "30.00" },
        { id: 2, userId: "user_def456", date: "2023-05-15", rewards: "25.00" },
        { id: 3, userId: "user_ghi789", date: "2023-05-20", rewards: "20.00" },
      ],
      level2Referrals: [
        { id: 4, userId: "user_jkl012", date: "2023-05-12", rewards: "15.00" },
        { id: 5, userId: "user_mno345", date: "2023-05-18", rewards: "10.00" },
      ],
    })
  }

  const value = {
    userId,
    walletAddress,
    balance,
    transactions,
    miningData,
    miners,
    hashrateData,
    referralData,
    withdrawalAddress,
    usedReferralCode,
    isLoggedIn,
    isWalletCreated,
    language,
    login,
    logout,
    createWallet,
    setWithdrawalAddress,
    setWalletPassword,
    setReferralCode,
    setLanguage,
    withdraw,
    generateWalletAddress,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
