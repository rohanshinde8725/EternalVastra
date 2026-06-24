import React, { useState } from "react";
// import { FiPhone } from "react-icons/fi";
// import { CiMail, CiClock2, CiLocationOn } from "react-icons/ci";
import { FaClock } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import {  FiMapPin, FiPhone, FiMail, FiSend } from "react-icons/fi";
import BottomTrustBar from "../components/bottomtrustbar/BottomTrustBar";

const Contact = () => {

  const [formData, setFormData] = useState({
    firstName : '',
    lastName : '',
    phoneNo : '',
    email : '',
    subject : '',
    message : '',
  })

  const handleChange = (e) => {
    setFormData(
      {...formData, [e.target.name] : e.target.value}
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    setFormData({
      firstName : '',
      lastName : '',
      phoneNo : '',
      email : '',
      subject : '',
      message : '',
    })
  }


  const info = [
    {
      id: 1,
      icon: <FaPhoneAlt />,
      heading: "Call Us",
      desc: "+91 98564 75612",
      desc2: "Mon - Sat: 10:00 AM - 7:00 PM",
    },
    {
      id: 2,
      icon: <IoMdMail />,
      heading: "Email Us",
      desc: "support@sareecollection.com",
      desc2: "We reply within 24 hours",
    },
    {
      id: 3,
      icon: <FaLocationDot />,
      heading: "Visit Us",
      desc: "123, Textile Street, T. Nagar,",
      desc2: "Mumbai - 400078, Maharashtra",
    },
    {
      id: 4,
      icon: <FaClock />,
      heading: "Working Hours",
      desc: "+91 98564 75612",
      desc2: "Mon - Sat: 10:00 AM - 7:00 PM",
    },
  ];
  return (
    <div>
      {/* Banner Start */}
      <div
        className="bg-[url('/images/contact-banner.png')] bg-cover bg-center h-75 sm:h-100 md:h-125 lg:h-162.5 2xl:h-200 w-full 
        flex items-center px-5 md:px-16 lg:px-24 relative overflow-hidden"
      >
        <div className="w-full lg:w-[70%] lg:ml-10 absolute">
          <h3 className="text-xs md:text-sm text-[#74202D] font-bold uppercase">
            Contact Us
          </h3>
          <h1 className="text-lg sm:text-3xl lg:text-5xl font-semibold text-[#4A1F1C]">
            We're Here, <br /> To Help You
          </h1>
          <div className="w-[50%] border md:w-[35%] lg:w-[30%] text-[#74202D] rounded-lg my-2 md:my-4 lg:my-8"></div>
          <p className="w-[60%] md:w-[30%] text-[#3b3737] text-xs md:text-base">
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
      <div
        className="w-[95%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#FEFAF8] mt-20 mx-auto md:mx-10 
        rounded-xl overflow-hidden shadow-sm">
        {info.map((item, index) => (
          <div
            key={index}
            className={` flex items-center justify-center gap-4 py-10 px-5 border-b md:border-b-0
                lg:border-r last:border-r-0 last:border-b-0 border-gray-300`}>
            <div
              className="h-12 w-12 min-w-12 border-2 border-[#74202D] text-[#74202D]
                rounded-full flex items-center justify-center text-xl">
              {item.icon}
            </div>
            <div>
              <h2 className="font-bold text-[#74202D] text-sm">
                {item.heading}
              </h2>
              <p className="mt-1 text-xs text-gray-600">{item.desc}</p>
              <p className="text-xs text-gray-600">{item.desc2}</p>
            </div>
          </div>
        ))}
      </div>
      {/* TrustBar End here */}

      {/* Form Start here */}
      <div className="w-[95%] flex flex-col lg:flex-row gap-10 mx-auto my-20">
        {/* Form */}
        <div className="lg:w-1/2 border border-gray-300 rounded-sm p-10 px-5">
          <h1 className="uppercase text-center text-2xl font-semibold mb-6 text-[#8f3f50]">
            Send Us A Message
          </h1>

          <form className="space-y-5">
            {/* Name */}
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="firstName">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  id="firstName"
                  className="w-full py-2 px-4 border border-gray-300 rounded-sm outline-none focus:border-[#74202D]"
                  type="text"
                  placeholder="Enter Your First Name"
                />
              </div>

              <div className="flex flex-col w-full gap-2">
                <label htmlFor="lastName">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  id="lastName"
                  className="w-full py-2 px-4 border border-gray-300 rounded-sm outline-none focus:border-[#74202D]"
                  type="text"
                  placeholder="Enter Your Last Name"
                />
              </div>
            </div>

            {/* Phone Email */}
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="phone">Phone No</label>
                <input
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  id="phone"
                  className="w-full py-2 px-4 border border-gray-300 rounded-sm outline-none focus:border-[#74202D]"
                  type="tel"
                  placeholder="Enter your Phone No"
                />
              </div>

              <div className="flex flex-col w-full gap-2">
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  id="email"
                  className="w-full py-2 px-4 border border-gray-300 rounded-sm outline-none focus:border-[#74202D]"
                  type="email"
                  placeholder="Enter Your Email"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label htmlFor="subject">Subject</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                id="subject"
                className="w-full py-2 px-4 border border-gray-300 rounded-sm outline-none focus:border-[#74202D]"
                type="text"
                placeholder="Write Your Subject"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message">Message</label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                id="message"
                rows="5"
                className="w-full py-2 px-4 border border-gray-300 rounded-sm outline-none resize-none focus:border-[#74202D]"
                placeholder="Write Your Message"
              />
            </div>

            {/* Button */}
            <button
            onClick={handleSubmit}
              type="submit"
              className="
                bg-[#74202D] text-white uppercase py-2 px-8 rounded-sm
                hover:bg-white border-2 border-[#74202D]
                hover:text-[#74202D] cursor-pointer
                transition text-sm font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Our Store */}
        <div className="lg:w-1/2 border border-gray-300 rounded-sm p-10 px-5">
        <h2 className="text-2xl font-semibold tracking-wide">
            OUR STORE
        </h2>
          <div className="max-w-6xl mx-auto bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              {/* Left Content */}
              <div className="">

                <div className="space-y-7">
                  {/* Address */}
                  <div className="flex gap-5">
                    <FiMapPin className="text-[#8f3f50] mt-1" size={26} />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Saree Collections
                      </h3>
                      <p className="text-gray-500 leading-7 mt-2">
                        123, Textile Street, T. Nagar,
                        <br />
                        Mumbai - 400078, Maharashtra, India.
                      </p>
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="flex items-center gap-5">
                    <FiPhone className="text-[#8f3f50]" size={25} />
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-5">
                    <FiMail className="text-[#8f3f50]" size={25} />
                    <p className="text-gray-600">
                      support@sareecollections.com
                    </p>
                  </div>
                </div>

                <button
                    className="bg-white text-[#74202D] uppercase py-1.5 px-4 rounded-sm cursor-pointer 
                    hover:bg-[#74202D] border-2 border-[#74202D] hover:text-white transition-all 
                    duration-300 font-semibold text-sm mt-5 flex items-center gap-3"
                >
                  GET DIRECTIONS
                  <FiSend size={16} />
                </button>
              </div>
              {/* Image */}
              <div className="mt-10 lg:mt-0">
                <img
                  src="/images/store.jpg"
                  alt="store"
                  className=" w-full h-102.5 object-cover rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Form End here */}

      <div className="mb-20">
        <BottomTrustBar />
      </div>
    </div>
  );
};

export default Contact;
