import React from 'react'
import { FaMedal } from "react-icons/fa";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FiRefreshCw } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import { CiHeadphones } from "react-icons/ci";
import FadeUp from "../animations/FadeUp";

const TrustBar = () => {
  return (
    <div className='w-full py-10 bg-[#FEFAF8]'>
        <FadeUp delay={0.2}>
            <div className='w-[95%] py-10 gap-5 mx-auto shadow-md bg-white rounded-lg 
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 px-5'>
                {/* Item */}
                <div className='flex flex-col sm:flex-row gap-4 items-center text-center sm:text-left'>
                <FaMedal className='text-4xl text-[#74202D]' />
                <div>
                    <h1 className='uppercase font-semibold'>Premium Quality</h1>
                    <p className='text-sm mt-2'>Finest Fabrics, Crafted to Perfection</p>
                </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-4 items-center text-center sm:text-left'>
                <LiaShippingFastSolid className='text-4xl text-[#74202D]' />
                <div>
                    <h1 className='uppercase font-semibold'>Free Shipping</h1>
                    <p className='text-sm mt-2'>On Orders Above ₹1499</p>
                </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-4 items-center text-center sm:text-left'>
                <FiRefreshCw className='text-4xl text-[#74202D]' />
                <div>
                    <h1 className='uppercase font-semibold'>Easy Returns</h1>
                    <p className='text-sm mt-2'>Hassle-free within 7 days</p>
                </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-4 items-center text-center sm:text-left'>
                <GoShieldCheck className='text-4xl text-[#74202D]' />
                <div>
                    <h1 className='uppercase font-semibold'>Secure Payments</h1>
                    <p className='text-sm mt-2'>100% Safe & Trusted</p>
                </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-4 items-center text-center sm:text-left'>
                <CiHeadphones className='text-4xl text-[#74202D]' />
                <div>
                    <h1 className='uppercase font-semibold'>Customer Support</h1>
                    <p className='text-sm mt-2'>Available Anytime</p>
                </div>
                </div>
            </div>
        </FadeUp>
    </div>
  )
}

export default TrustBar