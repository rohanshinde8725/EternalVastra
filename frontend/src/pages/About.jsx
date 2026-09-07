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
import Counter from "../components/animations/Counter";

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
      <div className="bg-[url('/images/banner/banner-2.png')] bg-cover bg-center h-60 w-full 
      flex items-center px-5 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden">
        <div className='max-w-[1600px] mx-auto w-full'>
          <FadeUp delay={0.1}>
            <span className='text-xs md:text-sm text-[#74202D] font-bold uppercase tracking-wider block mb-1'>About Us</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#4A1F1C] leading-tight">
              Celebrating Tradition, <br /> Embracing Elegance
            </h1>
          </FadeUp>
        </div>
      </div>
      {/* Banner End */}

      {/* Journey Start */}
      <div className='max-w-[1600px] mx-auto py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 lg:gap-16 items-center'>
        <div className='w-full md:w-[80%] mx-auto lg:w-[45%] h-72 sm:h-80 md:h-96 lg:h-[420px]'>
          <FadeImage 
            loading="lazy" 
            decoding="async" 
            className='h-full w-full object-cover rounded-2xl shadow-md' 
            src="/images/aboutjourney.png" 
            alt="Our Weaving Journey" 
          />
        </div>

        <div className='w-full lg:w-[55%] text-center lg:text-start space-y-4'>
          <FadeUp delay={0.1}>
            <span className='text-[#74202D] font-bold text-xs sm:text-sm uppercase tracking-wider block'>Our Journey</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#4A1F1C] mt-1 mb-3 leading-tight">
              From Looms to Loved <br /> By Generations
            </h2>
            <p className='text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed'>
              What began as a small passion for traditional weaves has grown into a brand trusted by thousands of Saree
              lovers across the country. We worked closely with skilled artisans and weavers to bring authentic sarees
              that reflect India's rich textile legacy.
            </p>
          </FadeUp>

          <div className='w-full grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4'>
            <FadeUp delay={0.2} className='flex flex-col items-center lg:items-start text-center lg:text-left'>
              <GrGroup className='text-2xl sm:text-3xl text-[#74202D]' />
              <h3 className='uppercase text-xs sm:text-sm font-bold mt-2 text-[#4A1F1C]'>
                Rooted in Tradition
              </h3>
              <p className='text-xs text-slate-600 mt-1 leading-snug'>
                Honoring age-old weaving techniques and designs. 
              </p>
            </FadeUp>
          
            <FadeUp delay={0.3} className='flex flex-col items-center lg:items-start text-center lg:text-left'>
              <IoDiamondOutline className='text-2xl sm:text-3xl text-[#74202D]' />
              <h3 className='uppercase text-xs sm:text-sm font-bold mt-2 text-[#4A1F1C]'>
                Quality You Can Trust
              </h3>
              <p className='text-xs text-slate-600 mt-1 leading-snug'>
                Carefully curated sarees with finest fabric quality.
              </p>
            </FadeUp>
          
            <FadeUp delay={0.4} className='flex flex-col items-center lg:items-start text-center lg:text-left'>
              <FaRegHeart className='text-2xl sm:text-3xl text-[#74202D]' />
              <h3 className='uppercase text-xs sm:text-sm font-bold mt-2 text-[#4A1F1C]'>
                Loved by Thousands
              </h3>
              <p className='text-xs text-slate-600 mt-1 leading-snug'>
                Trusted by customers across the country.
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
      {/* Journey End */}

      {/* Craftmanship Start */}
      <div className='w-full bg-[#F4EFEA] py-10 sm:py-14 md:py-16'>
        <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8'>
          <FadeUp delay={0.1} className='max-w-xl mx-auto text-center'>
            <div className='flex justify-center items-center gap-2 sm:gap-3'>
              <IoIosArrowRoundForward className='h-8 w-8 sm:h-10 sm:w-10 text-[#74202D]' />
              <h2 className='uppercase text-xl sm:text-2xl md:text-3xl font-semibold text-[#4A1F1C] tracking-tight'>The Art Of Craftsmanship</h2>
              <IoIosArrowRoundBack className='h-8 w-8 sm:h-10 sm:w-10 text-[#74202D]' />
            </div>
            <p className='text-center text-xs sm:text-sm md:text-base mt-2 text-slate-700'>
              Every Saree is a masterpiece, crafted with precision, passion, and patience.
            </p>
          </FadeUp>

          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 mt-8 sm:mt-10 md:mt-12'>
            {crafts.map((craft, idx) => (
              <FadeUp key={craft.title} delay={0.08 + idx * 0.06} className='text-center group'>
                <img 
                  loading="lazy" decoding="async"
                  className='h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 mx-auto object-cover rounded-full border-4 border-white shadow-md group-hover:border-[#74202D] 
                  group-hover:scale-105 transition-all duration-300 cursor-pointer' 
                  src={craft.img} 
                  alt={craft.title}
                />
                <h3 className='mt-3 sm:mt-4 mb-1 font-semibold text-xs sm:text-sm md:text-base text-[#4A1F1C]'>{craft.title}</h3>
                <p className='text-xs text-slate-600 leading-relaxed px-1'>{craft.subTitle}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className='bg-[#74202D] py-8 sm:py-10 md:py-12'>
        <div className='max-w-6xl px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mx-auto text-center'>
          
          <FadeUp delay={0.1} className='flex flex-col items-center'>
            <GrGroup className='text-[#E6C7A1] text-3xl sm:text-4xl' />
            <h2 className='text-[#E6C7A1] text-2xl sm:text-3xl font-bold my-1 sm:my-2'>
              <Counter target={50000} suffix="+" duration={2.2} />
            </h2>
            <p className='text-white text-xs sm:text-sm font-medium'>Happy Customers</p>
          </FadeUp>

          <FadeUp delay={0.2} className='flex flex-col items-center'>
            <PiFlowerLotusLight className='text-[#E6C7A1] text-3xl sm:text-4xl' />
            <h2 className='text-[#E6C7A1] text-2xl sm:text-3xl font-bold my-1 sm:my-2'>
              <Counter target={10000} suffix="+" duration={2.2} />
            </h2>
            <p className='text-white text-xs sm:text-sm font-medium'>Sarees Sold</p>
          </FadeUp>

          <FadeUp delay={0.3} className='flex flex-col items-center'>
            <CiMedal className='text-[#E6C7A1] text-3xl sm:text-4xl' />
            <h2 className='text-[#E6C7A1] text-2xl sm:text-3xl font-bold my-1 sm:my-2'>
              <Counter target={4.8} decimals={1} suffix=" / 5" duration={2.2} />
            </h2>
            <p className='text-white text-xs sm:text-sm font-medium'>Customer Rating</p>
          </FadeUp>

          <FadeUp delay={0.4} className='flex flex-col items-center'>
            <TfiWorld className='text-[#E6C7A1] text-3xl sm:text-4xl' />
            <h2 className='text-[#E6C7A1] text-2xl sm:text-3xl font-bold my-1 sm:my-2'>
              <Counter target={28} suffix="+ States" duration={2.2} />
            </h2>
            <p className='text-white text-xs sm:text-sm font-medium'>Pan India Express</p>
          </FadeUp>

        </div>
      </div>
      {/* Craftmanship End */}

      {/* Our Values Start */}
      <div className='max-w-[1600px] mx-auto py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8'>
        <FadeUp delay={0.1} className='max-w-xl mx-auto text-center'>
          <div className='flex justify-center items-center gap-2 sm:gap-3'>
            <IoIosArrowRoundForward className='h-8 w-8 sm:h-10 sm:w-10 text-[#74202D]' />
            <h2 className='uppercase text-xl sm:text-2xl md:text-3xl font-semibold text-[#4A1F1C] tracking-tight'>Our Values</h2>
            <IoIosArrowRoundBack className='h-8 w-8 sm:h-10 sm:w-10 text-[#74202D]' />
          </div>
        </FadeUp>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-8 sm:mt-10 md:mt-12'>

          {/* div 1 */}
          <FadeUp delay={0.1} className='flex items-start gap-3.5 bg-white p-5 sm:p-6 shadow-xs border rounded-2xl border-gray-200 hover:shadow-md transition'>
            <div className='p-2.5 sm:p-3 bg-[#F4EFEA] rounded-xl shrink-0'>
              <PiCompassRoseThin className='text-2xl sm:text-3xl text-[#74202D]' />
            </div>
            <div>
              <h3 className='font-bold mb-1 text-sm sm:text-base text-[#4A1F1C]'>Authenticity</h3>
              <p className='text-slate-600 text-xs sm:text-sm leading-relaxed'>
                We stay true to our roots and bring you genuine handloom sarees.
              </p>
            </div>
          </FadeUp>

          {/* div 2 */}
          <FadeUp delay={0.2} className='flex items-start gap-3.5 bg-white p-5 sm:p-6 shadow-xs border rounded-2xl border-gray-200 hover:shadow-md transition'>
            <div className='p-2.5 sm:p-3 bg-[#F4EFEA] rounded-xl shrink-0'>
              <BiLeaf className='text-2xl sm:text-3xl text-[#74202D]' />
            </div>
            <div>
              <h3 className='font-bold mb-1 text-sm sm:text-base text-[#4A1F1C]'>Sustainability</h3>
              <p className='text-slate-600 text-xs sm:text-sm leading-relaxed'>
                We support eco-friendly practices and empower local weavers.
              </p>
            </div>
          </FadeUp>

          {/* div 3 */}
          <FadeUp delay={0.3} className='flex items-start gap-3.5 bg-white p-5 sm:p-6 shadow-xs border rounded-2xl border-gray-200 hover:shadow-md transition'>
            <div className='p-2.5 sm:p-3 bg-[#F4EFEA] rounded-xl shrink-0'>
              <FaRegHeart className='text-2xl sm:text-3xl text-[#74202D]' />
            </div>
            <div>
              <h3 className='font-bold mb-1 text-sm sm:text-base text-[#4A1F1C]'>Customer First</h3>
              <p className='text-slate-600 text-xs sm:text-sm leading-relaxed'>
                Your satisfaction is our priority at every single touchpoint.
              </p>
            </div>
          </FadeUp>

          {/* div 4 */}
          <FadeUp delay={0.4} className='flex items-start gap-3.5 bg-white p-5 sm:p-6 shadow-xs border rounded-2xl border-gray-200 hover:shadow-md transition'>
            <div className='p-2.5 sm:p-3 bg-[#F4EFEA] rounded-xl shrink-0'>
              <BsFlower2 className='text-2xl sm:text-3xl text-[#74202D]' />
            </div>
            <div>
              <h3 className='font-bold mb-1 text-sm sm:text-base text-[#4A1F1C]'>Timeless Elegance</h3>
              <p className='text-slate-600 text-xs sm:text-sm leading-relaxed'>
                We believe every saree tells a story of grace that never fades.
              </p>
            </div>
          </FadeUp>

        </div>
      </div>
      {/* Our Values End */}

    </div>
  )
}

export default About