import Image from 'next/image'

const Hero = () => {
  return (
    <div className="relative h-[444px] w-full overflow-hidden">

      <Image
        src="/SignupBanner.png"
        alt="Hero Image"
        width={516}
        height={544}
        priority
        className="absolute right-0 top-0 h-full w-[102%] max-w-none object-cover object-[center_10%] "
        sizes="430px"
      />

    </div>
  )
}

export default Hero