'use client'

import { Button } from '@/components/ui/button'
import { serverSession, useAuth } from '@/lib/auth/auth-client'
import { redirect, useRouter } from 'next/navigation'

interface Props {
  session: serverSession | null
}
function Signout({ session }: Props) {
  const { signOut } = useAuth()
  if (!session?.user) {
    return null
  }
  return (
    <Button
      onClick={() => {
        signOut()
      }}
      className=" rounded-md "
    >
      Sign Out
    </Button>
  )
}
export default Signout
