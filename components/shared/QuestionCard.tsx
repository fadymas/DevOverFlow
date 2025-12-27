import Link from 'next/link'
import { Badge } from '../ui/badge'
import Image from 'next/image'
import RenderTag from './rightsidebar/RenderTag'
import Metric from './Metric'
import { formatNumber, getTimeStamp } from '@/lib/utils'

interface Props {
  _id: string
  title: string
  tags: { _id: string; name: string }[]
  author: { _id: string; name: string; picture: string }
  upvotes: number
  views: number
  answers: Array<object>
  createdAt: Date
}
function QuestionCard({ _id, title, tags, author, upvotes, views, answers, createdAt }: Props) {
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px] ">
      <div className="content  flex sm:flex-row flex-col-reverse items-center justify-between gap-5">
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
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl="assets/icons/avatar.svg"
          alt="user"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          textStyles="small-medium text-dark400_light800"
          href={`/profile/${author._id}`}
          isAuthor
        />
        <Metric
          imgUrl="assets/icons/like.svg"
          alt="Upvotes"
          value={formatNumber(upvotes)}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="assets/icons/message.svg"
          alt="message"
          value={formatNumber(answers.length)}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="assets/icons/eye.svg"
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
