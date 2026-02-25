import SignInForm from '@/components/forms/SignInForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your DevFlow account'
}

const SignInPage = () => {
  return <SignInForm />
}

export default SignInPage
