import React, { useState, useEffect } from "react";
import { CiSearch, CiHeart } from "react-icons/ci";
import { HiOutlineShoppingBag, HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";

const Header = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
        );

        setCartCount(totalItems);
    };

    // run once on load
    updateCartCount();

    // listen when cart changes
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
        window.removeEventListener("cartUpdated", updateCartCount);
    };
    }, []);
  return (
    <nav className='flex justify-between items-center px-10 py-2 sticky top-0 z-50 bg-[#FEFAF8] shadow-lg'>
        <div className='h-20 w-30'>
            <img src="/images/navImg2.png" alt="" />
        </div>

        <div className="hidden lg:block">
            <ul className='flex gap-10 uppercase text-base font-semibold'>
                <li className='cursor-pointer hover:text-[#74202D] transition-all duration-300'><Link to={"/"}>Home</Link></li>
                <li className='cursor-pointer hover:text-[#74202D] transition-all duration-300'><Link to={"/about"}>About</Link></li>
                <li className='cursor-pointer hover:text-[#74202D] transition-all duration-300'><Link to={"/shop"}>Shop</Link></li>
                <li className='cursor-pointer hover:text-[#74202D] transition-all duration-300'>Silk Saree</li>
                <li className='cursor-pointer hover:text-[#74202D] transition-all duration-300'>Cotten Saree</li>
                <li className='cursor-pointer hover:text-[#74202D] transition-all duration-300'><Link to={"/contact"}>Contact Us</Link></li>
                <li className='cursor-pointer hover:text-[#74202D] transition-all duration-300'>Sale</li>
            </ul>
        </div>


         {/* Icons + Mobile Menu Button */}
        <div className='flex items-center gap-3 md:gap-5 text-lg md:text-2xl'>
            <CiSearch className='cursor-pointer' />
            <CiHeart className='cursor-pointer' />
            <Link to="/cart">
                <HiOutlineShoppingBag className='cursor-pointer' />
                {cartCount > 0 && (
                    <span className="absolute top-8 right-20 lg:right-9 bg-[#74202D] text-white text-xs px-1.5 py-0.3 
                    rounded-full">
                    {cartCount}
                    </span>
                )}
            </Link>

            {/* Hamburger */}
            <button
            className="lg:hidden text-2xl"
            onClick={() => setIsOpen(true)}
            >
            <HiMenu />
            </button>
        </div>

        {/* Mobile Drawer */}
        <div className={`fixed top-0 right-0 h-full w-[70%] bg-white shadow-lg z-50 transform transition-transform duration-300
            ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

            {/* Close Button */}
            <div className="flex justify-end p-5">
            <button onClick={() => setIsOpen(false)} className="text-2xl">
                <HiX />
            </button>
            </div>

            {/* Menu Items */}
            <ul className='flex flex-col gap-6 px-6 uppercase text-base font-semibold'>
                <Link to={"/"}><li className='cursor-pointer hover:text-[#74202D]'>Home</li></Link>
                <Link to={"/about"}><li className='cursor-pointer hover:text-[#74202D]'>About</li></Link>
                <Link to={"/shop"}><li className='cursor-pointer hover:text-[#74202D]'>Shop</li></Link>
                <li className='cursor-pointer hover:text-[#74202D]'>Silk Saree</li>
                <li className='cursor-pointer hover:text-[#74202D]'>Cotten Saree</li>
                <Link to={"/contact"}><li className='cursor-pointer hover:text-[#74202D]'>Contact Us</li></Link>
                <li className='cursor-pointer hover:text-[#74202D]'>Sale</li>
            </ul>
        </div>

        {/* Overlay */}
        {isOpen && (
            <div 
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
            />
        )}
    </nav>
  )
}

export default Header