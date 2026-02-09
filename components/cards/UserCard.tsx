import { IUserProfile } from '@/database/userProfile.model'
import { getTopInteractedTags } from '@/lib/actions/tag.action'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import RenderTag from '../shared/rightsidebar/RenderTag'
import { Fragment } from 'react/jsx-runtime'
interface Props {
  user: IUserProfile & {
    userId: { _id: string; image: string; name: string }
  }
}
async function UserCard({ user }: Props) {
  // this need to  be fixed
  const interactedTags = await getTopInteractedTags({ userId: user._id.toString() })

  return (
    <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-65">
      <article className="flex w-full flex-col items-center justify-center rounded-2xl border p-8 background-light900_dark200 light-border">
        <Link href={`/profile/${user.userId?._id}`}>
          <Image
            src={user.userId?.image}
            alt="user profile picture"
            width={100}
            height={100}
            className="rounded-full"
          />
        </Link>
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">{user.userId?.name}</h3>
        </div>
        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </div>
  )
}

export default UserCard
