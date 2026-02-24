import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>

      <div className="mt-11 flex justify-between gap-5 sm:flex-row flex-col md:flex-col md:items-stretch sm:items-center">
        <Skeleton className="flex min-h-14 grow flex-1 items-center gap-5 rounded-[10px] px-4 w-full sm:min-w-42.5" />
        <Skeleton className="min-h-14 sm:min-w-42.5 w-full shrink flex-1/2" />
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton
            key={item}
            className="flex  flex-col rounded-2xl border  sm:w-65 w-[145.4px] h-[146.6px] sm:h-36.5 "
          />
        ))}
      </div>
    </section>
  )
}
