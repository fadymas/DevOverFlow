'use client'
import { Input } from '@/components/ui/input'
import { setQueriedUrl } from '@/lib/utils'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useDeferredValue, useEffect, useState } from 'react'

interface CustomInputProps {
  route: string
  iconPosition: string
  imgSrc: string
  placeholder: string
  otherClasses?: string
}
function LocalSearch({ route, iconPosition, imgSrc, placeholder, otherClasses }: CustomInputProps) {
  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()
  const params = searchParams.toString()

  const query = searchParams.get('q')
  const [search, setSearch] = useState(query || '')
  const defferedSearch = useDeferredValue(search)

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      const newUrl = setQueriedUrl({
        params: params,
        keys: ['q'],
        search: defferedSearch
      })
      router.push(newUrl)
    }, 300)

    return () => clearTimeout(debounceSearch)
  }, [defferedSearch, router, params])
  return (
    <div
      className={`background-light800_darkgradient flex min-h-14 grow items-center gap-5 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === 'left' && (
        <Image src={imgSrc} alt="search icon" width={24} height={24} className="cursor-pointer" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
      />
      {iconPosition === 'right' && (
        <Image src={imgSrc} alt="search icon" width={24} height={24} className="cursor-pointer" />
      )}
    </div>
  )
}

export default LocalSearch
