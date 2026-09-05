import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../api/products";
import Logo from "../common/Logo";

const Footer = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get("category");
  const currentSearch = searchParams.get("search");

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

  const isLinkActive = (path, category = null, search = null) => {
    if (location.pathname !== path) return false;
    if (category) return currentCategory === category;
    if (search) return currentSearch?.toLowerCase() === search.toLowerCase();
    if (!category && !search && path === "/shop") {
      return !currentCategory && !currentSearch;
    }
    return true;
  };

  const getLinkClasses = (isActive) =>
    `cursor-pointer transition-colors duration-200 inline-block ${
      isActive
        ? "text-[#6B1527] font-bold"
        : "text-[#3b3737] font-medium hover:text-[#6B1527]"
    }`;

  return (
    <div className='bg-[#F6DBC6] w-full pt-10 pb-24 lg:py-10'>
      <div className='container px-5 sm:px-8 lg:px-10 flex flex-col lg:flex-row gap-10'>

        {/* Div 1 */}
        <div className='w-full lg:w-[25%] text-center lg:text-left'>
          <div className='flex justify-center lg:justify-start'>
            <Logo className="h-12 sm:h-14 w-auto" />
          </div>

          <p className='text-sm my-6 text-[#3b3737] font-medium leading-relaxed'>
            Bring you the finest collection of sarees that celebrate tradition, elegance & beauty.
          </p>

          <div className='flex justify-center lg:justify-start gap-6 text-[#74202D] text-lg'>
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF className='cursor-pointer transition-colors duration-200 hover:text-[#6B1527]' />
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className='cursor-pointer transition-colors duration-200 hover:text-[#6B1527]' />
            </a>
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub className='cursor-pointer transition-colors duration-200 hover:text-[#6B1527]' />
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn className='cursor-pointer transition-colors duration-200 hover:text-[#6B1527]' />
            </a>
          </div>
        </div>

        {/* Div 2 */}
        <div className='w-full lg:w-[50%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center lg:text-left'>
          
          <div>
            <h1 className='font-bold text-lg uppercase text-[#1a1a1a]'>Quick Links</h1>
            <ul className='mt-4 flex flex-col gap-2.5 text-sm list-none'>
              <li>
                <Link to="/about" className={getLinkClasses(isLinkActive("/about"))}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className={getLinkClasses(isLinkActive("/contact"))}>
                  Contact Us
                </Link>
              </li>
              <li className="cursor-pointer text-[#3b3737] font-medium hover:text-[#6B1527] transition-colors duration-200">
                Track order
              </li>
              <li className="cursor-pointer text-[#3b3737] font-medium hover:text-[#6B1527] transition-colors duration-200">
                Shipping Policy
              </li>
              <li className="cursor-pointer text-[#3b3737] font-medium hover:text-[#6B1527] transition-colors duration-200">
                Returns & Refunds
              </li>
              <li className="cursor-pointer text-[#3b3737] font-medium hover:text-[#6B1527] transition-colors duration-200">
                FAQ's
              </li>
            </ul>
          </div>

          <div>
            <h1 className='font-bold text-lg uppercase text-[#1a1a1a]'>Shop</h1>
            <ul className='mt-4 flex flex-col gap-2.5 text-sm decoration-none'>
              <li>
                <Link to='/shop' className={getLinkClasses(isLinkActive("/shop"))}>
                  All Sarees
                </Link>
              </li>
              <li>
                <Link to='/shop?category=Silk%20Sarees' className={getLinkClasses(isLinkActive("/shop", "Silk Sarees"))}>
                  Silk Sarees
                </Link>
              </li>
              <li>
                <Link to='/shop?category=Cotton%20Sarees' className={getLinkClasses(isLinkActive("/shop", "Cotton Sarees"))}>
                  Cotton Sarees
                </Link>
              </li>
              <li>
                <Link to='/shop?category=Paithani%20Sarees' className={getLinkClasses(isLinkActive("/shop", "Paithani Sarees"))}>
                  Paithani Sarees
                </Link>
              </li>
              <li>
                <Link to='/shop?search=New%20Arrivals' className={getLinkClasses(isLinkActive("/shop", null, "New Arrivals"))}>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to='/shop?search=Sale' className={getLinkClasses(isLinkActive("/shop", null, "Sale"))}>
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h1 className='font-bold text-lg uppercase text-[#1a1a1a]'>Collections</h1>
            <ul className='mt-4 flex flex-col gap-2.5 text-sm'>
              <li>
                <Link to='/shop?search=Wedding' className={getLinkClasses(isLinkActive("/shop", null, "Wedding"))}>
                  Wedding Collection
                </Link>
              </li>
              <li>
                <Link to='/shop?search=Festive' className={getLinkClasses(isLinkActive("/shop", null, "Festive"))}>
                  Festive Collection
                </Link>
              </li>
              <li>
                <Link to='/shop?search=Party' className={getLinkClasses(isLinkActive("/shop", null, "Party"))}>
                  Party Wear
                </Link>
              </li>
              <li>
                <Link to='/shop?search=Office' className={getLinkClasses(isLinkActive("/shop", null, "Office"))}>
                  Office Wear
                </Link>
              </li>
              <li>
                <Link to='/shop?search=Everyday' className={getLinkClasses(isLinkActive("/shop", null, "Everyday"))}>
                  Everyday Wear
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Div 3 */}
        <div className='w-full lg:w-[25%] text-center lg:text-left'>
          <h1 className='font-bold text-lg uppercase text-[#1a1a1a]'>Newsletter</h1>

          <p className='mt-4 text-[#3b3737] font-medium text-sm leading-relaxed'>
            Subscribe to get special offers, free giveaways & once-in-a-lifetime deals
          </p>

          <div className='mt-5'>
            <input
              type="text"
              placeholder='Enter Your Email'
              className='py-2 w-full px-3 bg-white outline-none border border-gray-300 rounded-sm text-sm'
            />

            <button className='bg-[#74202D] text-white uppercase py-2 w-full mt-4 rounded-sm cursor-pointer
            hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] transition-all duration-300 font-semibold text-sm'>
              Subscribe Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;