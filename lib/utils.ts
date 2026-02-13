/* eslint-disable @typescript-eslint/no-explicit-any */
import { BADGE_CRITERIA } from '@/constants'
import { BadgeCounts } from '@/types'
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

export function getJoinedMonthYear(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

// handle the query params
interface setQueriedUrlsProps {
  params: string
  keys: string[]
  search?: string | null
}
export function setQueriedUrl({ params, keys, search }: setQueriedUrlsProps): string {
  const urlParams = new URLSearchParams(params)
  if (search) {
    urlParams.set(keys[0], search || '')
  } else {
    urlParams.delete(keys[0])
  }

  return window.location.pathname + '?' + urlParams.toString()
}

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA
    count: number
  }[]
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0
  }
  const { criteria } = params

  criteria.forEach((item) => {
    const { type, count } = item
    const badgeLevels: any = BADGE_CRITERIA[type]

    for (const key in badgeLevels) {
      if (!Object.hasOwn(badgeLevels, key)) continue

      if (count >= badgeLevels[key]) {
        badgeCounts[key as keyof BadgeCounts] += 1
      }
    }
  })
  return badgeCounts
}
