import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export default function Loading() {
  return (
    <section>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-11.5 px-4 py-3 text-light-900!">
            Ask A Question
          </Button>
        </Link>
      </div>

      <div className=" mt-11 flex flex-wrap items-center justify-between gap-5">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-full sm:w-28 md:hidden " />
      </div>

      <div className="mt-2.5  hidden flex-wrap gap-3 md:flex">
        <Skeleton className="h-9 w-[104.8px]" />
        <Skeleton className="h-9 w-[104.8px]" />
        <Skeleton className="h-9 w-[104.8px]" />
        <Skeleton className="h-9 w-[104.8px]" />
      </div>

      <div className="flex flex-col gap-6 mt-10">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton key={item} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    </section>
  )
}
