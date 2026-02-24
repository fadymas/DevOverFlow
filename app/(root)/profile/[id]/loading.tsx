import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <section>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="h-36 w-36 rounded-full" />

          <div className="mt-3">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="mt-5 h-5 w-48" />
            <Skeleton className="mt-8 h-4 w-96 max-sm:w-full" />
            <Skeleton className="mt-2 h-4 w-96 max-sm:w-full" />
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <Skeleton className="h-11 w-44 rounded-md" />
        </div>
      </div>

      <div className="mt-10">
        <Skeleton className="h-7 w-28" />
        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-28 w-full rounded-md" />
          ))}
        </div>
      </div>

      <div className="mt-10 flex gap-10">
        <div className="flex flex-1 flex-col">
          <div className="flex">
            <Skeleton className="h-11 w-24 rounded-l-md" />
            <Skeleton className="h-11 w-24 rounded-r-md" />
          </div>

          <div className="mt-5 flex w-full flex-col gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
