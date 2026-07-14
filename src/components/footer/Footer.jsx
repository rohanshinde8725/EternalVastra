import React from 'react'
import { FaFacebookF, FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className='bg-[#F6DBC6] w-full py-10'>
  <div className='w-[90%] mx-auto flex flex-col lg:flex-row gap-10'>

    {/* Div 1 */}
    <div className='w-full lg:w-[25%] text-center lg:text-left'>
      <div className='h-20 w-40 mx-auto lg:mx-0'>
        <img src="/images/navImg2.png" alt="" className='h-full w-full object-contain' />
      </div>

      <p className='text-sm my-6'>
        Bring you the finest collection of sarees that celebrate tradition, elegance & beauty.
      </p>

      <div className='flex justify-center lg:justify-start gap-6 text-[#74202D] text-lg'>
        <FaFacebookF className='cursor-pointer hover:text-[#440710]' />
        <FaInstagram className='cursor-pointer hover:text-[#440710]' />
        <FaGithub className='cursor-pointer hover:text-[#440710]' />
        <FaLinkedinIn className='cursor-pointer hover:text-[#440710]' />
      </div>
    </div>


    {/* Div 2 */}
    <div className='w-full lg:w-[50%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center lg:text-left'>
      
      <div>
        <h1 className='font-bold text-lg uppercase'>Quick Links</h1>
          <ul className='mt-4 flex flex-col gap-2 text-[#3b3737] text-sm list-none'>
            <li className='cursor-pointer hover:scale-105 transition'><Link to={"/about"}>About</Link></li>
            <li className='cursor-pointer hover:scale-105 transition'><Link to={"/contact"}>Contact Us</Link></li>
            <li className='cursor-pointer hover:scale-105 transition'>Track order</li>
            <li className='cursor-pointer hover:scale-105 transition'>Shipping Policy</li>
            <li className='cursor-pointer hover:scale-105 transition'>Returns & Refunds</li>
            <li className='cursor-pointer hover:scale-105 transition'>FAQ's</li>
          </ul>
      </div>

      <div>
        <h1 className='font-bold text-lg uppercase'>Shop</h1>
        <ul className='mt-4 flex flex-col gap-2 text-[#3b3737] text-sm decoration-none'>
          <p className='cursor-pointer hover:scale-105 transition'>All Sarees</p>
          <p className='cursor-pointer hover:scale-105 transition'>Silk Sarees</p>
          <p className='cursor-pointer hover:scale-105 transition'>Cotton Sarees</p>
          <p className='cursor-pointer hover:scale-105 transition'>Paithani Sarees</p>
          <p className='cursor-pointer hover:scale-105 transition'>New Arrivals</p>
          <p className='cursor-pointer hover:scale-105 transition'>Sale</p>
        </ul>
      </div>

      <div>
        <h1 className='font-bold text-lg uppercase'>Collections</h1>
        <div className='mt-4 flex flex-col gap-2 text-[#3b3737] text-sm'>
          <p className='cursor-pointer hover:scale-105 transition'>Wedding Collection</p>
          <p className='cursor-pointer hover:scale-105 transition'>Festive Collection</p>
          <p className='cursor-pointer hover:scale-105 transition'>Party Wear</p>
          <p className='cursor-pointer hover:scale-105 transition'>Office Wear</p>
          <p className='cursor-pointer hover:scale-105 transition'>Everyday Wear</p>
        </div>
      </div>

    </div>


    {/* Div 3 */}
    <div className='w-full lg:w-[25%] text-center lg:text-left'>
      <h1 className='font-bold text-lg uppercase'>Newsletter</h1>

      <p className='mt-4 text-[#3b3737] text-sm'>
        Subscribe to get special offers, free giveaways & once-in-a-lifetime deals
      </p>

      <div className='mt-5'>
        <input
          type="text"
          placeholder='Enter Your Email'
          className='py-2 w-full px-3 bg-white outline-none border border-gray-300 rounded-sm'
        />

        <button className='bg-[#74202D] text-white uppercase py-2 w-full mt-4 rounded-sm cursor-pointer
        hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] transition-all duration-300 font-semibold text-sm'>
          Subscribe Now
        </button>
      </div>
    </div>

  </div>
</div>
  )
}

export default Footer