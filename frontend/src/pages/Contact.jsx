import React, { useState } from "react";
import { FaClock, FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import BottomTrustBar from "../components/bottomtrustbar/BottomTrustBar";
import FadeUp from "../components/animations/FadeUp";
import { API_BASE_URL } from "../api/products";
import { useToast } from "../context/ToastContext";

const Contact = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName.trim()) {
      showToast.error("Please enter your first name.");
      return;
    }
    if (!formData.email.trim()) {
      showToast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      showToast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.message.trim()) {
      showToast.error("Please enter your message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        showToast.success("Thank you for reaching out! Your message has been sent successfully.");
        setFormData({
          firstName: "",
          lastName: "",
          phoneNo: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        showToast.error(data.message || "Unable to send your message. Please try again.");
      }
    } catch (err) {
      console.error("Contact submission error:", err);
      showToast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="w-full bg-[#FEFAF8]">
      {/* Banner Start */}
      <div className="bg-[url('/images/banner/contact-banner.png')] bg-cover bg-center h-48 sm:h-56 md:h-64 lg:h-72 w-full flex items-center relative overflow-hidden">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center mb-1.5 sm:mb-2 gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#74202D]">
              <span>Contact Us</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#4A1F1C] leading-tight">
              We're Here, <br />
              <span className="text-[#74202D]">To Help You</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-700 mt-2 sm:mt-3 max-w-xl leading-relaxed">
              Have questions or need assistance? Our team is just a message away.
            </p>
          </FadeUp>
        </div>
      </div>
      {/* Banner End */}

      {/* Contact Info / TrustBar Start here */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 lg:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white rounded-xl overflow-hidden shadow-xs border border-gray-200">
          {info.map((item, index) => (
            <FadeUp
              key={item.id || index}
              delay={0.08 + index * 0.06}
              className={`flex items-center justify-start sm:justify-center gap-3.5 sm:gap-4 lg:gap-3 xl:gap-4 py-5 sm:py-7 lg:py-5 xl:py-6 px-4 sm:px-5 lg:px-3.5 xl:px-5 border-b border-gray-200 
                sm:[&:nth-child(1)]:border-r sm:[&:nth-child(3)]:border-r sm:[&:nth-child(1)]:border-b sm:[&:nth-child(2)]:border-b sm:[&:nth-child(3)]:border-b-0 sm:[&:nth-child(4)]:border-b-0 
                lg:border-b-0 lg:border-r lg:last:border-r-0 last:border-b-0`}
            >
              <div
                className="h-10 w-10 sm:h-11 sm:w-11 lg:h-9 lg:w-9 xl:h-10 xl:w-10 min-w-10 sm:min-w-11 lg:min-w-9 xl:min-w-10 shrink-0 border-2 border-[#74202D] text-[#74202D]
                  rounded-full flex items-center justify-center text-base sm:text-lg lg:text-sm xl:text-base bg-white shadow-xs"
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-[#74202D] text-sm sm:text-base lg:text-sm xl:text-base leading-snug">
                  {item.heading}
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm lg:text-xs xl:text-sm text-slate-700 font-medium break-words">
                  {item.desc}
                </p>
                <p className="text-[11px] sm:text-xs lg:text-[11px] xl:text-xs text-slate-500 break-words">
                  {item.desc2}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
      {/* Contact Info / TrustBar End here */}

      {/* Form Start here */}
      <div className="max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mx-auto mt-12 sm:mt-16 mb-0 items-stretch px-4 sm:px-6 lg:px-8">
        {/* Form */}
        <FadeUp delay={0.2} className="w-full h-full border border-gray-300 rounded-2xl p-8 sm:p-10 px-6 bg-white shadow-sm flex flex-col justify-center">
          <h1 className="uppercase text-center text-2xl font-semibold mb-6 text-[#8f3f50]">
            Send Us A Message
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  required
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
                  type="tel"
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
                  required
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
                required
              />
            </div>

            {/* Button */}
            <button
              disabled={isSubmitting}
              type="submit"
              className={`
                bg-[#74202D] text-white uppercase py-2.5 px-8 rounded-lg
                hover:bg-white border-2 border-[#74202D]
                hover:text-[#74202D] cursor-pointer
                transition text-sm font-semibold flex items-center justify-center gap-2
                ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}
              `}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Sending...</span>
                </>
              ) : (
                "Send Message"
              )}
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
