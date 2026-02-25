'use client'
import AuthActions from '@/components/auth/AuthActions'
import AuthCard from '@/components/auth/AuthCard'
import ProvidersSection from '@/components/auth/ProvidersSection'
import { CardContent } from '@/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth/auth-client'
import { signUpSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function SignUpForm() {
  const { signUp } = useAuth()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    const response = await signUp(values)

    if (response.error) {
      form.setError('email', {
        message: String(
          response.error.message === undefined ? 'An error occurred' : response.error.message
        )
      })
      return
    } else {
      toast.info('Check your email to verify your account', {
        position: 'top-center'
      })
    }
  }
  return (
    <AuthCard title="Create your account" description="to continue to DevFlow">
      <CardContent className="flex flex-col gap-9 p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-6.25 flex flex-col">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="gap-3.5">
                  <FormLabel className="paragraph-medium text-dark400_light700 ">
                    Username
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
                  <Link
                    href="/forget-password"
                    className="body-medium text-end text-blue hover:text-blue/50 transition-colors"
                  >
                    Forget password?
                  </Link>
                </FormItem>
              )}
            />
            <AuthActions
              buttonTitle="Continue"
              AuthType="signUp"
              statue={form.formState.isSubmitting}
            />
          </form>
        </Form>
        <ProvidersSection />
      </CardContent>
    </AuthCard>
  )
}

export default SignUpForm
