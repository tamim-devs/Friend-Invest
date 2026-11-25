
import Form from '@/components/ui/user/login/Form'
import Hero from '@/components/ui/user/login/Hero'
import React from 'react'

const Page = () => {
  return (
    <div className="flex h-dvh justify-center overflow-hidden bg-zinc-200 dark:bg-zinc-900">
      <div className="flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-zinc-50 dark:bg-black sm:rounded-[40px] sm:shadow-2xl">

        <Hero />

        <Form />

      </div>
    </div>
  )
}

export default Page
