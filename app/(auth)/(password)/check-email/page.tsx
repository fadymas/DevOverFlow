import AuthActions from '@/components/auth/AuthActions'
import AuthCard from '@/components/auth/AuthCard'
import { CardContent } from '@/components/ui/card'

function CheckEmail() {
  return (
    <AuthCard
      title="Check your email"
      description="We sent a password reset link to adrian@jsmastery.pro"
    >
      <CardContent className="flex flex-col gap-9 p-0">
        <div className="gap-6.25 flex flex-col">
          <AuthActions
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
