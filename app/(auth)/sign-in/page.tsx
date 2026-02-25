'use client'
import { CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import AuthCard from '@/components/auth/AuthCard'
import ProvidersSection from '@/components/auth/ProvidersSection'
import AuthActions from '@/components/auth/AuthActions'
import { useAuth } from '@/lib/auth/auth-client'

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your DevFlow account'
}

function SignIn() {
  const { signIn } = useAuth()
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const response = await signIn(values)

    if (response.error) {
      form.setError('email', { message: '' })
      form.setError('password', { message: String(response.error.message) })
      return
    }
  }
  return (
    <AuthCard title="Sign in" description="to continue to DevFlow">
      <CardContent className="flex flex-col gap-9 p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-6.25 flex flex-col">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="gap-3.5">
                  <FormLabel className="paragraph-medium text-dark400_light700 ">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12 background-light900_dark300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="gap-3.5">
                  <FormLabel className="paragraph-medium text-dark400_light700 ">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-12 background-light900_dark300"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                  <Link href="/forget-password" className="body-medium text-end text-blue">
                    Forget password?
                  </Link>
                </FormItem>
              )}
            />
            <AuthActions
              buttonTitle="Continue"
              AuthType="signIn"
              statue={form.formState.isSubmitting}
            />
          </form>
        </Form>
        <ProvidersSection />
      </CardContent>
    </AuthCard>
  )
}

export default SignIn
