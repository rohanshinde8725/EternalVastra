<<<<<<< HEAD
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../api/products";

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/_rohan_.0710/",
    github: "https://github.com/rohanshinde8725",
    linkedin: "https://www.linkedin.com/in/rohan-shinde-397195256",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSocialLinks({
            facebook: data.facebook || "https://www.facebook.com/",
            instagram: data.instagram || "https://www.instagram.com/_rohan_.0710/",
            github: data.github || "https://github.com/rohanshinde8725",
            linkedin: data.linkedin || "https://www.linkedin.com/in/rohan-shinde-397195256",
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className='bg-[#F6DBC6] w-full pt-10 pb-24 lg:py-10'>
  <div className='px-5 sm:px-8 lg:px-10 flex flex-col lg:flex-row gap-10'>
=======
import { FaFacebookF, FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className='bg-[#F6DBC6] w-full pt-10 pb-24 lg:py-10'>
  <div className='container px-5 sm:px-8 lg:px-10 flex flex-col lg:flex-row gap-10'>
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae

    {/* Div 1 */}
    <div className='w-full lg:w-[25%] text-center lg:text-left'>
      <div className='h-20 w-40 mx-auto lg:mx-0'>
        <img src="/images/navImg2.png" alt="" loading="lazy" decoding="async" className='h-full w-full object-contain' />
      </div>

      <p className='text-sm my-6'>
        Bring you the finest collection of sarees that celebrate tradition, elegance & beauty.
      </p>

      <div className='flex justify-center lg:justify-start gap-6 text-[#74202D] text-lg'>
<<<<<<< HEAD
        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
          <FaFacebookF className='cursor-pointer hover:text-[#440710]' />
        </a>
        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
          <FaInstagram className='cursor-pointer hover:text-[#440710]' />
        </a>
        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
          <FaGithub className='cursor-pointer hover:text-[#440710]' />
        </a>
        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
=======
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
          <FaFacebookF className='cursor-pointer hover:text-[#440710]' />
        </a>
        <a href="https://www.instagram.com/_rohan_.0710/" target="_blank" rel="noopener noreferrer">
          <FaInstagram className='cursor-pointer hover:text-[#440710]' />
        </a>
        <a href="https://github.com/rohanshinde8725" target="_blank" rel="noopener noreferrer">
          <FaGithub className='cursor-pointer hover:text-[#440710]' />
        </a>
        <a href="https://www.linkedin.com/in/rohan-shinde-397195256" target="_blank" rel="noopener noreferrer">
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
          <FaLinkedinIn className='cursor-pointer hover:text-[#440710]' />
        </a>
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
          <li className='cursor-pointer hover:scale-105 transition'>
            <Link to='/shop'>All Sarees</Link>
          </li>
          <li className='cursor-pointer hover:scale-105 transition'>
            <Link to='/shop?category=Silk%20Sarees'>Silk Sarees</Link>
          </li>
          <li className='cursor-pointer hover:scale-105 transition'>
            <Link to='/shop?category=Cotton%20Sarees'>Cotton Sarees</Link>
          </li>
          <li className='cursor-pointer hover:scale-105 transition'>
            <Link to='/shop?category=Paithani%20Sarees'>Paithani Sarees</Link>
          </li>
          <li className='cursor-pointer hover:scale-105 transition'>
            <Link to='/shop?search=New%20Arrivals'>New Arrivals</Link>
          </li>
          <li className='cursor-pointer hover:scale-105 transition'>
            <Link to='/shop?search=Sale'>Sale</Link>
          </li>
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