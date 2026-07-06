import React from 'react'
import { FaThreads } from "react-icons/fa6";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import FadeUp from '../animations/FadeUp';


const NewsLetter = () => {
  return (
    <div className='flex flex-col md:flex-row w-full mt-10'>

    {/* Left Image */}
    <div className='w-full md:w-[30%]'>
        <img 
        className='w-full h-62.5 sm:h-75 md:h-full object-cover' 
        src="/images/newslettersaree.png" 
        alt="" 
        />
    </div>

    {/* Right Content */}
    <div className='w-full md:w-[70%] bg-[#74202D]'>
        <div className='flex flex-col lg:flex-row h-full'>
        {/* Text Content */}
        
        <div className='w-full lg:w-1/2 px-5 sm:px-8 md:px-10 py-10 flex flex-col justify-center gap-3 text-center lg:text-left'>
            <FadeUp>
                <h3 className='text-[#E6C7A1] uppercase text-xs sm:text-sm'>
                    Handpicked For You
                </h3>
                <h1 className='text-[#E6C7A1] text-2xl sm:text-3xl lg:text-3xl font-semibold'>
                    Tradition Woven With Love
                </h1>
                <p className='text-sm text-gray-200 max-w-md mx-auto lg:mx-0'>
                    Sarees that tell stories of culture, heritage & timeless beauty.
                </p>

                <div>
                    <button className='uppercase bg-[#F3D1B0] text-[#74202D] py-2 px-4 text-xs sm:text-sm font-semibold
                    border-2 border-[#F3D1B0] hover:text-white rounded-sm hover:bg-transparent cursor-pointer
                    transition duration-300 mt-2'>
                        Discover Collection
                    </button>
                </div>
            </FadeUp>
        </div>
        

        {/* Icons Section */}
        <div className='w-full lg:w-1/2 flex justify-center items-center 2xl:justify-start
            gap-6 sm:gap-8 md:gap-10 py-10 flex-wrap'>

            <FadeUp>
                <div className='flex flex-col items-center text-center'>
                    <FaThreads className='text-[#F3D1B0] text-xl sm:text-2xl' />
                    <h1 className='uppercase text-[#F3D1B0] text-sm sm:text-base font-semibold mt-2'>
                        Authentic
                    </h1>
                    <h2 className='text-xs sm:text-sm text-gray-200'>
                        Wovens
                    </h2>
                </div>
            </FadeUp>

            <FadeUp>
                <div className='flex flex-col items-center text-center'>
                    <HiOutlineBadgeCheck className='text-[#F3D1B0] text-xl sm:text-2xl' />
                    <h1 className='uppercase text-[#F3D1B0] text-sm sm:text-base font-semibold mt-2'>
                        Quality
                    </h1>
                    <h2 className='text-xs sm:text-sm text-gray-200'>
                        Assured
                    </h2>
                </div>
            </FadeUp>

            <FadeUp>
                <div className='flex flex-col items-center text-center'>
                    <FaRegHeart className='text-[#F3D1B0] text-xl sm:text-2xl' />
                    <h1 className='uppercase text-[#F3D1B0] text-sm sm:text-base font-semibold mt-2'>
                        Crafted
                    </h1>
                    <h2 className='text-xs sm:text-sm text-gray-200'>
                        with love
                    </h2>
                </div>
            </FadeUp>
        </div>
        </div>
    </div>

</div>
  )
}

export default NewsLetter