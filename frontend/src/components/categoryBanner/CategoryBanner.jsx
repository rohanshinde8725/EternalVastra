import { Link } from 'react-router-dom'
import FadeUp from '../animations/FadeUp'
import FadeImage from '../animations/FadeImage'

const CategoryBanner = () => {
  return (
    <div className='bg-[#FEFAF8] py-8 sm:py-12 md:py-14'>
        <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-5 sm:gap-6'>

            {/* banner-1 */}
            <div className="relative h-62.5 sm:h-75 md:h-87.5 lg:h-100 2xl:h-150 w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-md">
                {/* Background Image */}
                <FadeImage src="/images/banner/category-banner1.png" alt="Category Banner" 
                    loading="lazy"
                    viewport={{once: true}}
                    className="absolute inset-0 w-full h-full object-cover" />
                {/* Overlay Content */}
                <div className="relative z-10 w-full lg:w-[60%] h-full flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-12 gap-2 sm:gap-3">
                    <FadeUp delay={0.1}>
                        <span className="text-[#74202D] uppercase text-xs sm:text-sm font-bold tracking-wider">
                            New Arrivals
                        </span>
                    </FadeUp>
                    <FadeUp delay={0.2}>
                        <h2 className="text-xl sm:text-2xl md:text-3xl text-[#440710] font-semibold leading-tight">
                            Fresh Waves <br /> For Every You
                        </h2>
                    </FadeUp>
                    <FadeUp delay={0.3}>
                        <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed">
                            Explore the latest sarees <br className="hidden sm:inline" /> in trend.
                        </p>
                    </FadeUp>
                    <FadeUp delay={0.4}>
                        <Link to="/shop">
                            <button className="bg-[#74202D] text-white uppercase py-2 px-5 sm:px-6 rounded-md cursor-pointer
                                hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] transition-all duration-300 text-xs sm:text-sm font-semibold mt-2 w-fit shadow-xs">
                                Explore Now
                            </button>
                        </Link>
                    </FadeUp>
                </div>
            </div>

            {/* banner-2 */}
            <div className="relative h-62.5 sm:h-75 md:h-87.5 lg:h-100 2xl:h-150 w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-md">
                {/* Background Image */}
                <FadeImage
                    viewport={{once: true}}
                    src="/images/banner/category-banner2.png"
                    alt="Festive Offer"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"/>

                {/* Content */}
                <div className="relative z-10 w-full lg:w-[60%] h-full flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-12 gap-2 sm:gap-3">
                    <FadeUp delay={0.1}>
                        <span className="text-[#74202D] uppercase text-xs sm:text-sm font-bold tracking-wider">
                            Festive Offer
                        </span>
                    </FadeUp>
                    <FadeUp delay={0.2}>
                        <h2 className="text-xl sm:text-2xl md:text-3xl text-[#440710] font-semibold leading-tight">
                            Up To 30% Off
                        </h2>
                    </FadeUp>
                    <FadeUp delay={0.3}>
                        <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed">
                            On Selected <br className="hidden sm:inline" /> Saree Collections.
                        </p>
                    </FadeUp>
                    <FadeUp delay={0.4}>
                        <Link to="/shop">
                            <button className="bg-[#74202D] text-white uppercase py-2 px-5 sm:px-6 rounded-md cursor-pointer
                                hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] transition-all duration-300
                                text-xs sm:text-sm font-semibold mt-2 w-fit shadow-xs">
                                Shop Sale
                            </button>
                        </Link>
                    </FadeUp>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CategoryBanner