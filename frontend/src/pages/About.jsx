import { GrGroup } from "react-icons/gr";
import { IoDiamondOutline } from "react-icons/io5";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { PiFlowerLotusLight, PiCompassRoseThin } from "react-icons/pi";
import { CiMedal } from "react-icons/ci";
import { TfiWorld } from "react-icons/tfi";
import { BiLeaf } from "react-icons/bi";
import { BsFlower2 } from "react-icons/bs";
import { Link } from "react-router-dom";
import FadeUp from "../components/animations/FadeUp";
import FadeImage from "../components/animations/FadeImage";

const About = () => {

  const crafts = [
    {
      img : "/images/craft/craft-1.png",
      title : "Finest Material",
      subTitle : "We source premium quality fabrics that define elegance and comfort.",
    },
    {
      img : "/images/craft/craft-2.png",
      title : "Skilled Artist",
      subTitle : "Our Sarees are woven by skilled hands with Generations of expertise.",
    },
    {
      img : "/images/craft/craft-3.png",
      title : "Exquisite Designs",
      subTitle : "From Classic weaves to contemporary styles designed for every you.",
    },
    {
      img : "/images/craft/craft-4.png",
      title : "Impeccable Finish",
      subTitle : "Every Sarees goes through strict quality checks to ensure perfection.",
    },
    {
      img : "/images/craft/craft-5.png",
      title : "Thoughful Packaging",
      subTitle : "Delivered with care, because you deserve the best experience.",
    },
  ]
  return (
    <div className='w-full bg-[#FEFAF8]'>

      {/* Banner Start */}
      <div className="bg-[url('/images/banner/banner-2.png')] bg-cover bg-center h-75 sm:h-100 md:h-125 lg:h-162.5 2xl:h-200 w-full 
      flex items-center px-5 relative overflow-hidden">
        <div className='w-full lg:w-[70%] lg:ml-10 absolute'>
          <FadeUp delay={0.1}>
            <h3 className='text-xs md:text-sm text-[#74202D] font-bold uppercase'>About Us</h3>
            <h1 className="text-lg sm:text-3xl lg:text-5xl font-semibold text-[#4A1F1C]">Celebrating Tradition, <br /> Embracing Elegance</h1>
            <div className='w-[50%] border md:w-[35%] lg:w-[40%] text-[#74202D] rounded-lg my-2 md:my-4 lg:my-8'></div>
            <p className='w-[60%] md:w-[50%] text-[#3b3737] text-xs md:text-base'>
              At Saree, we believe a saree is more than just attire—it's a story woven with heritage, culture, and 
              timeless beauty. Our collections are a tribute to the artistry of Indian weavers and the elegance of 
              every woman who wears it.
            </p>

            <Link to="/shop">
              <button className='bg-[#74202D] text-white uppercase py-1.5 px-3 md:py-2 md:px-8 rounded
                  hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer
                  transition text-xs md:text-sm font-semibold mt-5'>
                    Explore Collection
              </button>
            </Link>
          </FadeUp>
        </div>
      </div>
      {/* Banner End */}

      {/* Journey Start */}
      <div className='container py-15 px-5 md:py-10 md:px-15 flex flex-col lg:flex-row gap-10 lg:gap-20 mx-auto items-center'>
        <div className='w-full h-auto md:w-[80%] mx-auto lg:w-[40%] md:h-90 lg:h-100 2xl:h-120'>
          <FadeImage 
            loading="lazy" 
            decoding="async" 
            className='h-full w-full object-cover rounded-2xl shadow-lg' 
            src="/images/aboutjourney.png" 
            alt="Our Weaving Journey" 
          />
        </div>

        <div className='w-full lg:w-[60%] text-center lg:text-start'>
          <FadeUp delay={0.1}>
            <h3 className='text-[#74202D] font-semibold text-sm uppercase'>Our Journey</h3>
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-[#4A1F1C] my-4">From Looms to Loved <br /> By Generations</h1>
            <p className='w-full md:w-[70%] mx-auto lg:mx-0 text-[#3b3737] text-sm md:text-base'>
              What began as a small passion for traditional weaves has grown into a brand trusted by thousands of Saree
              lovers across the country. We worked closely with skilled artisans and weavers to bring authentic sarees
              that reflect india's rich textile legacy.
            </p>
          </FadeUp>

          <div className='w-full flex flex-col md:flex-row gap-10 mt-10 items-center'>
            <FadeUp delay={0.2} className='flex flex-col items-center text-center'>
              <GrGroup className='text-2xl md:text-3xl text-[#74202D]' />
              <h1 className='uppercase text-sm font-bold mt-2 text-[#4A1F1C] '>
                Rooted in Tradition
              </h1>
              <h2 className='text-xs sm:text-sm text-gray-600'>
                Honoring age-old weaving technique and designs. 
              </h2>
            </FadeUp>
          
            <FadeUp delay={0.3} className='flex flex-col items-center text-center'>
              <IoDiamondOutline className='text-2xl md:text-3xl text-[#74202D]' />
              <h1 className='uppercase text-sm font-bold mt-2 text-[#4A1F1C]'>
                Quality You Can Trust
              </h1>
              <h2 className='text-xs sm:text-sm text-gray-600'>
                Carefully curated sarees with finest quality.
              </h2>
            </FadeUp>
          
            <FadeUp delay={0.4} className='flex flex-col items-center text-center'>
              <FaRegHeart className='text-2xl md:text-3xl text-[#74202D]' />
              <h1 className='uppercase text-sm font-bold mt-2 text-[#4A1F1C]'>
                Loved by Thousands
              </h1>
              <h2 className='text-xs sm:text-sm text-gray-600'>
                Trusted by customers across the country.
              </h2>
            </FadeUp>
          </div>
        </div>
      </div>
      {/* Journey End */}

      {/* Craftmanship Start */}
      <div className='w-full bg-[#F4EFEA] py-16'>
        <div className='container mx-auto px-4 md:px-20'>
          <FadeUp delay={0.1} className='w-full md:w-[90%] lg:w-[50%] mx-auto text-center'>
            <div className='flex justify-center items-center gap-2'>
              <IoIosArrowRoundForward className='h-10 w-10 text-[#74202D]' />
              <h1 className='uppercase md:text-2xl font-semibold'>The Art Of Craftmanship</h1>
              <IoIosArrowRoundBack className='h-10 w-10 text-[#74202D]' />
            </div>
            <h5 className='text-center text-sm mt-2 md:text-base text-gray-700'>Every Saree is a masterpiece, crafted with precision, passion and patience.</h5>
          </FadeUp>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-12'>
            {crafts.map((craft, idx) => (
              <FadeUp key={craft.title} delay={0.1 + idx * 0.08} className='text-center group'>
                <img 
                  loading="lazy" decoding="async"
                  className='h-36 w-36 mx-auto object-cover rounded-full border-4 border-white shadow-md group-hover:border-[#74202D] 
                  group-hover:scale-105 transition-all duration-300 cursor-pointer' 
                  src={craft.img} 
                  alt={craft.title}
                />
                <h1 className='mt-4 mb-2 font-semibold text-base text-[#4A1F1C]'>{craft.title}</h1>
                <p className='text-xs text-gray-600 leading-relaxed px-2'>{craft.subTitle}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className='bg-[#74202D] py-12'>
        <div className='w-[90%] lg:w-[70%] grid grid-cols-2 md:grid-cols-4 gap-8 mx-auto text-center'>
          
          <FadeUp delay={0.1} className='flex flex-col items-center'>
            <GrGroup className='text-[#E6C7A1] text-4xl' />
            <h1 className='text-[#E6C7A1] text-2xl sm:text-3xl font-bold my-2'>50,000+</h1>
            <h3 className='text-white text-xs sm:text-sm font-medium'>Happy Customers</h3>
          </FadeUp>

          <FadeUp delay={0.2} className='flex flex-col items-center'>
            <PiFlowerLotusLight className='text-[#E6C7A1] text-4xl' />
            <h1 className='text-[#E6C7A1] text-2xl sm:text-3xl font-bold my-2'>10,000+</h1>
            <h3 className='text-white text-xs sm:text-sm font-medium'>Sarees Sold</h3>
          </FadeUp>

          <FadeUp delay={0.3} className='flex flex-col items-center'>
            <CiMedal className='text-[#E6C7A1] text-4xl' />
            <h1 className='text-[#E6C7A1] text-2xl sm:text-3xl font-bold my-2'>4.8 / 5</h1>
            <h3 className='text-white text-xs sm:text-sm font-medium'>Customer Rating</h3>
          </FadeUp>

          <FadeUp delay={0.4} className='flex flex-col items-center'>
            <TfiWorld className='text-[#E6C7A1] text-4xl' />
            <h1 className='text-[#E6C7A1] text-2xl sm:text-3xl font-bold my-2'>Pan India</h1>
            <h3 className='text-white text-xs sm:text-sm font-medium'>Express Delivery</h3>
          </FadeUp>

        </div>
      </div>
      {/* Craftmanship End */}

      {/* Our Values Start */}
      <div className='container bg-[#FEFAF8] py-16 px-4 mx-auto'>
        <FadeUp delay={0.1} className='w-full md:w-[90%] lg:w-[50%] mx-auto text-center'>
          <div className='flex justify-center items-center gap-2'>
            <IoIosArrowRoundForward className='h-10 w-10 text-[#74202D]' />
            <h1 className='uppercase md:text-2xl font-semibold'>Our Values</h1>
            <IoIosArrowRoundBack className='h-10 w-10 text-[#74202D]' />
          </div>
        </FadeUp>

        <div className='w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-between gap-6 mt-10'>

          {/* div 1 */}
          <FadeUp delay={0.1} className='flex items-center gap-4 bg-white py-6 px-5 shadow-sm border rounded-2xl border-gray-200 hover:shadow-md transition'>
            <div className='p-3 bg-[#F4EFEA] rounded-2xl flex-shrink-0'>
              <PiCompassRoseThin className='text-3xl text-[#74202D]' />
            </div>
            <div>
              <h2 className='font-bold mb-1 text-base text-[#4A1F1C]'>Authenticity</h2>
              <h5 className='text-gray-600 text-xs leading-relaxed'>
                We stay true to our roots and bring you genuine handloom sarees.
              </h5>
            </div>
          </FadeUp>

          {/* div 2 */}
          <FadeUp delay={0.2} className='flex items-center gap-4 bg-white py-6 px-5 shadow-sm border rounded-2xl border-gray-200 hover:shadow-md transition'>
            <div className='p-3 bg-[#F4EFEA] rounded-2xl flex-shrink-0'>
              <BiLeaf className='text-3xl text-[#74202D]' />
            </div>
            <div>
              <h2 className='font-bold mb-1 text-base text-[#4A1F1C]'>Sustainability</h2>
              <h5 className='text-gray-600 text-xs leading-relaxed'>
                We support eco-friendly practices and empower local weavers.
              </h5>
            </div>
          </FadeUp>

          {/* div 3 */}
          <FadeUp delay={0.3} className='flex items-center gap-4 bg-white py-6 px-5 shadow-sm border rounded-2xl border-gray-200 hover:shadow-md transition'>
            <div className='p-3 bg-[#F4EFEA] rounded-2xl flex-shrink-0'>
              <FaRegHeart className='text-3xl text-[#74202D]' />
            </div>
            <div>
              <h2 className='font-bold mb-1 text-base text-[#4A1F1C]'>Customer First</h2>
              <h5 className='text-gray-600 text-xs leading-relaxed'>
                Your satisfaction is our priority at every single touchpoint.
              </h5>
            </div>
          </FadeUp>

          {/* div 4 */}
          <FadeUp delay={0.4} className='flex items-center gap-4 bg-white py-6 px-5 shadow-sm border rounded-2xl border-gray-200 hover:shadow-md transition'>
            <div className='p-3 bg-[#F4EFEA] rounded-2xl flex-shrink-0'>
              <BsFlower2 className='text-3xl text-[#74202D]' />
            </div>
            <div>
              <h2 className='font-bold mb-1 text-base text-[#4A1F1C]'>Timeless Elegance</h2>
              <h5 className='text-gray-600 text-xs leading-relaxed'>
                We believe every saree tells a story of grace that never fades.
              </h5>
            </div>
          </FadeUp>

        </div>
      </div>
      {/* Our Values End */}

    </div>
  )
}

export default About