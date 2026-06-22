import React from 'react'
import { GrGroup } from "react-icons/gr";
import { IoDiamondOutline } from "react-icons/io5";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { PiFlowerLotusLight, PiCompassRoseThin } from "react-icons/pi";
import { CiMedal } from "react-icons/ci";
import { TfiWorld } from "react-icons/tfi";
import { BiLeaf } from "react-icons/bi";
import { BsFlower2 } from "react-icons/bs";

const About = () => {

  const crafts = [
    {
      img : "/images/craft-1.png",
      title : "Finest Material",
      subTitle : "We source premium quality fabrics that define elegance and comfort.",
    },
    {
      img : "/images/craft-2.png",
      title : "Skilled Artist",
      subTitle : "Our Sarees are woven by skilled hands with Generations of expertise.",
    },
    {
      img : "/images/craft-3.png",
      title : "Exquisite Designs",
      subTitle : "From Classic weaves to contemporary styles designed for every you.",
    },
    {
      img : "/images/craft-4.png",
      title : "Impeccable Finish",
      subTitle : "Every Sarees goes through strict quality checks to ensure perfection.",
    },
    {
      img : "/images/craft-5.png",
      title : "Thoughful Packaging",
      subTitle : "Delivered with care, because you deserve the best experience.",
    },
  ]
  return (
    <div className='bg-[#FEFAF8]'>




      {/* Banner Start */}
      <div className="bg-[url('/images/banner-2.png')] bg-cover bg-center h-75 sm:h-100 md:h-125 lg:h-162.5 2xl:h-200 w-full 
      flex items-center px-5 md:px-16 lg:px-24 relative overflow-hidden">
        <div className='w-full lg:w-[70%] lg:ml-10 absolute'>
          <h3 className='text-xs md:text-sm text-[#74202D] font-bold uppercase'>About Us</h3>
          <h1 className="text-lg sm:text-3xl lg:text-5xl font-semibold text-[#4A1F1C]">Celebrating Tradition, <br /> Embracing Elegance</h1>
          <div className='w-[50%] border md:w-[35%] lg:w-[40%] text-[#74202D] rounded-lg my-2 md:my-4 lg:my-8'></div>
          <p className='w-[60%] md:w-[50%] text-[#3b3737] text-xs md:text-base'>
            At Saree, we believe a saree is more than just attire—it's a story woven with heritage, culture, and 
            timeless beauty. Our collections are a tribute to the artistry of Indian weavers and the elegance of 
            every woman who wears it.
          </p>

          <button className='bg-[#74202D] text-white uppercase py-1.5 px-3 md:py-2 md:px-8 rounded-lg
              hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer
              transition text-xs md:text-sm font-semibold mt-5'>
                Our Story
          </button>
        </div>
      </div>
      {/* Banner End */}



      {/* Journey Start */}
      <div className='py-15 px-5 md:py-10 md:px-15 flex flex-col lg:flex-row gap-10 lg:gap-20'>
        <div className='w-full h-auto md:w-[80%] mx-auto lg:w-[40%] md:h-90 lg:h-100 2xl:h-120'>
          <img className='h-full w-full object-cover rounded-xl' src="/images/aboutjourney.png" alt="" />
        </div>

        <div className='w-full lg:w-[60%] text-center lg:text-start'>
          <div>
            <h3 className='text-[#74202D] font-semibold text-sm uppercase'>Our Journey</h3>
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-[#4A1F1C] my-4">From Looms to Loved <br /> By Generations</h1>
            <p className='w-full md:w-[70%] mx-auto lg:mx-0 text-[#3b3737] text-sm md:text-base'>
              What began as a small passion for traditional weaves has grown into a brand trusted by thousands of Saree
              lovers across the country. We worked closely with skilled artisans and weavers to bring authentic sarees
              that reflect india's rich textile legacy.
            </p>
          </div>

          <div className='w-full flex flex-col md:flex-row gap-10 mt-10 items-center'>
            <div className='flex flex-col items-center text-center'>
              <GrGroup className='text-2xl md:text-3xl text-[#74202D]' />
              <h1 className='uppercase text-sm font-bold mt-2 text-[#4A1F1C] '>
                Rooted in Tradition
              </h1>
              <h2 className='text-xs sm:text-sm text-gray-600'>
                Honoring age-old weaving technique and designs. 
              </h2>
            </div>
          
            <div className='flex flex-col items-center text-center'>
              <IoDiamondOutline className='text-2xl md:text-3xl text-[#74202D]' />
              <h1 className='uppercase text-sm font-bold mt-2 text-[#4A1F1C]'>
                Quality You Can Trust
              </h1>
              <h2 className='text-xs sm:text-sm text-gray-600'>
                Carefully curated sarees with finest quality.
              </h2>
            </div>
          
            <div className='flex flex-col items-center text-center'>
              <FaRegHeart className='text-2xl md:text-3xl text-[#74202D]' />
                <h1 className='uppercase text-sm font-bold mt-2 text-[#4A1F1C]'>
                  Loved by Thousands
                </h1>
                <h2 className='text-xs sm:text-sm text-gray-600'>
                  Trusted by customers across the country.
                </h2>
            </div>
          </div>
        </div>
      </div>
      {/* Journey End */}





      {/* Craftmanship Start */}
      <div className='bg-[#F4EFEA] px-4 py-10 md:px-20'>
        <div className='w-full md:w-[90%] lg:w-[50%] mx-auto'>
          <div className='flex justify-center items-center gap-2 text-center'>
            <IoIosArrowRoundForward className='h-10 w-10 text-[#74202D]' />
            <h1 className='uppercase md:text-2xl font-semibold'>The Art Of Craftmanship</h1>
            <IoIosArrowRoundBack className='h-10 w-10 text-[#74202D]' />
          </div>
          <h5 className='text-center text-sm mt-2 md:text-base'>Every Saree is a masterpiece, crafted with precision, passion and patience.</h5>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 mt-10'>
          {crafts.map((craft, index) => (
              <div className='text-center group'>
                <img className='h-40 w-40 lg:h-35 lg:w-35 mx-auto object-cover rounded-full border-4 border-[#F4EFEA] group-hover:border-[#74202D] 
                group-hover:scale-105 transition-all duration-300 cursor-pointer' src={craft.img} />
                <h1 className='mt-4 mb-2 font-semibold'>{craft.title}</h1>
                <p className='text-sm text-gray-500'>{craft.subTitle}</p>
              </div>
          ))}
        </div>
      </div>


      <div className='bg-[#74202D] py-10'>
        <div className='w-[90%] lg:w-[70%] flex flex-col md:flex-row justify-between gap-20 mx-auto'>
          
          {/* 1 */}
          <div className='flex flex-col items-center'>
            <GrGroup className='text-[#E6C7A1] text-4xl' />
            <h1 className='text-[#E6C7A1] text-2xl font-semibold my-2'>50, 000+</h1>
            <h3 className='text-white'>Happy Customers</h3>
          </div>

          {/* 2 */}
          <div className='flex flex-col items-center'>
            <PiFlowerLotusLight className='text-[#E6C7A1] text-4xl' />
            <h1 className='text-[#E6C7A1] text-2xl font-semibold my-2'>10, 000+</h1>
            <h3 className='text-white'>Saree Sold</h3>
          </div>

          {/* 3 */}
          <div className='flex flex-col items-center'>
            <CiMedal className='text-[#E6C7A1] text-4xl' />
            <h1 className='text-[#E6C7A1] text-2xl font-semibold my-2'>4.8/5</h1>
            <h3 className='text-white'>Customer Rating</h3>
          </div>

          {/* 4 */}
          <div className='flex flex-col items-center'>
            <TfiWorld className='text-[#E6C7A1] text-4xl' />
            <h1 className='text-[#E6C7A1] text-2xl font-semibold my-2'>Across India</h1>
            <h3 className='text-white'>Serving Pan India</h3>
          </div>

        </div>
      </div>
      {/* Craftmanship End */}


      
      
      
      {/* Our Values Start */}
      <div className='bg-[#FEFAF8] py-10 px-4 '>
        <div className='w-full md:w-[90%] lg:w-[50%] mx-auto'>
          <div className='flex justify-center items-center gap-2 text-center'>
            <IoIosArrowRoundForward className='h-10 w-10 text-[#74202D]' />
            <h1 className='uppercase md:text-2xl font-semibold'>Our Values</h1>
            <IoIosArrowRoundBack className='h-10 w-10 text-[#74202D]' />
          </div>
        </div>

          <div className='w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-between gap-5 mt-5'>

            {/* div 1 */}
            <div className='flex items-center gap-5 bg-[#FEFAF8] py-6 px-4 shadow-lg border rounded-xl border-gray-300'>
              <div className='p-3 bg-[#F4EFEA] rounded-full'>
                <PiCompassRoseThin className='text-3xl text-[#74202D]' />
              </div>
              <div>
                <h2 className='font-bold mb-2'>Authenticity</h2>
                <h5 className='text-gray-600 text-sm'>
                  We stay true to our roots and bring you genuine handloom sarees.
                </h5>
              </div>
            </div>


            {/* div 2 */}
            <div className='flex items-center gap-5 bg-[#FEFAF8] py-6 px-4 shadow-lg border rounded-xl border-gray-300'>
              <div className='p-3 bg-[#F4EFEA] rounded-full'>
                <BiLeaf className='text-3xl text-[#74202D]' />
              </div>
              <div>
                <h2 className='font-bold mb-2'>Sustainability</h2>
                <h5 className='text-gray-600 text-sm'>
                  We support our eco-friendly practices and empower local weavers.
                </h5>
              </div>
            </div>


            {/* div 3 */}
            <div className='flex items-center gap-5 bg-[#FEFAF8] py-6 px-4 shadow-lg border rounded-xl border-gray-300'>
              <div className='p-3 bg-[#F4EFEA] rounded-full'>
                <FaRegHeart className='text-3xl text-[#74202D]' />
              </div>
              <div>
                <h2 className='font-bold mb-2'>Customer First</h2>
                <h5 className='text-gray-600 text-sm'>
                  Your satisfaction is our priority. at every point always.
                </h5>
              </div>
            </div>


            {/* div 4 */}
            <div className='flex items-center gap-5 bg-[#FEFAF8] py-6 px-4 shadow-lg border rounded-xl border-gray-300'>
              <div className='p-3 bg-[#F4EFEA] rounded-full'>
                <BsFlower2 className='text-3xl text-[#74202D]' />
              </div>
              <div>
                <h2 className='font-bold mb-2'>Timeless Elegance</h2>
                <h5 className='text-gray-600 text-sm'>
                  We believe every saree tells a story of grace that never fades.
                </h5>
              </div>
            </div>


          </div>
      </div>
      {/* Our Values End */}

    </div>
  )
}

export default About