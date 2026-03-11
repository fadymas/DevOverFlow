'use client'

import { MotionButton } from '@/components/ui/button'
import { serverSession, useAuth } from '@/lib/auth/auth-client'

interface Props {
  session: serverSession | null
  className: string
}
function Signout({ session, className }: Props) {
  const { signOut } = useAuth()
  if (!session?.user) {
    return null
  }
  return (
    <MotionButton
      onClick={() => {
        signOut()
      }}
      className={`${className} rounded-md `}
    >
      Sign Out
    </MotionButton>
  )
}
export default Signout
