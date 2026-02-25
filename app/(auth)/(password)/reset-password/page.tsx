import ResetPassword from '@/components/forms/ResetPassword'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Enter your new DevFlow password'
}

function ForgetPassword() {
  return <ResetPassword />
}

export default ForgetPassword
