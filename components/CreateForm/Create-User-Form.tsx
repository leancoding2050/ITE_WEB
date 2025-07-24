// app/components/CreateUserForm.tsx
'use client'

import { CreateUserSchema } from '@/app/actions/Create/Create_user/schema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { CreateUserAction } from '@/app/actions/Create/Create_user'

const CreateUserForm = () => {
  const [isPending, startTransition] = useTransition()

  const user_create_form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      username: '',
      password: '',
      phone: '',
      name: '',
      role: 'USER',
    },
  })

  const user_create_form_onSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
    console.log('-- 用户输入数据 -- :', values, '-- 结束 --')
    startTransition(async () => {
      const result = await CreateUserAction(values)
      if (!result.data) {
        user_create_form.setError('root', { message: result.error || '創建用戶失敗' })
      } else {
        user_create_form.reset()
        // 可選：顯示成功訊息或重定向
        alert('用戶創建成功！')
        // window.location.href = '/users'
      }
    })
  }

  return (
    <Form {...user_create_form}>
      <form onSubmit={user_create_form.handleSubmit(user_create_form_onSubmit)} className="space-y-6">
        {user_create_form.formState.errors.root && (
          <div className="text-red-500 text-sm">{user_create_form.formState.errors.root.message}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={user_create_form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用戶名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入名稱"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={user_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓名</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''} // 將 null 轉為空字符串
                    disabled={isPending}
                    placeholder="輸入姓名"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={user_create_form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密碼</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入密碼"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={user_create_form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>電話</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''} // 將 null 轉為空字符串
                    disabled={isPending}
                    placeholder="輸入電話"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          提交
        </Button>
      </form>
    </Form>
  )
}

export default CreateUserForm