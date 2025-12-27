import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTimeStamp(createdAt: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - createdAt.getTime()

  const seconds = Math.floor(diffInMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) {
    return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`
  }

  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''} ago`
  }

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  }

  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }

  if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`
  }

  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} ago`
  }

  return `${years} year${years !== 1 ? 's' : ''} ago`
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    const result = value / 1_000_000
    return `${removeTrailingZero(result)}M`
  }

  if (value >= 1_000) {
    const result = value / 1_000
    return `${removeTrailingZero(result)}K`
  }

  return value.toString()
}

function removeTrailingZero(num: number): string {
  return num % 1 === 0 ? num.toString() : num.toFixed(1)
}
