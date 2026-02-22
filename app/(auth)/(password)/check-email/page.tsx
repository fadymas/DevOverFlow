import AuthActions from '@/components/auth/AuthActions'
import AuthCard from '@/components/auth/AuthCard'
import { CardContent } from '@/components/ui/card'
import { SearchParamsProps } from '@/types'
import { redirect } from 'next/navigation'

async function CheckEmail({ searchParams }: SearchParamsProps) {
  const { email } = await searchParams
  if (!email) {
    return redirect('/sign-in')
  }
  return (
    <AuthCard title="Check your email" description={`We sent a password reset link to ${email}`}>
      <CardContent className="flex flex-col gap-9 p-0">
        <div className="gap-6.25 flex flex-col">
          <AuthActions
            email={email}
            buttonTitle="Resend"
            AuthType="other"
            otherActionTitle="Back to login"
            otherActionUrl="/sign-in"
          />
        </div>
      </CardContent>
    </AuthCard>
  )
}

export default CheckEmail
