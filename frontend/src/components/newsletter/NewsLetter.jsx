import { Link } from "react-router-dom";
import { FaThreads } from "react-icons/fa6";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import FadeUp from '../animations/FadeUp';

const NewsLetter = () => {
  return (
    <div className="w-full bg-[#FEFAF8] py-8 sm:py-10 md:py-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row w-full overflow-hidden rounded-2xl shadow-lg border border-[#8a2a3a]/20">
          
          {/* Left Image */}
          <div className="w-full md:w-[35%] lg:w-[32%] xl:w-[30%] shrink-0">
            <img 
              loading="lazy"
              decoding="async"
              className="w-full h-64 sm:h-80 md:h-full min-h-[260px] md:min-h-[360px] object-cover object-center" 
              src="/images/newslettersaree.png" 
              alt="Handpicked Sarees Collection" 
            />
          </div>

          {/* Right Content */}
          <div className="w-full md:w-[65%] lg:w-[68%] xl:w-[70%] bg-[#74202D] p-6 sm:p-8 md:p-10 lg:p-12 flex items-center">
            <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 lg:gap-10">
              
              {/* Text Content */}
              <div className="w-full lg:w-3/5 text-center lg:text-left">
                <FadeUp delay={0.08} className="space-y-3 sm:space-y-4">
                  <span className="inline-block text-[#F3D1B0] uppercase text-xs sm:text-sm font-semibold tracking-wider">
                    Handpicked For You
                  </span>
                  
                  <h2 className="text-[#F3D1B0] text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-semibold leading-tight">
                    Tradition Woven With Love
                  </h2>
                  
                  <p className="text-xs sm:text-sm md:text-base text-rose-100/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                    Sarees that tell stories of culture, heritage & timeless Indian craftsmanship.
                  </p>

                  <div className="pt-2 sm:pt-3">
                    <Link 
                      to="/shop"
                      className="inline-flex items-center justify-center uppercase bg-[#F3D1B0] text-[#74202D] py-2.5 px-6 text-xs sm:text-sm font-semibold
                      border-2 border-[#F3D1B0] hover:text-white rounded-md hover:bg-transparent cursor-pointer
                      transition-all duration-300 shadow-sm"
                    >
                      Discover Collection
                    </Link>
                  </div>
                </FadeUp>
              </div>

              {/* Feature Badges */}
              <div className="w-full lg:w-2/5 flex justify-center lg:justify-end items-center gap-6 sm:gap-8 lg:gap-6 xl:gap-8 flex-wrap pt-2 lg:pt-0">
                <FadeUp delay={0.14}>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 border border-[#F3D1B0]/30 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
                      <FaThreads className="text-[#F3D1B0] text-xl sm:text-2xl" />
                    </div>
                    <h3 className="uppercase text-[#F3D1B0] text-xs sm:text-sm font-semibold tracking-wide">
                      Authentic
                    </h3>
                    <p className="text-[11px] sm:text-xs text-rose-100/80 mt-0.5">
                      Wovens
                    </p>
                  </div>
                </FadeUp>

                <FadeUp delay={0.22}>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 border border-[#F3D1B0]/30 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
                      <HiOutlineBadgeCheck className="text-[#F3D1B0] text-2xl sm:text-3xl" />
                    </div>
                    <h3 className="uppercase text-[#F3D1B0] text-xs sm:text-sm font-semibold tracking-wide">
                      Quality
                    </h3>
                    <p className="text-[11px] sm:text-xs text-rose-100/80 mt-0.5">
                      Assured
                    </p>
                  </div>
                </FadeUp>

                <FadeUp delay={0.3}>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 border border-[#F3D1B0]/30 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
                      <FaRegHeart className="text-[#F3D1B0] text-lg sm:text-xl" />
                    </div>
                    <h3 className="uppercase text-[#F3D1B0] text-xs sm:text-sm font-semibold tracking-wide">
                      Crafted
                    </h3>
                    <p className="text-[11px] sm:text-xs text-rose-100/80 mt-0.5">
                      With Love
                    </p>
                  </div>
                </FadeUp>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewsLetter;