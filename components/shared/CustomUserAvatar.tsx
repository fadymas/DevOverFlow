import { cn } from '@/lib/utils'

export default function CustomUserAvatar({
  name,
  isActive,
  className
}: {
  name: string
  isActive?: boolean
  className?: string
}) {
  // 2. Otherwise, get the first letter of the name
  const firstLetter = name.charAt(0).toUpperCase() || 'U'

  return (
    <div
      className={cn(
        `min-w-lg:w-100 xs:size-14  lg:size-25 rounded-full background-light700_dark400  flex items-center justify-center text-dark400_light700 h1-bold`,
        isActive ? 'xs:border-2 lg:border-4 border-primary-500' : '',
        className
      )}
    >
      {firstLetter}
    </div>
  )
}
