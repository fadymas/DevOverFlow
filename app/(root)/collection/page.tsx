/* eslint-disable @typescript-eslint/no-explicit-any */
import Filter from '@/components/shared/Filter'
import NoResult from '@/components/shared/NoResult'
import QuestionCard from '@/components/cards/QuestionCard'
import LocalSearch from '@/components/shared/search/LocalSearch'
import { getSavedQuestions } from '@/lib/actions/user.action'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { QuestionFilters } from '@/constants/filters'
import { SearchParamsProps } from '@/types'

export default async function Home({ searchParams }: SearchParamsProps) {
  const { q, filter } = await searchParams
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user) redirect('/')

  const result = await getSavedQuestions({ userId: session.user.id, searchQuery: q, filter })
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 sm:flex-row flex-col md:flex-col md:items-stretch sm:items-center">
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="assets/icons/search.svg"
          placeholder="search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] w-full"
          containerClasses=" max-md:flex"
        />
      </div>
      <div className="questions mt-10 flex w-full  flex-col gap-6">
        {/* HomeQuestion can be saved , mine,home */}
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => {
            return (
              <QuestionCard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.createdAt}
              />
            )
          })
        ) : (
          <NoResult
            title="There's no question saved to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  )
}
