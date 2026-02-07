import { getUserAnswers } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import AnswerCard from '../cards/AnswerCard'

interface Props extends SearchParamsProps {
  userId: string
}
async function AnswersTab({ searchParams, userId }: Props) {
  const result = await getUserAnswers({
    userId,
    page: 1
  })
  return (
    <>
      {result.answers.map((item) => {
        ;<AnswerCard />
      })}
    </>
  )
}

export default AnswersTab
