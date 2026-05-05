import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

const Hero = () => {
  return (
    <>
    <Swiper
        className='h-75 sm:h-100 md:h-125 lg:h-162.5 2xl:h-200 w-full'
        modules={[Pagination, Autoplay]} 
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        autoplay={{ delay: 3000 }}
        loop={true}
      >

        {/* Slide 1 */}
        <SwiperSlide className="h-full">
          <div className="bg-[url('/images/banner-1.png')] bg-cover bg-center h-full w-full flex items-center px-5 md:px-16 lg:px-24">
            
            <div className='w-full lg:w-[70%] lg:ml-10'>
              <h1 className="text-2xl sm:text-3xl lg:text-6xl font-semibold text-[#74202D]">
                Timeless Waves, <br /> Eternal Elegance
              </h1>

              <p className='banner-p w-full sm:w-[60%] md:w-[70%] my-4 text-[#3b3737] text-sm md:text-base xl:text-xl'>
                Discover our exquisite collection of sarees crafted with tradition, quality & love.
              </p>

              <button className='bg-[#74202D] text-white uppercase py-2 px-4 md:px-8 rounded-lg
              hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer
              transition text-xs md:text-sm font-semibold'>
                Shop Now
              </button>
            </div>

          </div>
        </SwiperSlide>


        {/* Slide 2 */}
        <SwiperSlide className="h-full">
          <div className="bg-[url('/images/banner-2.png')] bg-cover bg-center h-full w-full flex items-center px-5 md:px-16 lg:px-24">
            
            <div className='w-full lg:w-[70%] lg:ml-20'>
              <h1 className="text-2xl sm:text-3xl lg:text-6xl font-semibold text-[#74202D]">
                Elegance for <br /> Every Celebration
              </h1>

              <p className='banner-p w-full sm:w-[80%] md:w-[70%] my-4 text-[#3b3737] text-sm md:text-base xl:text-xl'>
                From weddings to festive moments, explore sarees that make every occasion unforgettable.
              </p>

              <button className='bg-[#74202D] text-white uppercase py-2 px-4 md:px-8 rounded-lg
              hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer
              transition text-xs md:text-base font-semibold'>
                Shop Now
              </button>
            </div>

          </div>
        </SwiperSlide>


        {/* Slide 3 */}
        <SwiperSlide className="h-full">
          <div className="bg-[url('/images/banner-3.png')] bg-cover bg-center h-full w-full flex items-center px-5 md:px-16 lg:px-24">
            
            <div className='w-full lg:w-[70%] lg:ml-20'>
              <h1 className="text-2xl sm:text-3xl lg:text-6xl xl:text-7xl font-semibold text-[#74202D]">
                Designed for <br /> Modern Grace
              </h1>

              <p className='banner-p w-full sm:w-[80%] md:w-[70%] my-4 text-[#3b3737] text-sm md:text-base xl:text-xl'>
                Contemporary sarees crafted for the modern woman — effortless elegance for every day.
              </p>

              <button className='bg-[#74202D] text-white uppercase py-2 px-4 md:px-8 rounded-lg
              hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer
              transition text-xs md:text-base font-semibold'>
                Shop Now
              </button>
            </div>

          </div>
        </SwiperSlide>

        {/* Pagination */}
      <div className="custom-pagination absolute z-50 flex gap-2 justify-center mb-5"></div>

      </Swiper>
    </>
  )
}


export default Hero