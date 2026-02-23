/* eslint-disable @typescript-eslint/no-explicit-any */
import Answer from '@/components/forms/Answer'
import AllAnswers from '@/components/shared/AllAnswers'
import CustomUserAvatar from '@/components/shared/CustomUserAvatar'
import Metric from '@/components/shared/Metric'
import ParseHTML from '@/components/shared/ParseHTML'
import RenderTag from '@/components/shared/rightsidebar/RenderTag'
import Votes from '@/components/shared/Votes'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action'
import { auth } from '@/lib/auth/auth'
import { formatNumber, getTimeStamp } from '@/lib/utils'
import { URLProps } from '@/types'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function page({ params, searchParams }: URLProps) {
  const { id } = await params
  const { page, filter } = await searchParams
  const result = await getQuestionById({ questionId: id })
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) redirect('/sign-in')

  const mongoUser = await getUserById({ userId: session.user.id })
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.userId}`}
            className="flex items-center justify-start gap-1"
          >
            {result.author.userId.image ? (
              <Image
                src={result.author.userId.image}
                className="rounded-full"
                width={22}
                height={22}
                alt="profile"
              />
            ) : (
              <CustomUserAvatar
                name={result.author.userId.name}
                className="xs:size-5.5 lg:size-5.5 text-sm!"
              />
            )}
            <p className="paragraph-semibold text-dark300_light700">{result.author.userId.name}</p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={result._id.toString()}
              userId={mongoUser._id.toString()}
              upvotes={result.upvotes.length}
              hasupVoted={result.upvotes.includes(mongoUser._id)}
              downvotes={result.downvotes.length}
              hasdownVoted={result.downvotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex-wrap flex gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(result.createdAt)}`}
          title="Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumber(result.answers.length)}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumber(result.views)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} showCount={false} />
        ))}
      </div>

      <AllAnswers
        questionId={result._id.toString()}
        userId={mongoUser._id.toString()}
        totalAnswers={result.answers.length}
        page={page}
        filter={filter}
      />

      <Answer
        questionId={result._id.toString()}
        userId={mongoUser._id.toString()}
        question={result.content}
      />
    </>
  )
}
