import SignUpForm from '@/components/forms/SignUpForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new DevFlow account'
}

const SignUpPage = () => {
  return <SignUpForm />
}

export default SignUpPage
