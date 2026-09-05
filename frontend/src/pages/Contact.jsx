import React, { useState } from "react";
import { FaClock, FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import BottomTrustBar from "../components/bottomtrustbar/BottomTrustBar";
import FadeUp from "../components/animations/FadeUp";
import { API_BASE_URL } from "../api/products";

const Contact = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNo: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData(
      { ...formData, [e.target.name]: e.target.value }
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    setFormData({
      firstName: '',
      lastName: '',
      phoneNo: '',
      email: '',
      subject: '',
      message: '',
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
      desc: "support@eternalvastra.com",
      desc2: "We reply within 24 hours",
    },
    {
      id: 3,
      icon: <FaLocationDot />,
      heading: "Visit Us",
      desc: "Mumbai, Maharashtra, India",
      desc2: "Experience our luxury studio",
    },
    {
      id: 4,
      icon: <FaClock />,
      heading: "Working Hours",
      desc: "Mon - Sat: 10:00 AM - 7:00 PM",
      desc2: "Sunday: Closed",
    },
  ];
  return (
    <div>
      {/* Banner Start */}
      <div
        className="bg-[url('/images/banner/contact-banner.png')] bg-cover bg-center h-60 w-full 
        flex items-center px-5 md:px-16 lg:px-24 relative overflow-hidden"
      >
        <div className="w-full lg:w-[70%] lg:ml-10 absolute">
          <FadeUp delay={0.1}>
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
          </FadeUp>
        </div>
      </div>
      {/* Banner End */}

      {/* TrustBar Start here */}
      <div
        className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#FEFAF8] mt-20 mx-auto 
        rounded-lg overflow-hidden shadow-sm border border-gray-200">
        {info.map((item, index) => (
          <FadeUp
            key={index}
            delay={0.1 + index * 0.08}
            className={` flex items-center justify-center gap-4 py-10 px-5 border-b md:border-b-0
                lg:border-r last:border-r-0 last:border-b-0 border-gray-300`}
          >
            <div
              className="h-12 w-12 min-w-12 border-2 border-[#74202D] text-[#74202D]
                rounded-full flex items-center justify-center text-xl">
              {item.icon}
            </div>
            <div>
              <h2 className="font-bold text-[#74202D] text-xl">
                {item.heading}
              </h2>
              <p className="mt-1 text-base text-gray-600">{item.desc}</p>
              <p className="text-base text-gray-600">{item.desc2}</p>
            </div>
          </FadeUp>
        ))}
      </div>
      {/* TrustBar End here */}

      {/* Form Start here */}
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 mx-auto mt-20 mb-0 items-stretch">
        {/* Form */}
        <FadeUp delay={0.2} className="w-full h-full border border-gray-300 rounded-2xl p-8 sm:p-10 px-6 bg-white shadow-sm flex flex-col justify-center">
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
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#74202D]"
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
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#74202D]"
                  type="text"
                  placeholder="Enter Your Last Name"
                />
              </div>
            </div>

            {/* Phone Email */}
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="phoneNo">Phone Number</label>
                <input
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  id="phoneNo"
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#74202D]"
                  type="text"
                  placeholder="Enter Your Phone Number"
                />
              </div>

              <div className="flex flex-col w-full gap-2">
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  id="email"
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#74202D]"
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
                className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#74202D]"
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
                className="w-full py-2 px-4 border border-gray-300 rounded-lg outline-none resize-none focus:border-[#74202D]"
                placeholder="Write Your Message"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              type="submit"
              className="
                bg-[#74202D] text-white uppercase py-2 px-8 rounded-lg
                hover:bg-white border-2 border-[#74202D]
                hover:text-[#74202D] cursor-pointer
                transition text-sm font-semibold"
            >
              Send Message
            </button>
          </form>
        </FadeUp>

        {/* 2nd Card: Image Only - Takes Exact Same Height as Form */}
        <FadeUp delay={0.3} className="w-full h-full min-h-[400px] lg:min-h-0 rounded-2xl overflow-hidden shadow-sm border border-gray-300 relative bg-[#F5ECE0]">
          <img
            src="/images/eternal_vastra_store.jpg"
            alt="Eternal Vastra Flagship Store"
            onError={(e) => {
              if (!e.currentTarget.dataset.retried) {
                e.currentTarget.dataset.retried = "1";
                e.currentTarget.src = `${API_BASE_URL}/images/eternal_vastra_store.jpg`;
              } else if (e.currentTarget.dataset.retried === "1") {
                e.currentTarget.dataset.retried = "2";
                e.currentTarget.src = "/images/store.jpg";
              }
            }}
            className="w-full h-full object-cover absolute inset-0"
          />
        </FadeUp>
      </div>
      {/* Form End here */}

      <div className="mb-20">
        <BottomTrustBar />
      </div>
    </div>
  );
};

export default Contact;
