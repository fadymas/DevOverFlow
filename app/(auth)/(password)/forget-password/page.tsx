'use client'
import AuthActions from '@/components/auth/AuthActions'
import AuthCard from '@/components/auth/AuthCard'
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
import { forgetPasswordSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const metadata = {
  title: 'Forgot Password',
  description: 'Reset your DevFlow password'
}

function ForgetPassword() {
  const { forgetPassword } = useAuth()
  const form = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: ''
    }
  })
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof forgetPasswordSchema>) {
    await forgetPassword(values)
  }
  return (
    <AuthCard title="Forgot password?" description="No worries, we'll send you reset instructions.">
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

            <AuthActions
              buttonTitle="Continue"
              AuthType="other"
              otherActionTitle="Back to login"
              otherActionUrl="/sign-in"
              statue={form.formState.isSubmitting}
            />
          </form>
        </Form>
      </CardContent>
    </AuthCard>
  )
}

export default ForgetPassword
