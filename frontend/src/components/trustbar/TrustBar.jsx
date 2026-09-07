import { FaMedal } from "react-icons/fa";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FiRefreshCw } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import { CiHeadphones } from "react-icons/ci";
import FadeUp from "../animations/FadeUp";

const TrustBar = () => {
  return (
    <div className='w-full py-8 sm:py-10 md:py-12 bg-[#FEFAF8]'>
        <FadeUp delay={0.2}>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className='w-full py-6 sm:py-8 px-4 sm:px-6 gap-6 sm:gap-4 lg:gap-4 mx-auto shadow-xs border border-gray-200 bg-white rounded-xl 
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'>
                {/* Item */}
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-3.5 items-center text-center sm:text-left'>
                    <FaMedal className='text-2xl sm:text-3xl lg:text-3xl text-[#74202D] shrink-0' />
                    <div>
                        <h2 className='uppercase font-semibold text-xs sm:text-sm lg:text-sm xl:text-base leading-tight text-slate-800'>Premium Quality</h2>
                        <p className='text-xs lg:text-xs xl:text-sm text-slate-500 mt-0.5'>Finest Fabrics, Crafted to Perfection</p>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-3 sm:gap-3.5 items-center text-center sm:text-left'>
                    <LiaShippingFastSolid className='text-2xl sm:text-3xl lg:text-3xl text-[#74202D] shrink-0' />
                    <div>
                        <h2 className='uppercase font-semibold text-xs sm:text-sm lg:text-sm xl:text-base leading-tight text-slate-800'>Free Shipping</h2>
                        <p className='text-xs lg:text-xs xl:text-sm text-slate-500 mt-0.5'>On Orders Above ₹1499</p>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-3 sm:gap-3.5 items-center text-center sm:text-left'>
                    <FiRefreshCw className='text-2xl sm:text-3xl lg:text-3xl text-[#74202D] shrink-0' />
                    <div>
                        <h2 className='uppercase font-semibold text-xs sm:text-sm lg:text-sm xl:text-base leading-tight text-slate-800'>Easy Returns</h2>
                        <p className='text-xs lg:text-xs xl:text-sm text-slate-500 mt-0.5'>Hassle-free within 7 days</p>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-3 sm:gap-3.5 items-center text-center sm:text-left'>
                    <GoShieldCheck className='text-2xl sm:text-3xl lg:text-3xl text-[#74202D] shrink-0' />
                    <div>
                        <h2 className='uppercase font-semibold text-xs sm:text-sm lg:text-sm xl:text-base leading-tight text-slate-800'>Secure Payments</h2>
                        <p className='text-xs lg:text-xs xl:text-sm text-slate-500 mt-0.5'>100% Safe & Trusted</p>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-3 sm:gap-3.5 items-center text-center sm:text-left'>
                    <CiHeadphones className='text-2xl sm:text-3xl lg:text-3xl text-[#74202D] shrink-0' />
                    <div>
                        <h2 className='uppercase font-semibold text-xs sm:text-sm lg:text-sm xl:text-base leading-tight text-slate-800'>Customer Support</h2>
                        <p className='text-xs lg:text-xs xl:text-sm text-slate-500 mt-0.5'>Available Anytime</p>
                    </div>
                </div>
            </div>
          </div>
        </FadeUp>
    </div>
  )
}

export default TrustBar