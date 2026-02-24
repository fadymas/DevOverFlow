'use client'
import { voteAnswer } from '@/lib/actions/answer.action'
import { viewQuestion } from '@/lib/actions/interaction.action'
import { voteQuestion } from '@/lib/actions/question.action'
import { toggleSaveQuestion } from '@/lib/actions/user.action'
import { formatNumber } from '@/lib/utils'
import { CircleCheckIcon, OctagonXIcon } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
interface Props {
  type: string
  itemId: string
  userId: string
  upvotes: number
  hasupVoted: boolean
  downvotes: number
  hasdownVoted: boolean
  hasSaved?: boolean
}
const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved
}: Props) => {
  const pathname = usePathname()
  const router = useRouter()
  const handleSave = async () => {
    await toggleSaveQuestion({
      userId,
      questionId: itemId,
      path: pathname
    })
    return toast.info(!hasSaved ? 'Question Saved' : 'Question Unsaved', {
      position: 'top-right',
      icon: !hasSaved ? <CircleCheckIcon /> : <OctagonXIcon />
    })
  }
  const handleVote = async (action: string) => {
    if (!userId) {
      return toast('Please log in', {
        description: 'You must be logged in to perform this action'
      })
    }

    if (action === 'upvote') {
      if (type === 'Question') {
        await voteQuestion({
          questionId: itemId.toString(),
          userId: userId.toString(),
          type: 'upvote',
          path: pathname
        })
      } else if (type === 'Answer') {
        await voteAnswer({
          answerId: itemId.toString(),
          userId: userId.toString(),
          type: 'upvote',
          path: pathname
        })
      }
      // todo: show a toast
      return toast.error(!hasupVoted ? 'Upvote Successfull' : 'Upvote Removed', {
        position: 'top-right',
        icon: !hasupVoted ? <CircleCheckIcon /> : <OctagonXIcon />,
        style: { backgroundColor: !hasupVoted ? 'green' : 'red', color: 'white' }
      })
    } else if (action === 'downvote') {
      if (type === 'Question') {
        await voteQuestion({
          questionId: itemId.toString(),
          userId: userId.toString(),
          type: 'downvote',
          path: pathname
        })
      } else if (type === 'Answer') {
        await voteAnswer({
          answerId: itemId.toString(),
          userId: userId.toString(),
          type: 'downvote',
          path: pathname
        })
      }
      // todo: show a toast
      return toast.error(!hasdownVoted ? 'Downvote Successfull' : 'Downvote Removed', {
        position: 'top-right',
        icon: !hasdownVoted ? <CircleCheckIcon /> : <OctagonXIcon />,
        style: { backgroundColor: !hasdownVoted ? 'green' : 'red', color: 'white' }
      })
    }
  }
  useEffect(() => {
    viewQuestion({
      questionId: itemId,
      userId: userId || undefined
    })
  }, [itemId, userId, pathname, router])
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={hasupVoted ? '/assets/icons/upvoted.svg' : '/assets/icons/upvote.svg'}
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => {
              handleVote('upvote')
            }}
          />
          <div className="flex-cetner background-light700_dark400 rounded-sm p-1 min-[1.125rem]">
            <p className="subtle-medium text-dark400_light900">{formatNumber(upvotes)}</p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={hasdownVoted ? '/assets/icons/downvoted.svg' : '/assets/icons/downvote.svg'}
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => {
              handleVote('downvote')
            }}
          />
          <div className="flex-cetner background-light700_dark400 rounded-sm p-1 min-[1.125rem]">
            <p className="subtle-medium text-dark400_light900">{formatNumber(downvotes)}</p>
          </div>
        </div>
      </div>
      {type === 'Question' && (
        <Image
          src={hasSaved ? '/assets/icons/star-filled.svg' : '/assets/icons/star-red.svg'}
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={() => handleSave()}
        />
      )}
    </div>
  )
}

export default Votes
