import { FaMedal } from "react-icons/fa";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FiRefreshCw } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import FadeUp from '../animations/FadeUp';

const BottomTrustBar = () => {
  return (
    <div className='w-full mt-10'>
      <div className='max-w-[1600px] mx-auto bg-white rounded-xl shadow-xs border border-gray-200 
          grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-4 lg:gap-6 py-6 sm:py-8'>

        {/* Item */}
        <FadeUp delay={0.08}>
            <div className='flex flex-col md:flex-row items-center justify-center gap-2.5 sm:gap-3.5 lg:gap-4 text-center md:text-start'>
                <div className="shrink-0">
                    <FaMedal className='text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-[#74202D]' />
                </div>
                <div>
                    <h2 className='uppercase font-semibold text-xs sm:text-sm lg:text-sm xl:text-base'>100% Original</h2>
                    <p className='text-xs lg:text-sm text-gray-600'>Product</p>
                </div>                                  
            </div>
        </FadeUp>

        <FadeUp delay={0.16}>
            <div className='flex flex-col md:flex-row items-center justify-center gap-2.5 sm:gap-3.5 lg:gap-4 text-center md:text-start'>
                <div className="shrink-0">
                    <FiRefreshCw className='text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-[#74202D]' />
                </div>
                <div>
                    <h2 className='uppercase font-semibold text-xs sm:text-sm lg:text-sm xl:text-base'>7 Days</h2>
                    <p className='text-xs text-gray-600 lg:text-sm'>Easy Returns</p>
                </div>
            </div>
        </FadeUp>

        <FadeUp delay={0.24}>
            <div className='flex flex-col md:flex-row items-center justify-center gap-2.5 sm:gap-3.5 lg:gap-4 text-center md:text-start'>
                <div className="shrink-0">
                    <LiaShippingFastSolid className='text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-[#74202D]' />
                </div>
                <div>
                    <h2 className='uppercase font-semibold text-xs sm:text-sm lg:text-sm xl:text-base'>Free Shipping</h2>
                    <p className='text-xs text-gray-600 lg:text-sm'>Above ₹1499</p>
                </div>
            </div>
        </FadeUp>

        <FadeUp delay={0.32}>
            <div className='flex flex-col md:flex-row items-center justify-center gap-2.5 sm:gap-3.5 lg:gap-4 text-center md:text-start'>
                <div className="shrink-0">
                    <GoShieldCheck className='text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-[#74202D]' />
                </div>
                <div>
                    <h2 className='uppercase font-semibold text-xs sm:text-sm lg:text-sm xl:text-base'>Secure</h2>
                    <p className='text-xs text-gray-600 lg:text-sm'>Payments</p>
                </div>
            </div>
        </FadeUp>
        
      </div>
    </div>
  )
}

export default BottomTrustBar