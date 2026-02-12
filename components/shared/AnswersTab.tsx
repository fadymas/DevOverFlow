import { getUserAnswers } from '@/lib/actions/user.action'
import AnswerCard from '../cards/AnswerCard'

interface Props {
  userId: string
}
async function AnswersTab({ userId }: Props) {
  const result = await getUserAnswers({
    userId,
    page: 1
  })
  return (
    <>
      {result.answers.map((item) => (
        <AnswerCard key={item._id} />
      ))}
    </>
  )
}

export default AnswersTab
