'use client'
import { voteAnswer } from '@/lib/actions/answer.action'
import { viewQuestion } from '@/lib/actions/interaction.action'
import { voteQuestion } from '@/lib/actions/question.action'
import { toggleSaveQuestion } from '@/lib/actions/user.action'
import { formatNumber } from '@/lib/utils'
import { CircleCheckIcon, OctagonXIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { usePathname, useRouter } from 'next/navigation'
import { startTransition, useEffect, useOptimistic } from 'react'
import { toast } from 'sonner'
import AnimatedImage from '../Animated/AnimatedImage'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  type: 'Question' | 'Answer'
  itemId: string
  userId: string
  upvotes: number
  hasupVoted: boolean
  downvotes: number
  hasdownVoted: boolean
  hasSaved?: boolean
}

interface OptimisticVoteState {
  hasSaved: boolean
  hasupVoted: boolean
  hasdownVoted: boolean
  upvotes: number
  downvotes: number
}

type VoteAction = { type: 'upvote' } | { type: 'downvote' } | { type: 'save' }

// ─── Reducer ─────────────────────────────────────────────────────────────────

function voteReducer(current: OptimisticVoteState, action: VoteAction): OptimisticVoteState {
  switch (action.type) {
    case 'upvote': {
      const removingUpvote = current.hasupVoted
      return {
        ...current,
        hasupVoted: !current.hasupVoted,
        // switching from downvote → upvote: clear the downvote
        hasdownVoted: false,
        upvotes: removingUpvote ? current.upvotes - 1 : current.upvotes + 1,
        // if they had a downvote, cancel it out
        downvotes: current.hasdownVoted ? current.downvotes - 1 : current.downvotes
      }
    }
    case 'downvote': {
      const removingDownvote = current.hasdownVoted
      return {
        ...current,
        hasdownVoted: !current.hasdownVoted,
        // switching from upvote → downvote: clear the upvote
        hasupVoted: false,
        downvotes: removingDownvote ? current.downvotes - 1 : current.downvotes + 1,
        // if they had an upvote, cancel it out
        upvotes: current.hasupVoted ? current.upvotes - 1 : current.upvotes
      }
    }
    case 'save': {
      return { ...current, hasSaved: !current.hasSaved }
    }
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved = false
}: Props) => {
  const pathname = usePathname()
  const router = useRouter()

  const [optimisticState, setOptimistic] = useOptimistic<OptimisticVoteState, VoteAction>(
    // initial state derived from props
    { hasSaved, hasupVoted, hasdownVoted, upvotes, downvotes },
    // pure reducer — always reads from `current`, never from stale props
    voteReducer
  )

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleVote = (action: 'upvote' | 'downvote') => {
    if (!userId) {
      toast('Please log in', {
        description: 'You must be logged in to vote'
      })
      return
    }

    startTransition(async () => {
      // 1. Apply optimistic update immediately (reads from current state in reducer)
      setOptimistic({ type: action })

      // 2. Fire server action
      if (type === 'Question') {
        await voteQuestion({
          questionId: itemId,
          userId,
          type: action,
          path: pathname
        })
      } else {
        await voteAnswer({
          answerId: itemId,
          userId,
          type: action,
          path: pathname
        })
      }

      // 3. Toast — we read the *pre-update* state here to determine the message
      //    because the optimistic update already flipped the value
      if (action === 'upvote') {
        const wasUpvoted = optimisticState.hasupVoted
        toast.success(wasUpvoted ? 'Upvote Removed' : 'Upvote Successful', {
          position: 'top-right',
          icon: wasUpvoted ? <OctagonXIcon /> : <CircleCheckIcon />
        })
      } else {
        const wasDownvoted = optimisticState.hasdownVoted
        toast.success(wasDownvoted ? 'Downvote Removed' : 'Downvote Successful', {
          position: 'top-right',
          icon: wasDownvoted ? <OctagonXIcon /> : <CircleCheckIcon />
        })
      }
    })
  }

  const handleSave = () => {
    if (!userId) {
      toast('Please log in', {
        description: 'You must be logged in to save questions'
      })
      return
    }

    startTransition(async () => {
      // 1. Optimistic update
      setOptimistic({ type: 'save' })

      // 2. Server action
      await toggleSaveQuestion({
        userId,
        questionId: itemId,
        path: pathname
      })

      // 3. Toast — read pre-update state for message
      toast.info(optimisticState.hasSaved ? 'Question Unsaved' : 'Question Saved', {
        position: 'top-right',
        icon: optimisticState.hasSaved ? <OctagonXIcon /> : <CircleCheckIcon />
      })
    })
  }

  // ─── Side Effect ───────────────────────────────────────────────────────────

  useEffect(() => {
    viewQuestion({
      questionId: itemId,
      userId: userId || undefined
    })
  }, [itemId, userId, pathname, router])

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-5">
      {/* ── Upvote ── */}
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <AnimatePresence mode="popLayout" initial={false}>
            <AnimatedImage
              key={optimisticState.hasupVoted ? 'upvoted' : 'upvote'}
              src={
                optimisticState.hasupVoted
                  ? '/assets/icons/upvoted.svg'
                  : '/assets/icons/upvote.svg'
              }
              width={18}
              height={18}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1, opacity: 0 }}
              whileTap={{ scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 10,
                duration: 0.5
              }}
              alt="upvote"
              className="cursor-pointer"
              onTap={() => handleVote('upvote')}
            />
          </AnimatePresence>
          <div className="flex-center background-light700_dark400 min-w-4.5 rounded-sm p-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={optimisticState.upvotes}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="subtle-medium text-dark400_light900"
              >
                {formatNumber(optimisticState.upvotes)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Downvote ── */}
        <div className="flex-center gap-1.5">
          <AnimatePresence mode="popLayout" initial={false}>
            <AnimatedImage
              key={optimisticState.hasdownVoted ? 'downvoted' : 'downvote'}
              src={
                optimisticState.hasdownVoted
                  ? '/assets/icons/downvoted.svg'
                  : '/assets/icons/downvote.svg'
              }
              width={18}
              height={18}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1, opacity: 0 }}
              whileTap={{ scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 10,
                duration: 0.5
              }}
              alt="downvote"
              className="cursor-pointer"
              onTap={() => handleVote('downvote')}
            />
          </AnimatePresence>
          <div className="flex-center background-light700_dark400 min-w-4.5 rounded-sm p-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={optimisticState.downvotes}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="subtle-medium text-dark400_light900"
              >
                {formatNumber(optimisticState.downvotes)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Save (questions only) ── */}
      {type === 'Question' && (
        <AnimatePresence mode="popLayout" initial={false}>
          <AnimatedImage
            key={optimisticState.hasSaved ? 'saved' : 'unsaved'}
            src={
              optimisticState.hasSaved
                ? '/assets/icons/star-filled.svg'
                : '/assets/icons/star-red.svg'
            }
            width={18}
            height={18}
            alt="save question"
            className="cursor-pointer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1, opacity: 0 }}
            whileTap={{ scale: 0.8 }}
            onTap={handleSave}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 10,
              duration: 0.5
            }}
          />
        </AnimatePresence>
      )}
    </div>
  )
}

export default Votes
