import React from 'react'
import FadeUp from '../animations/FadeUp'
import FadeImage from '../animations/FadeImage'

const CategoryBanner = () => {
  return (
    <div className='bg-[#FEFAF8] py-10'>
        <div className='lg:px-10 px-4 flex flex-col md:flex-row gap-5'>

            {/* banner-1 */}
            <div className="relative h-62.5 sm:h-75 md:h-87.5 lg:h-100 2xl:h-150 w-full lg:w-1/2 rounded-lg overflow-hidden">
                {/* Background Image */}
                <FadeImage src="/images/banner/category-banner1.png" alt="Category Banner" className="absolute inset-0 w-full h-full object-cover" />
                {/* Overlay Content */}
                <div className="relative z-10 w-full lg:w-1/2 h-full flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-12 gap-2 sm:gap-3">
                    <FadeUp delay={0.2}>
                        <h3 className="text-[#74202D] uppercase text-[10px] sm:text-xs md:text-sm font-bold">
                            New Arrivals
                        </h3>
                    </FadeUp>
                    <FadeUp delay={0.4}>
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#440710] font-semibold">
                            Fresh Waves <br /> For Every You
                        </h1>
                    </FadeUp>
                    <FadeUp delay={0.6}>
                        <p className="text-xs sm:text-sm md:text-base">
                            Explore the latest sarees <br /> in trend.
                        </p>
                    </FadeUp>
                    <FadeUp delay={0.8}>
                        <button className="bg-[#74202D] text-white uppercase py-1 px-3 sm:px-4 md:px-5 rounded-sm cursor-pointer
                            hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] transition text-[10px] sm:text-xs md:text-sm font-semibold mt-2 w-fit">
                            Explore Now
                        </button>
                    </FadeUp>
                </div>
            </div>

            {/* banner-2 */}
            <div className="relative h-62.5 sm:h-75 md:h-87.5 lg:h-100 2xl:h-150 w-full lg:w-1/2 rounded-lg overflow-hidden">
                {/* Background Image */}
                <FadeImage
                    src="/images/banner/category-banner2.png"
                    alt="Festive Offer"
                    className="absolute inset-0 w-full h-full object-cover"/>

                {/* Content */}
                <div className="relative z-10 w-full lg:w-1/2 h-full flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-12 gap-2 sm:gap-3">
                    <FadeUp delay={0.2}>
                        <h3 className="text-[#74202D] uppercase text-[10px] sm:text-xs md:text-sm font-bold">
                            Festive Offer
                        </h3>
                    </FadeUp>
                    <FadeUp delay={0.4}>
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl text-[#440710] font-semibold">
                            Up To 30% Off
                        </h1>
                    </FadeUp>
                    <FadeUp delay={0.6}>
                        <p className="text-xs sm:text-sm md:text-base">
                            On Selected <br /> Saree Collections.
                        </p>
                    </FadeUp>
                    <FadeUp delay={0.8}>
                        <button className="bg-[#74202D] text-white uppercase py-1 px-3 sm:px-4 md:px-5 rounded-sm cursor-pointer
                            hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] transition
                            text-[10px] sm:text-xs md:text-sm font-semibold mt-2 w-fit">
                            Shop Sale
                        </button>
                    </FadeUp>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CategoryBanner