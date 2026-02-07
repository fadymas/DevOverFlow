import Image from 'next/image'
import RenderTag from './RenderTag'
import { getHotQuestions } from '@/lib/actions/question.action'
import Link from 'next/link'
import { getTopPopularTags } from '@/lib/actions/tag.action'

async function RightSideBar() {
  const hotQuestions = await getHotQuestions()
  const popularTags = await getTopPopularTags()
  return (
    <aside className="pt-30 items-stretch flex flex-col px-6 gap-20 right-0  top-0 sticky  min-h-screen max-w-82.5 max-xl:hidden  background-light900_dark200    border-l shadow-[10px_10px_20px_rgba(218,213,213,0.1)] ">
      <section className="hot_network flex flex-col  items-start justify-start gap-7.5  ">
        <h3 className="font-bold font-inter text-xl/[130%]">Top Questions</h3>
        <div className="questions_list flex flex-col items-start justify-around gap-2.5 body-medium font-inter ">
          {hotQuestions.map((question) => (
            <Link
              href={`/question/${question._id}`}
              key={question._id}
              className="flex cursor-pointer items-center justify-between gap-7 w-full"
            >
              <p className="body-medium text-dark500_light700">{question.title}</p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </section>
      <section className="popular_tags flex flex-col gap-13 items-stretch">
        <h3 className="font-bold font-inter text-xl/[130%]">Popular Tags</h3>
        <div className="tags_list flex flex-col gap-2">
          {popularTags.map((tag) => (
            <RenderTag
              _id={tag._id}
              key={tag._id}
              name={tag.name}
              totalQuestions={tag.numberOfQuestions}
              showCount={true}
            />
          ))}
        </div>
      </section>
    </aside>
  )
}

export default RightSideBar
