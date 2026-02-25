import ForgetPasswordForm from '@/components/forms/ForgetPassword'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your DevFlow password'
}

function ForgetPasswordPage() {
  return <ForgetPasswordForm />
}

export default ForgetPasswordPage
