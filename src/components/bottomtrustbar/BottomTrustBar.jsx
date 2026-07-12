import React from 'react'
import { FaMedal } from "react-icons/fa";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FiRefreshCw } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import { CiHeadphones } from "react-icons/ci";
import FadeUp from '../animations/FadeUp';

const BottomTrustBar = () => {
  return (
    <div className='w-full bg-[#FEFAF8] mt-10'>
    <div className='w-[95%] mx-auto bg-white rounded-lg shadow-md 
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-15 md:gap-6 py-10 md:p-10 lg:p-10'>

        {/* Item */}
        <FadeUp delay={0.2}>
            <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
                <div>
                    <FaMedal className='text-4xl text-[#74202D]' />
                </div>
                <div>
                    <h1 className='uppercase font-semibold text-sm lg:text-xl'>100% Original</h1>
                    <p className='text-center md:text-start text-xs lg:text-base text-gray-600'>Product</p>
                </div>                                  
            </div>
        </FadeUp>

        <FadeUp delay={0.4}>
            <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
                <FiRefreshCw className='text-4xl text-[#74202D]' />
                <div>
                    <h1 className='uppercase font-semibold text-sm lg:text-xl'>7 Days</h1>
                    <p className='text-center md:text-start text-xs text-gray-600 lg:text-base'>Easy Returns</p>
                </div>
            </div>
        </FadeUp>

        <FadeUp delay={0.6}>
            <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
                <LiaShippingFastSolid className='text-4xl text-[#74202D]' />
                <div>
                    <h1 className='uppercase font-semibold text-sm lg:text-xl'>Free Shipping</h1>
                    <p className='text-center md:text-start text-xs text-gray-600 lg:text-base'>Above ₹1499</p>
                </div>
            </div>
        </FadeUp>
        

        <FadeUp delay={0.8}>
            <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
                <GoShieldCheck className='text-4xl text-[#74202D]' />
                <div>
                    <h1 className='uppercase font-semibold text-sm lg:text-xl'>Secure</h1>
                    <p className='text-center md:text-start text-xs text-gray-600 lg:text-base'>Payments</p>
                </div>
            </div>
        </FadeUp>
        
    </div>
</div>
  )
}

export default BottomTrustBar