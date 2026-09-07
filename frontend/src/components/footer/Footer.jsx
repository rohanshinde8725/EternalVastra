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

  const [storeInfo, setStoreInfo] = useState({
    contactEmail: "rohanshinde8725@gmail.com",
    contactPhone: "+91 98564 75612",
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/_rohan_.0710/",
    github: "https://github.com/rohanshinde8725",
    linkedin: "https://www.linkedin.com/in/rohan-shinde-397195256",
  });

  const loadSettings = () => {
    fetch(`${API_BASE_URL}/api/admin/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setStoreInfo({
            contactEmail: data.contactEmail || "rohanshinde8725@gmail.com",
            contactPhone: data.contactPhone || "+91 98564 75612",
          });
          setSocialLinks({
            facebook: data.facebook || "https://www.facebook.com/",
            instagram: data.instagram || "https://www.instagram.com/_rohan_.0710/",
            github: data.github || "https://github.com/rohanshinde8725",
            linkedin: data.linkedin || "https://www.linkedin.com/in/rohan-shinde-397195256",
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener("settingsUpdated", loadSettings);
    window.addEventListener("storage", loadSettings);

    return () => {
      window.removeEventListener("settingsUpdated", loadSettings);
      window.removeEventListener("storage", loadSettings);
    };
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
    <div className='bg-[#F6DBC6] w-full pt-10 pb-24 lg:py-12 border-t border-[#ebd0bb]'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10 lg:gap-12'>

        {/* Div 1: Brand Logo, Dynamic Email, Phone & Social Links */}
        <div className='w-full lg:w-[28%] text-center lg:text-left'>
          <div className='flex justify-center lg:justify-start'>
            <Logo className="h-12 sm:h-14 w-auto" />
          </div>

          {/* Dynamic Email and Phone from Backend */}
          <div className="my-5 space-y-2 text-xs sm:text-sm text-slate-700">
            <p className="flex items-center justify-center lg:justify-start gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-900">Email :</span>
              <a
                href={`mailto:${storeInfo.contactEmail}`}
                className="transition-colors duration-200 hover:text-[#6B1527] break-all font-medium"
              >
                {storeInfo.contactEmail}
              </a>
            </p>

            <p className="flex items-center justify-center lg:justify-start gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-900">Phone No :</span>
              <a
                href={`tel:${(storeInfo.contactPhone || "").replace(/\s+/g, '')}`}
                className="transition-colors duration-200 hover:text-[#6B1527] font-medium"
              >
                {storeInfo.contactPhone}
              </a>
            </p>
          </div>

          <div className='flex justify-center lg:justify-start gap-5 text-[#74202D] text-lg'>
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

        {/* Div 2: Navigation Links */}
        <div className='w-full lg:w-[48%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center lg:text-left'>
          
          <div>
            <h2 className='font-bold text-sm sm:text-base uppercase text-slate-900 tracking-wide'>Quick Links</h2>
            <ul className='mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-sm list-none'>
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
            <h2 className='font-bold text-sm sm:text-base uppercase text-slate-900 tracking-wide'>Shop</h2>
            <ul className='mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-sm decoration-none'>
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
            <h2 className='font-bold text-sm sm:text-base uppercase text-slate-900 tracking-wide'>Collections</h2>
            <ul className='mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-sm'>
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

        {/* Div 3: Newsletter */}
        <div className='w-full lg:w-[24%] text-center lg:text-left'>
          <h2 className='font-bold text-sm sm:text-base uppercase text-slate-900 tracking-wide'>Newsletter</h2>

          <p className='mt-3 sm:mt-4 text-slate-700 text-xs sm:text-sm leading-relaxed'>
            Subscribe to get special offers, free giveaways & once-in-a-lifetime deals
          </p>

          <div className='mt-4 sm:mt-5'>
            <input
              type="email"
              placeholder='Enter Your Email'
              className='py-2.5 w-full px-3.5 bg-white outline-none border border-gray-300 rounded-md text-xs sm:text-sm shadow-xs focus:border-[#74202D]'
            />

            <button className='bg-[#74202D] text-white uppercase py-2.5 px-4 w-full mt-3 rounded-md cursor-pointer
            hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] transition-all duration-300 font-semibold text-xs sm:text-sm shadow-xs'>
              Subscribe Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;