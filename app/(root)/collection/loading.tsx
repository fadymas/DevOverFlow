import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 sm:flex-row flex-col md:flex-col md:items-stretch sm:items-center">
        <Skeleton className="background-light800_darkgradient flex min-h-14 grow items-center gap-5 rounded-[10px] px-4" />
        <Skeleton className="max-md:flex w-full h-14" />
      </div>

      <div className="questions mt-10 flex w-full flex-col gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </section>
  )
}
