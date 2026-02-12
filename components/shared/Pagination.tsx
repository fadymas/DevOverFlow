'use client'
import { setQueriedUrl } from '@/lib/utils'
import { Button } from '../ui/button'
import { useSearchParams, useRouter } from 'next/navigation'
interface Props {
  pageNumber: number
  isNext: boolean
}
function Pagination({ pageNumber, isNext }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleNavigation = (direction: string) => {
    const nextPageNumber = direction === 'prev' ? pageNumber - 1 : pageNumber + 1

    const newUrl = setQueriedUrl({
      params: searchParams.toString(),
      keys: ['page'],
      search: nextPageNumber.toString()
    })
    router.push(newUrl)
  }
  if (!isNext && pageNumber === 1) return null

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation('prev')}
        className="light-border-2 border btn flex min-h-9 items-center justify-center gap-2"
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="bg-primary-500 justify-center flex rounded-md px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext}
        onClick={() => handleNavigation('next')}
        className="light-border-2 border btn flex min-h-9 items-center justify-center gap-2"
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  )
}

export default Pagination
