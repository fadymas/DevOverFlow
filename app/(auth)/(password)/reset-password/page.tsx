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
import { resetPasswordSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod'

function ForgetPassword() {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <AuthCard title="Set new password" description="New password must be different">
      <CardContent className="flex flex-col gap-9 p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-6.25 flex flex-col">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="gap-3.5">
                  <FormLabel className="paragraph-medium text-dark400_light700 ">
                    Password
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="gap-3.5">
                  <FormLabel className="paragraph-medium text-dark400_light700 ">
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12 background-light900_dark300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AuthActions
              buttonTitle="Reset password"
              AuthType="other"
              otherActionTitle="Back to login"
              otherActionUrl="/sign-in"
            />
          </form>
        </Form>
      </CardContent>
    </AuthCard>
  )
}

export default ForgetPassword
