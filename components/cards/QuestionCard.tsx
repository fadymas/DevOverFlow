import Link from 'next/link'

import RenderTag from '../shared/rightsidebar/RenderTag'
import Metric from '../shared/Metric'
import { formatNumber, getTimeStamp } from '@/lib/utils'
import { getSession } from '@/lib/actions/auth-action'
import EditDeleteAction from '../shared/EditDeleteAction'

interface Props {
  _id: string
  title: string
  tags: { _id: string; name: string }[]
  author: { _id: string; name: string; userId: { image: string; _id: string; name: string } }
  upvotes: string[]
  views: number
  answers: Array<object>
  createdAt: Date
  isProfile?: boolean
}
async function QuestionCard({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
  isProfile
}: Props) {
  const { session } = await getSession()
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px] ">
      <div className="content  flex sm:flex-row flex-col-reverse items-start justify-between gap-5">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {session?.user.id === author.userId._id.toString() && isProfile && (
          <EditDeleteAction type="Question" itemId={_id.toString()} />
        )}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.userId.image}
          alt="user"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          textStyles="small-medium text-dark400_light800"
          href={`/profile/${author.userId._id}`}
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatNumber(upvotes.length)}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumber(answers.length)}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumber(views)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  )
}

export default QuestionCard
