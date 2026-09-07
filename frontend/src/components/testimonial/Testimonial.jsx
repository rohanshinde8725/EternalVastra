import { GiThreeLeaves } from "react-icons/gi";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules'
import Rating from '../rating/Rating';
import BottomTrustBar from '../bottomtrustbar/BottomTrustBar'
import FadeUp from '../animations/FadeUp';


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
    <div className='py-8 sm:py-12 md:py-14 bg-[#FEFAF8] w-full'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8'>
        <FadeUp delay={0.1}>
          <div className='flex items-center justify-center gap-2 sm:gap-3 text-center'>
              <GiThreeLeaves className='text-[#74202D] text-lg sm:text-xl md:text-2xl' />
              <h2 className='uppercase font-semibold text-xl sm:text-2xl md:text-3xl text-slate-800 tracking-tight'>What Our Customers Say</h2>
              <GiThreeLeaves className='text-[#74202D] text-lg sm:text-xl md:text-2xl' />
          </div>
        </FadeUp>

        <div className="mt-8 sm:mt-10 md:mt-12">
          <Swiper
              className='w-full py-2'
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={3}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
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
              {testimonial.map((item, index) => (
                  <SwiperSlide key={index} className="h-auto">
                      <div className='h-full bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow duration-300'>
                          {/* Review */}
                          <FadeUp delay={0.05 + index * 0.05}>
                              <p className='text-slate-600 italic text-center text-xs sm:text-sm md:text-base leading-relaxed'>
                              “{item.review}”
                              </p>
                          </FadeUp>
                          {/* User */}
                          <div className='flex items-center justify-center gap-3.5 sm:gap-4 mt-6 pt-4 border-t border-gray-100'>
                            <img
                                loading="lazy"
                                decoding="async"
                                src={item.img}
                                alt={item.name}
                                className='w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#74202D]/30 shrink-0' 
                            />  
                            <FadeUp delay={0.1}>
                                <div className="text-left">
                                    <h3 className='font-semibold text-xs sm:text-sm text-slate-800'>{item.name}</h3>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                        <Rating rating={item.rating || 5}/>
                                    </div>
                                </div>
                            </FadeUp>
                          </div>
                      </div>
                  </SwiperSlide>
              ))}
          </Swiper>
        </div>

        <BottomTrustBar />
      </div>
    </div>
  );
};

export default Testimonial