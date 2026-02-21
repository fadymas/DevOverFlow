import { formatNumber, getTimeStamp } from '@/lib/utils'
import Link from 'next/link'
import Metric from '../shared/Metric'
import { Button } from '../ui/button'
import Image from 'next/image'
import EditDeleteAction from '../shared/EditDeleteAction'
import { getSession } from '@/lib/actions/auth-action'

interface Props {
  _id: string
  question: {
    _id: string
    title: string
  }
  author: {
    _id: string
    userId: {
      _id: string
      name: string
      image: string
    }
  }
  upvotes: number
  createdAt: Date
}
async function AnswerCard({ _id, question, author, upvotes, createdAt }: Props) {
  const { session } = await getSession()

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link className="sm:h3-semibold base-semibold" href={`/question/${question._id}/#${_id}`}>
            {question.title}
          </Link>
        </div>
        {session?.user.id === author.userId._id.toString() && (
          <EditDeleteAction type="Answer" itemId={_id.toString()} />
        )}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.userId.image}
          alt="user"
          value={author.userId.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          textStyles="small-medium text-dark400_light800"
          href={`/profile/${author.userId._id}`}
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatNumber(upvotes)}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  )
}

export default AnswerCard
