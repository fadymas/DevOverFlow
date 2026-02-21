'use client'

import { EditUserSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4-mini'
import { Button } from '@/components/ui/button'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '../ui/textarea'
import { usePathname, useRouter } from 'next/navigation'
import { updateUser } from '@/lib/actions/user.action'

interface Props {
  user: string
}
function Profile({ user }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const parsedUser = JSON.parse(user)

  const form = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: parsedUser?.userId.name || '',
      portfolioWebsite: parsedUser?.portfolioWebsite || '',
      location: parsedUser?.location || '',
      bio: parsedUser?.bio || ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof EditUserSchema>) {
    try {
      await updateUser({
        authId: parsedUser.userId._id,
        updateData: {
          name: values.name,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio
        },
        path: pathname
      })
      router.back()
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-9 flex flex-col w-full gap-9">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Name<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-14 border "
                  {...field}
                />
              </FormControl>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio Link<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-14 border "
                  placeholder="Your portfolio URL"
                  {...field}
                />
              </FormControl>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Location<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-14 border "
                  placeholder="Where are you from?"
                  {...field}
                />
              </FormControl>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Textarea
                  style={{ resize: 'none' }}
                  className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-14 border "
                  placeholder="What makes you unique?"
                  {...field}
                />
              </FormControl>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="primary-gradient w-fit"
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Profile
