/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Input } from '@/components/ui/input'
import { setQueriedUrl } from '@/lib/utils'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDeferredValue, useEffect, useRef, useState } from 'react'
import GlobalResult from './GlobalResult'

function GlobalSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = searchParams.toString()
  const query = searchParams.get('global')
  const pathname = usePathname()
  const searchContainerRef = useRef(null)
  const [search, setSearch] = useState(query || '')
  const [isOpen, setIsOpen] = useState(false)
  const defferedSearch = useDeferredValue(search)

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      //@ts-ignore
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    setIsOpen(false)
    setSearch('')
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [pathname])

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      const newUrl = setQueriedUrl({
        params: params,
        keys: ['global'],
        search: defferedSearch
      })
      router.push(newUrl)
    }, 300)

    return () => clearTimeout(debounceSearch)
  }, [defferedSearch, router, params])
  return (
    <div ref={searchContainerRef} className="relative w-full max-w-150 max-lg:hidden">
      <div className="background-light800_darkgradient relative flex min-h-14 grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search globally"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            if (!isOpen) setIsOpen(true)
            if (e.target.value === '' && isOpen) setIsOpen(false)
          }}
          className="paragraph-regular no-focus placeholder 
          text-dark400_light700 background-light800_darkgradient border-none shadow-none outline-none"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  )
}

export default GlobalSearch
