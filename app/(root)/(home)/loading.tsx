import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <section>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h1-bold text-accent ">All Questions</Skeleton>
        <Skeleton className="flex justify-end max-sm:w-full">
          <div className=" min-h-11.5 px-4 py-3 text-accent  ">Ask A Question</div>
        </Skeleton>
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
