import React from 'react'
import { GiThreeLeaves } from "react-icons/gi";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import Rating from '../rating/Rating';
import BottomTrustBar from '../bottomtrustbar/BottomTrustBar'
import FadeUp from '../animations/FadeUp';
import FadeImage from '../animations/FadeImage';


const Testimonial = () => {

    const testimonial = [
        {
            review : "The saree quality is amazing and exactly as shown in the pictures. Truly loved it!",
            img : "/images/testimonial/testimonial-1.png",
            name : "Priya Sharma.",
            rating : 5,
        },

        {
            review : "Beautiful collection and super fast delivery. Will shop again!",
            img : "/images/testimonial/testimonial-2.png",
            name : "Anjali Mehta.",
            rating : 5,
        },

        {
            review : "Elegant design, soft fabric and great customer support.",
            img : "/images/testimonial/testimonial-3.png",
            name : "Meera Roy.",
            rating : 4.7,
        },

        {
            review : "Amazing craftsmanship and detailing. Worth every rupee.",
            img : "/images/testimonial/testimonial-4.png",
            name : "Ritika Gupta.",
            rating : 4.7,
        },
    ]

  return (
    <div className='py-12 sm:py-16 lg:py-20 bg-[#FEFAF8]'>

        <div className='flex items-center justify-center gap-2 sm:gap-3 text-center px-4'>
            <GiThreeLeaves className='text-[#74202D] text-lg sm:text-xl md:text-2xl' />
            <h1 className='uppercase font-semibold text-lg sm:text-xl md:text-2xl lg:text-2xl leading-snug'>What Our Customer Says</h1>
            <GiThreeLeaves className='text-[#74202D] text-lg sm:text-xl md:text-2xl' />
        </div>


        <Swiper
            className='h-60 w-[90%] mt-5'
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={3}
            autoplay={{ delay: 3000 }}
            loop={true}
            breakpoints={{
                0: {
                slidesPerView: 1, 
                },
                640: {
                slidesPerView: 2, 
                },
                768: {
                slidesPerView: 2, 
                },
                1024: {
                slidesPerView: 3, 
                },
                1440: {
                slidesPerView: 3, 
                },
            }}
            >
            {testimonial.map((testimonial, index) => (
                <SwiperSlide key={index}>
                    <div className='h-full bg-[#FEFAF8] backdrop-blur-md shadow-md rounded-xl py-10 px-10 flex flex-col justify-between'>
                        {/* Review */}
                        <FadeUp>
                            <p className='text-gray-600 italic text-center'>
                            “{testimonial.review}”
                            </p>
                        </FadeUp>
                        {/* User */}
                        <div className='flex items-center justify-center gap-5 mt-6'>
                    
                        <div>
                            <img
                                loading="lazy"
                                decoding="async"
                                src={testimonial.img}
                                alt={testimonial.name}
                                className='w-25 h-25 rounded-full object-cover' 
                            />  
                        </div>
                        <FadeUp>
                            <div>
                                <h3 className='font-semibold mb-2'>{testimonial.name}</h3>
                                <div className="text-sm text-gray-500">
                                    <Rating rating={5}/>
                                </div>
                            </div>
                        </FadeUp>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>

        <BottomTrustBar />
        
    </div>
  )
}

export default Testimonial