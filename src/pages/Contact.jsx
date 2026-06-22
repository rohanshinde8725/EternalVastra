import React from 'react'
// import { FiPhone } from "react-icons/fi";
// import { CiMail, CiClock2, CiLocationOn } from "react-icons/ci";
import { FaClock } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";

const Contact = () => {

    const info = [
        {
            id : 1,
            icon : <FaPhoneAlt />,
            heading : 'Call Us',
            desc : '+91 98564 75612',
            desc2 : 'Mon - Sat: 10:00 AM - 7:00 PM',
        },
        {
            id : 2,
            icon : <IoMdMail />,
            heading : 'Email Us',
            desc : 'support@sareecollection.com',
            desc2 : 'We reply within 24 hours',
        },
        {
            id : 3,
            icon : <FaLocationDot />,
            heading : 'Visit Us',
            desc : '123, Textile Street, T. Nagar,',
            desc2 : 'Mumbai - 400078, Maharashtra',
        },
        {
            id : 4,
            icon : <FaClock  />,
            heading : 'Working Hours',
            desc : '+91 98564 75612',
            desc2 : 'Mon - Sat: 10:00 AM - 7:00 PM',
        },
    ]
  return (
    <div>

        {/* Banner Start */}
      <div className="bg-[url('/images/contact-banner.png')] bg-cover bg-center h-75 sm:h-100 md:h-125 lg:h-162.5 2xl:h-200 w-full 
        flex items-center px-5 md:px-16 lg:px-24 relative overflow-hidden">
        <div className='w-full lg:w-[70%] lg:ml-10 absolute'>
          <h3 className='text-xs md:text-sm text-[#74202D] font-bold uppercase'>Contact Us</h3>
          <h1 className="text-lg sm:text-3xl lg:text-5xl font-semibold text-[#4A1F1C]">We're Here, <br /> To Help You</h1>
          <div className='w-[50%] border md:w-[35%] lg:w-[30%] text-[#74202D] rounded-lg my-2 md:my-4 lg:my-8'></div>
          <p className='w-[60%] md:w-[30%] text-[#3b3737] text-xs md:text-base'>
            Have questions or need assistance? Our team is just a message away.
          </p>

          {/* <button className='bg-[#74202D] text-white uppercase py-1.5 px-3 md:py-2 md:px-8 rounded-lg
              hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer
              transition text-xs md:text-sm font-semibold mt-5'>
                Our Story
          </button> */}
        </div>
      </div>
      {/* Banner End */}


      {/* TrustBar Start here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-[#FEFAF8] my-10 mx-5 md:mx-10 rounded-xl overflow-hidden shadow-sm">
        {info.map((item, index) => (
            <div
                key={index}
                    className={` flex items-center justify-center gap-4 py-10 px-5 border-b md:border-b-0
                    lg:border-r last:border-r-0 last:border-b-0 border-gray-400`}>
                <div className="h-12 w-12 min-w-12 border-2 border-[#74202D] text-[#74202D]
                    rounded-full flex items-center justify-center text-xl">
                    {item.icon}
                </div>

                <div>
                    <h2 className="font-bold text-[#74202D] text-sm">
                    {item.heading}
                    </h2>

                    <p className="mt-1 text-xs text-gray-600">
                    {item.desc}
                    </p>

                    <p className="text-xs text-gray-600">
                    {item.desc2}
                    </p>
                </div>
            </div>
        ))}
    </div>
    {/* TrustBar End here */}


    </div>
  )
}

export default Contact