'use client'
import { Button } from '@/components/ui/button'
import { GlobalSearchFilters } from '@/constants/filters'
import { setQueriedUrl } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

function GlobalFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const typeParams = searchParams.get('type')

  const [active, setActive] = useState(typeParams || '')
  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive('')
      const newUrl = setQueriedUrl({
        params: searchParams.toString(),
        keys: ['type'],
        search: null
      })
      router.push(newUrl, { scroll: false })
    } else {
      setActive(item)
      const newUrl = setQueriedUrl({
        params: searchParams.toString(),
        keys: ['type'],
        search: item.toLowerCase()
      })
      router.push(newUrl, { scroll: false })
    }
  }

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type: </p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <Button
            key={item.value}
            type="button"
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 hover:text-primary-500 hover:bg-light-700 dark:hover:text-primary-500 ${active === item.value ? 'bg-primary-500 text-light-900' : 'bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500'}`}
            onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default GlobalFilters
