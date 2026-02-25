import { Skeleton } from '@/components/ui/skeleton'

function Loading() {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 sm:flex-row flex-col md:flex-col md:items-stretch sm:items-center">
        <Skeleton className="flex min-h-14 shrink flex-1/2 items-center gap-5 rounded-[10px] px-4 w-full sm:min-w-42.5" />
        <Skeleton className="min-h-14 sm:min-w-42.5 w-full grow flex-1 " />
      </div>
      <section className="mt-12 flex justify-between flex-wrap gap-4">
        {Array.from({ length: 10 }).map((item, index) => (
          <Skeleton key={index} className="h-60 w-full rounded-2xl sm:w-65" />
        ))}
      </section>
    </>
  )
}

export default Loading
