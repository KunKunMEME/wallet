import { clsx, type ClassValue } from "clsx"
import Decimal from "decimal.js"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function calculateChange(newValue: string | number, oldValue: string | number) {
  const newVal = parseFloat(String(newValue)) || 0
  const oldVal = parseFloat(String(oldValue)) || 0

  if (oldVal === 0) return { change: '+0.0%', changeType: 'neutral' }

  const changePercent = ((newVal - oldVal) / oldVal) * 100
  const changeFormatted = changePercent.toFixed(1)
  const changeType = changePercent >= 0 ? 'positive' : 'negative'
  const prefix = changePercent >= 0 ? '+' : ''

  return {
    change: `${prefix}${changeFormatted}%`,
    changeType: changeType
  }
}

export function formatNumberWithUnit(number: number | string, fixed = 3, isArr = false): string | [string, string] {
  if (typeof number == 'string') number = parseFloat(number)
  if (!number && number !== 0) return ''

  let arr: [string, string] = ['0', ''] 
  if (number >= 1000000000000000) {
    arr[0] = (number / 1000000000000000).toFixed(fixed)
    arr[1] = 'P'
  } else if (number >= 1000000000000) {
    arr[0] = (number / 1000000000000).toFixed(fixed)
    arr[1] = 'T'
  } else if (number >= 1000000000) {
    arr[0] = (number / 1000000000).toFixed(fixed)
    arr[1] = 'G'
  } else if (number >= 1000000) {
    arr[0] = (number / 1000000).toFixed(fixed)
    arr[1] = 'M'
  } else if (number >= 1000) {
    arr[0] = (number / 1000).toFixed(fixed)
    arr[1] = 'K'
  } else {
    arr[0] = number.toFixed(fixed)
    arr[1] = ''
  }

  if (isArr) return arr
  return `${arr[0]} ${arr[1]}`
}

export type Unit = 'H/s' | 'KH/s' | 'MH/s' | 'GH/s' | 'TH/s' | 'PH/s'

const unitMap: Record<Unit, number> = {
  'H/s': 1,
  'KH/s': 1e3,
  'MH/s': 1e6,
  'GH/s': 1e9,
  'TH/s': 1e12,
  'PH/s': 1e15
}

export function convertValue(value: number | string, fromUnit: Unit, toUnit: Unit = 'MH/s', precision = 6): number {
  const fromUnitValue = unitMap[fromUnit]
  const toUnitValue = unitMap[toUnit]

  if (fromUnitValue === undefined || toUnitValue === undefined) {
    throw new Error('Unsupported unit')
  }

  const decimalValue = new Decimal(value)
  // Convert the value to the base unit (H/s) and then to the target unit
  const baseValue = decimalValue.times(fromUnitValue) // Convert to base unit (H/s)
  const convertedValue = baseValue.dividedBy(toUnitValue) // Convert from base unit to target unit

  return Number(convertedValue.toFixed(precision))
}

export function formatNumberWithCommas(input: number | string): string {
  const num = typeof input === 'string' ? parseFloat(input) : input
  if (isNaN(num)) return '0'

 
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0]
}

export function toLocaleString(value: number | string, fixed = 2) {
  if (typeof value === 'string') {
    value = Number(value)
  }

  return Number(value.toFixed(fixed)).toLocaleString()
}


/**
 * 将时间字符串转换为 "MM/DD HH:mm" 格式，分钟只保留为 00 或 30
 * @param timeStr - 如 "2025-06-04T08:26:00Z" 或 "2025-06-04 08:26:00"
 * @returns 形如 "6/4 08:30"
 */
export function formatTimeToMonthDayHourMinute(timeStr: string): string {
  const date = new Date(timeStr)
  if (isNaN(date.getTime())) throw new Error('Invalid date string')

  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()

  const minutes = date.getMinutes()
  const roundedMinutes = minutes < 15 ? '00' : minutes < 45 ? '30' : '00'
  const adjustedHour = minutes >= 45 ? hour + 1 : hour

  
  const hourStr = adjustedHour.toString().padStart(2, '0')

  return `${month}/${day} ${hourStr}:${roundedMinutes}`
}
