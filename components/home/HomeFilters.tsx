'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { MotionButton } from '../ui/button'
import { HomePageFilters } from '@/constants/filters'
import { useState } from 'react'
import { setQueriedUrl } from '@/lib/utils'

function HomeFilters() {
  const searchParams = useSearchParams()
  const params = searchParams.toString()
  const router = useRouter()

  const [active, setActive] = useState('')
  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive('')
      const newUrl = setQueriedUrl({
        params: params,
        keys: ['filter'],
        search: null
      })
      router.push(newUrl, { scroll: false })
    } else {
      setActive(item)
      const newUrl = setQueriedUrl({
        params: params,
        keys: ['filter'],
        search: item.toLowerCase()
      })
      router.push(newUrl, { scroll: false })
    }
  }

  return (
    <div className="mt-2.5  hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <MotionButton
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${active === item.value ? 'bg-primary-100 text-primary-500' : 'bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300 cursor-pointer'}`}
        >
          {item.name}
        </MotionButton>
      ))}
    </div>
  )
}

export default HomeFilters
