import { getUserAnswers } from '@/lib/actions/user.action'
import AnswerCard from '../cards/AnswerCard'
import { SearchParamsProps } from '@/types'

interface Props extends SearchParamsProps {
  userId: string
}
async function AnswersTab({ userId, searchParams }: Props) {
  const result = await getUserAnswers({
    userId,
    page: 1
  })
  return (
    <>
      {result.answers.map((item) => (
        <AnswerCard
          key={item._id}
          _id={item._id}
          question={item.question}
          author={item.author}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
        />
      ))}
    </>
  )
}

export default AnswersTab
