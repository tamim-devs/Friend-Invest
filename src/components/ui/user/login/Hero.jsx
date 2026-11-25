import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <div className="relative h-[544px] w-full sm:rounded-[40px]">
      <Image
        src="/LoginBanner.png"
        alt="Hero Image"
        fill
        priority
        className="object-cover object-[center_10%]"
        sizes="(max-width: 330px) 100vw, 430px"
      />
    </div>
  )
}

export default Hero