'use client'

import { useWallet } from '@/components/wallet-provider'
import type { Language } from '@/components/wallet-provider'

// Translation dictionary
const translations: Record<string, Record<Language, string>> = {
  games: {
    en: 'Games',
    zh: '游戏',
    ru: 'Игры'
  },
  p2pUnlinked: {
    en: 'P2P unlinked',
    zh: 'P2P 未连接',
    ru: 'P2P не связан'
  },
  paid: {
    en: 'Paid',
    zh: '已支付',
    ru: 'Оплачен'
  },
  invalidAddress: {
    en: 'Invalid address',
    zh: '无效的地址',
    ru: 'Недействительный адрес'
  },
  addressUpdated: {
    en: 'Address updated',
    zh: '地址已更新',
    ru: 'Адрес обновлен'
  },
  total: {
    en: 'Total',
    zh: '共',
    ru: 'Всего'
  },
  records: {
    en: 'Records',
    zh: '条',
    ru: 'записей'
  },
  previous: {
    en: 'Previous',
    zh: '上一页',
    ru: 'Предыдущая'
  },
  next: {
    en: 'Next',
    zh: '下一页',
    ru: 'Следующая'
  },
  error: {
    en: 'Error',
    zh: '错误',
    ru: 'Ошибка'
  },
  success: {
    en: 'Success',
    zh: '成功',
    ru: 'Успешно'
  },
  invalidReferralCode: {
    en: 'Invalid referral code',
    zh: '无效的邀请码',
    ru: 'Недействительный реферальный код'
  },
  referralCodeApplied: {
    en: 'Referral code applied',
    zh: '邀请码已成功应用',
    ru: 'Реферальный код успешно применен'
  },
  // Common
  wallet: {
    en: 'Wallet',
    zh: '钱包',
    ru: 'Кошелек'
  },
  home: {
    en: 'Home',
    zh: '主页',
    ru: 'Главная'
  },
  mining: {
    en: 'Mining',
    zh: '挖矿详情',
    ru: 'Майнинг'
  },
  referrals: {
    en: 'Referrals',
    zh: '推荐人数',
    ru: 'Рефералы'
  },
  settings: {
    en: 'Settings',
    zh: '账号设置',
    ru: 'Настройки'
  },
  logout: {
    en: 'Logout',
    zh: '退出登录',
    ru: 'Выйти'
  },
  people: {
    en: 'people',
    zh: '人',
    ru: 'человек'
  },
  copied: {
    en: 'Copied',
    zh: '已复制',
    ru: 'Скопировано'
  },
  referralCodeCopied: {
    en: 'Referral code copied to clipboard',
    zh: '推荐码已复制到剪贴板',
    ru: 'Реферальный код скопирован в буфер обмена'
  },
  referralLinkCopied: {
    en: 'Referral link copied to clipboard',
    zh: '推荐链接已复制到剪贴板',
    ru: 'Реферальная ссылка скопирована в буфер обмена'
  },
  from: {
    en: 'From',
    zh: '来自',
    ru: 'От'
  },
  to: {
    en: 'To',
    zh: '到',
    ru: 'На'
  },
  fromSystem: {
    en: 'From system',
    zh: '来自系统',
    ru: 'От системы'
  },
  noTransactions: {
    en: 'No transactions yet',
    zh: '暂无交易记录',
    ru: 'Пока нет транзакций'
  },
  received: {
    en: 'Received',
    zh: '收到',
    ru: 'Получено'
  },
  sent: {
    en: 'Sent',
    zh: '发送',
    ru: 'Отправлено'
  },
  processing: {
    en: 'Processing...',
    zh: '处理中...',
    ru: 'Обработка...'
  },
  noWithdrawalAddress: {
    en: 'No withdrawal address set',
    zh: '未设置提现地址',
    ru: 'Адрес вывода не установлен'
  },
  last24Hours: {
    en: 'Last 24 hours',
    zh: '最近24小时',
    ru: 'Последние 24 часа'
  },
  minerInstructions: {
    en: 'Download and install the mining software, then enter your wallet address to start mining KUNKUN tokens.',
    zh: '下载并安装挖矿软件，然后输入您的钱包地址开始挖掘KUNKUN代币。',
    ru: 'Загрузите и установите программное обеспечение для майнинга, затем введите адрес вашего кошелька, чтобы начать майнинг токенов KUNKUN.'
  },
  referralBonusExplanation: {
    en: "For each new user you refer, you'll earn 10% of their mining rewards. Level 2 referrals earn you 5% rewards.",
    zh: '每推荐一位新用户，您将获得他们挖矿收益的 10% 作为奖励。二级推荐可获得 5% 的奖励。',
    ru: 'За каждого нового пользователя, которого вы пригласите, вы получите 10% от их вознаграждений за майнинг. Рефералы 2-го уровня приносят вам 5% вознаграждения.'
  },
  alreadyUsedReferralCode: {
    en: 'You have already used a referral code',
    zh: '您已经使用过邀请码',
    ru: 'Вы уже использовали реферальный код'
  },
  account: {
    en: 'Account',
    zh: '账户',
    ru: 'Аккаунт'
  },
  withdrawal: {
    en: 'Withdrawal',
    zh: '提现',
    ru: 'Вывод'
  },
  referral: {
    en: 'Referral',
    zh: '推荐',
    ru: 'Реферал'
  },
  termsAndConditions: {
    en: 'By creating a wallet, you agree to our Terms of Service and Privacy Policy',
    zh: '创建钱包即表示您同意我们的服务条款和隐私政策',
    ru: 'Создавая кошелек, вы соглашаетесь с нашими Условиями использования и Политикой конфиденциальности'
  },
  walletCreated: {
    en: 'Wallet Created',
    zh: '钱包创建成功',
    ru: 'Кошелек создан'
  },
  referralBonusReceived: {
    en: 'You have received a 2,333 KUNKUN bonus',
    zh: '您已获得 2,333 KUNKUN奖励',
    ru: 'Вы получили бонус 2,333 KUNKUN'
  },
  walletCreatedSuccessfully: {
    en: 'Wallet has been successfully created',
    zh: '钱包已成功创建',
    ru: 'Кошелек успешно создан'
  },
  walletCreationFailed: {
    en: 'Failed to create wallet, please try again',
    zh: '创建钱包失败，请重试',
    ru: 'Не удалось создать кошелек, попробуйте еще раз'
  },

  // Login & Create Wallet
  createWallet: {
    en: 'Create Wallet',
    zh: '创建钱包',
    ru: 'Создать кошелек'
  },
  setYourPassword: {
    en: 'Set your wallet password and referral code',
    zh: '设置您的钱包密码和邀请码',
    ru: 'Установите пароль кошелька и реферальный код'
  },
  walletPassword: {
    en: 'Wallet Password',
    zh: '钱包密码',
    ru: 'Пароль кошелька'
  },
  confirmPassword: {
    en: 'Confirm Password',
    zh: '确认密码',
    ru: 'Подтвердите пароль'
  },
  referralCode: {
    en: 'Referral Code (Optional)',
    zh: '邀请码 (选填)',
    ru: 'Реферальный код (необязательно)'
  },
  referralBonus: {
    en: 'Enter a referral code to get 2,333 KUNKUN bonus',
    zh: '填入邀请码可获得 2,333 KUNKUN奖励',
    ru: 'Введите реферальный код, чтобы получить бонус 2,333 KUNKUN'
  },
  creating: {
    en: 'Creating...',
    zh: '创建中...',
    ru: 'Создание...'
  },
  enterPasswordToLogin: {
    en: 'Please enter your wallet password to login',
    zh: '请输入您的钱包密码登录',
    ru: 'Пожалуйста, введите пароль кошелька для входа'
  },
  enterYourPassword: {
    en: 'Enter your password',
    zh: '输入您的密码',
    ru: 'Введите ваш пароль'
  },
  loggingIn: {
    en: 'Logging in...',
    zh: '登录中...',
    ru: 'Вход...'
  },
  login: {
    en: 'Login',
    zh: '登录',
    ru: 'Войти'
  },

  // Home
  currentBalance: {
    en: 'Current Balance',
    zh: '当前余额',
    ru: 'Текущий баланс'
  },
  yourTokenBalance: {
    en: 'Your KUNKUN token balance',
    zh: '您的KUNKUN代币余额',
    ru: 'Ваш баланс токенов KUNKUN'
  },
  withdraw: {
    en: 'Withdraw',
    zh: '提现',
    ru: 'Вывести'
  },
  transactionHistory: {
    en: 'Transaction History',
    zh: '交易记录',
    ru: 'История транзакций'
  },
  recentTransactions: {
    en: 'Recent transaction history',
    zh: '最近的交易历史',
    ru: 'Недавняя история транзакций'
  },

  // Mining
  totalMined: {
    en: 'Total Mined',
    zh: '总挖矿量',
    ru: 'Всего добыто'
  },

  unpaid: {
    en: 'unpaid',
    zh: '待支付',
    ru: 'Собрано'
  },

  dailyRate: {
    en: 'Daily Rate',
    zh: '日产量',
    ru: 'Дневная ставка'
  },
  lastMined: {
    en: 'Last Mined',
    zh: '上次挖矿',
    ru: 'Последний майнинг'
  },
  minerList: {
    en: 'Miner List',
    zh: '矿工列表',
    ru: 'Список майнеров'
  },
  name: {
    en: 'Name',
    zh: '名字',
    ru: 'Имя'
  },
  device: {
    en: 'Device',
    zh: '挖矿设备',
    ru: 'Устройство'
  },
  hashrate: {
    en: 'Hashrate',
    zh: '算力',
    ru: 'Хешрейт'
  },
  totalMiningTime: {
    en: 'Total Mining Time',
    zh: '挖矿总时长',
    ru: 'Общее время майнинга'
  },
  balance: {
    en: 'Balance',
    zh: '余额',
    ru: 'Баланс'
  },
  payments: {
    en: 'Payments',
    zh: '支付',
    ru: 'Платежи'
  },
  status: {
    en: 'Status',
    zh: '状态',
    ru: 'Статус'
  },
  online: {
    en: 'Online',
    zh: '在线',
    ru: 'Онлайн'
  },
  offline: {
    en: 'Offline',
    zh: '离线',
    ru: 'Оффлайн'
  },
  downloadMiner: {
    en: 'Download Mining Software',
    zh: '下载挖矿软件',
    ru: 'Скачать программу для майнинга'
  },
  downloadMinerDesc: {
    en: 'Download our mining software to start earning KUNKUN tokens',
    zh: '下载我们的挖矿软件开始赚取KUNKUN代币',
    ru: 'Скачайте наше программное обеспечение для майнинга, чтобы начать зарабатывать токены KUNKUN'
  },
  downloadForWindows: {
    en: 'Download for Windows',
    zh: 'Windows版下载',
    ru: 'Скачать для Windows'
  },
  downloadForMac: {
    en: 'Download for Mac',
    zh: 'Mac版下载',
    ru: 'Скачать для Mac'
  },
  downloadForLinux: {
    en: 'Download for Linux',
    zh: 'Linux版下载',
    ru: 'Скачать для Linux'
  },
  hashrateChart: {
    en: '24-Hour Hashrate Chart',
    zh: '24小时算力统计图',
    ru: 'График хешрейта за 24 часа'
  },
  miningCommandGenerator: {
    en: 'Mining Command Generator',
    zh: '挖矿命令生成器',
    ru: 'Генератор команд для майнинга'
  },
  deviceType: {
    en: 'Device Type',
    zh: '设备类型',
    ru: 'Тип устройства'
  },
  minerSoftware: {
    en: 'Miner Software',
    zh: '挖矿软件',
    ru: 'Программа для майнинга'
  },
  difficulty: {
    en: 'Difficulty',
    zh: '难度',
    ru: 'Сложность'
  },
  lowDifficulty: {
    en: 'Low Difficulty',
    zh: '低难度',
    ru: 'Низкая сложность'
  },
  highDifficulty: {
    en: 'High Difficulty',
    zh: '高难度',
    ru: 'Высокая сложность'
  },
  workerName: {
    en: 'Worker Name',
    zh: '矿工名称',
    ru: 'Имя воркера'
  },
  generateCommand: {
    en: 'Generate Command',
    zh: '生成命令',
    ru: 'Сгенерировать команду'
  },
  miningCommand: {
    en: 'Mining Command',
    zh: '挖矿命令',
    ru: 'Команда для майнинга'
  },
  commandCopied: {
    en: 'Command copied to clipboard',
    zh: '命令已复制到剪贴板',
    ru: 'Команда скопирована в буфер обмена'
  },
  poolAddress: {
    en: 'Pool Address',
    zh: '矿池地址',
    ru: 'Адрес пула'
  },
  software: {
    en: 'Software',
    zh: '软件',
    ru: 'Программное обеспечение'
  },
  gpuCards: {
    en: 'GPU Cards',
    zh: '显卡',
    ru: 'Видеокарты'
  },

  // Referrals
  totalReferrals: {
    en: 'Total Referrals',
    zh: '总推荐人数',
    ru: 'Всего рефералов'
  },
  referralRewards: {
    en: 'Referral Rewards',
    zh: '推荐奖励',
    ru: 'Реферальные вознаграждения'
  },
  referralRewardsList: {
    en: 'Referral Rewards List',
    zh: '推荐人数列表',
    ru: 'Список вознаграждений рефералов'
  },
  myReferralCode: {
    en: 'My Referral Code',
    zh: '我的推荐码',
    ru: 'Мой реферальный код'
  },
  shareReferralLink: {
    en: 'Share Your Referral Link',
    zh: '分享您的推荐链接',
    ru: 'Поделитесь своей реферальной ссылкой'
  },
  inviteFriends: {
    en: 'Invite friends and earn rewards',
    zh: '邀请朋友加入并获得奖励',
    ru: 'Пригласите друзей и получите вознаграждение'
  },
  share: {
    en: 'Share',
    zh: '分享',
    ru: 'Поделиться'
  },
  level1Referrals: {
    en: 'Level 1 Referrals',
    zh: '一级推荐',
    ru: 'Рефералы 1-го уровня'
  },
  level2Referrals: {
    en: 'Level 2 Referrals',
    zh: '二级推荐',
    ru: 'Рефералы 2-го уровня'
  },
  userId: {
    en: 'Wallet Address',
    zh: '钱包地址',
    ru: 'Адрес кошелька'
  },
  discordBound: {
    en: 'Discord account bound',
    zh: 'Discord账号已绑定',
    ru: 'Аккаунт Discord привязан'
  },
  discordUnbound: {
    en: 'Discord account not bound',
    zh: 'Discord账号未绑定',
    ru: 'Аккаунт Discord не привязан'
  },
  discordManagement: {
    en: 'Discord Account Management',
    zh: 'Discord账号管理',
    ru: 'Управление аккаунтом Discord'
  },
  discordBindStatus: {
    en: 'Discord Binding Status',
    zh: 'Discord绑定状态',
    ru: 'Статус привязки Discord'
  },
  unbindDiscord: {
    en: 'Unbind Discord',
    zh: '解除Discord绑定',
    ru: 'Отвязать Discord'
  },
  confirmUnbindDiscord: {
    en: 'Are you sure you want to unbind your Discord account?',
    zh: '确定要解除Discord账号绑定吗？',
    ru: 'Вы уверены, что хотите отвязать свой аккаунт Discord?'
  },
  discordUnbindSuccess: {
    en: 'Discord account unbound successfully',
    zh: 'Discord账号解绑成功',
    ru: 'Аккаунт Discord успешно отвязан'
  },
  bindDiscordGuide: {
    en: 'Go to Discord and bind your account',
    zh: '前往Discord绑定您的账号',
    ru: 'Перейдите в Discord и привяжите свой аккаунт'
  },
  bindDiscordDescription: {
    en: 'Join our Discord server and use the bot command to bind your wallet',
    zh: '加入我们的Discord服务器并使用机器人命令绑定您的钱包',
    ru: 'Присоединяйтесь к нашему серверу Discord и используйте команду бота для привязки кошелька'
  },
  joinDiscord: {
    en: 'Join Discord',
    zh: '加入Discord',
    ru: 'Присоединиться к Discord'
  },
  registrationDate: {
    en: 'Registration Date',
    zh: '注册日期',
    ru: 'Дата регистрации'
  },
  rewards: {
    en: 'Rewards',
    zh: '奖励',
    ru: 'Вознаграждения'
  },

  // Settings
  withdrawalAddress: {
    en: 'Withdrawal Address',
    zh: '提币地址',
    ru: 'Адрес вывода'
  },
  setWithdrawalAddress: {
    en: 'Set your BEP20 withdrawal address',
    zh: '设置您的BEP20提币地址',
    ru: 'Установите адрес вывода BEP20'
  },
  bep20Address: {
    en: 'BEP20 Address',
    zh: 'BEP20 地址',
    ru: 'Адрес BEP20'
  },
  save: {
    en: 'Save',
    zh: '保存',
    ru: 'Сохранить'
  },
  addressSaved: {
    en: 'Address saved',
    zh: '地址已保存',
    ru: 'Адрес сохранен'
  },
  caution: {
    en: 'Caution',
    zh: '注意',
    ru: 'Внимание'
  },
  cautionText: {
    en: 'Make sure you enter the correct BEP20 address. Incorrect addresses may result in permanent loss of assets.',
    zh: '请确保输入正确的BEP20地址。错误的地址可能导致资产永久丢失。',
    ru: 'Убедитесь, что вы ввели правильный адрес BEP20. Неправильные адреса могут привести к безвозвратной потере активов.'
  },
  changePassword: {
    en: 'Change Password',
    zh: '修改密码',
    ru: 'Изменить пароль'
  },
  setOrChangePassword: {
    en: 'Set or change your wallet password',
    zh: '设置或修改您的钱包密码',
    ru: 'Установите или измените пароль кошелька'
  },
  currentPassword: {
    en: 'Current Password',
    zh: '当前密码',
    ru: 'Текущий пароль'
  },
  newPassword: {
    en: 'New Password',
    zh: '新密码',
    ru: 'Новый пароль'
  },
  confirmNewPassword: {
    en: 'Confirm New Password',
    zh: '确认新密码',
    ru: 'Подтвердите новый пароль'
  },
  updatePassword: {
    en: 'Update Password',
    zh: '更新密码',
    ru: 'Обновить пароль'
  },
  updating: {
    en: 'Updating...',
    zh: '更新中...',
    ru: 'Обновление...'
  },
  passwordUpdated: {
    en: 'Password updated',
    zh: '密码已更新',
    ru: 'Пароль обновлен'
  },
  passwordNote: {
    en: 'Passwords are used to secure your wallet. Use a strong password and keep it safe, as forgotten passwords cannot be recovered.',
    zh: '密码用于保护您的钱包安全。请使用强密码并妥善保管，忘记密码将无法找回。',
    ru: 'Пароли используются для защиты вашего кошелька. Используйте надежный пароль и храните его в безопасности, так как забытые пароли не могут быть восстановлены.'
  },
  language: {
    en: 'Language',
    zh: '语言',
    ru: 'Язык'
  },
  selectLanguage: {
    en: 'Select your preferred language',
    zh: '选择您偏好的语言',
    ru: 'Выберите предпочитаемый язык'
  },
  english: {
    en: 'English',
    zh: '英文',
    ru: 'Английский'
  },
  chinese: {
    en: 'Chinese',
    zh: '中文',
    ru: 'Китайский'
  },
  russian: {
    en: 'Russian',
    zh: '俄罗斯语',
    ru: 'Русский'
  },
  usedReferralCode: {
    en: 'Used Referral Code',
    zh: '已使用的邀请码',
    ru: 'Использованный реферальный код'
  },
  enterReferralCode: {
    en: 'Enter a referral code to get 2,333 KUNKUN bonus',
    zh: '输入邀请码获得 2,333 KUNKUN奖励',
    ru: 'Введите реферальный код, чтобы получить бонус 2,333 KUNKUN'
  },
  apply: {
    en: 'Apply',
    zh: '应用',
    ru: 'Применить'
  },

  // Withdrawal
  withdrawalConfirmation: {
    en: 'Withdrawal Confirmation',
    zh: '提现确认',
    ru: 'Подтверждение вывода'
  },
  withdrawalAmount: {
    en: 'Withdrawal Amount',
    zh: '提现金额',
    ru: 'Сумма вывода'
  },
  minimumWithdrawal: {
    en: 'Minimum withdrawal amount is 10,000 KUNKUN',
    zh: '最小提现金额为10,000 KUNKUN',
    ru: 'Минимальная сумма вывода составляет 10,000 KUNKUN'
  },
  cancel: {
    en: 'Cancel',
    zh: '取消',
    ru: 'Отмена'
  },
  confirm: {
    en: 'Confirm',
    zh: '确认',
    ru: 'Подтвердить'
  },
  addressFormatError: {
    en: 'Address format error',
    zh: '地址格式错误',
    ru: 'Ошибка формата адреса'
  },
  enterValidBep20Address: {
    en: 'Please enter a valid BEP20 address format',
    zh: '请输入有效的BEP20地址格式',
    ru: 'Пожалуйста, введите действительный формат адреса BEP20'
  },
  pleaseEnterCurrentPassword: {
    en: 'Please enter your current password',
    zh: '请输入当前密码',
    ru: 'Пожалуйста, введите ваш текущий пароль'
  },
  passwordMinLength: {
    en: 'New password must be at least 8 characters',
    zh: '新密码长度至少为8位',
    ru: 'Новый пароль должен содержать не менее 8 символов'
  },
  passwordsDoNotMatch: {
    en: 'Passwords do not match',
    zh: '两次输入的密码不一致',
    ru: 'Пароли не совпадают'
  },
  walletAddress: {
    en: 'Wallet Address',
    zh: '钱包地址',
    ru: 'Адрес кошелька'
  },
  loginFailed: {
    en: 'Login failed',
    zh: '登录失败',
    ru: 'Ошибка входа'
  },
  incorrectPassword: {
    en: 'Incorrect password, please try again',
    zh: '密码错误，请重试',
    ru: 'Неверный пароль, попробуйте еще раз'
  },
  sign: {
    en: 'Sign In',
    zh: '签到',
    ru: 'Отметиться'
  },
  signDays: {
    en: 'Days Signed',
    zh: '签到天数',
    ru: 'Дней отмечено'
  },
  signCooldown: {
    en: 'Sign-in Cooldown',
    zh: '签到冷却时间',
    ru: 'Перерыв между отметками'
  },
  canSignAgain: {
    en: 'You can sign in again',
    zh: '可以再次签到',
    ru: 'Вы можете отметиться снова'
  },
  nextSignIn: {
    en: 'Next sign-in available in',
    zh: '下次签到可用时间',
    ru: 'Следующая отметка доступна через'
  },
  signVerification: {
    en: 'Sign-in Verification',
    zh: '签到验证',
    ru: 'Проверка отметки'
  },
  enterSignVerification: {
    en: 'Please enter "I love Kunkun" to confirm sign-in',
    zh: '请输入"I love Kunkun"以确认签到',
    ru: 'Пожалуйста, введите "I love Kunkun" для подтверждения'
  },
  verification: {
    en: 'Verification',
    zh: '验证',
    ru: 'Проверка'
  },
  invalidSignVerification: {
    en: 'Please enter the correct verification text',
    zh: '请输入正确的验证文本',
    ru: 'Пожалуйста, введите правильный текст для проверки'
  }
}

export function useTranslation() {
  const { language } = useWallet()

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    return translations[key][language] || translations[key].en
  }

  return { t }
}
