import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
interface Props {
  _id: string
  name: string
  totalQuestions?: number
  showCount?: boolean
  className?: string
}
function RenderTag({ _id, name, totalQuestions, showCount, className }: Props) {
  return (
    <Link
      href={`/tags/${_id}`}
      className={cn('flex justify-between items-center gap-2 ', !showCount && 'max-w-20')}
    >
      <Badge
        className={cn(
          'subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase',
          className
        )}
      >
        {name}
      </Badge>
      {showCount && <p className="small-medium text-dark500_light700">{totalQuestions}</p>}
    </Link>
  )
}

export default RenderTag
