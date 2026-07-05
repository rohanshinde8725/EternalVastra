import React from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { lazy, Suspense } from "react";
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Shop = lazy(() => import("../pages/Shop"));
const Cart = lazy(()=> import ('../pages/Cart'));
const Header = lazy(()=> import ('../components/header/Header'));
const Footer = lazy(()=> import ('../components/footer/Footer'));
const Contact = lazy(() => import("../pages/Contact"));
const MainLayout = () => {
  return (
    <>
        <Header />
            <Outlet />
        <Footer />
    </>
  )

}

const AppRoutes = () => {
    return (
        <>
            <Suspense fallback={<div className='flex justify-center items-center h-screen'>Loading...</div>}>
                <Routes>
                    <Route path='/' element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path='about' element={<About />} />
                        <Route path='cart' element={<Cart />} />
                        <Route path='shop' element={<Shop />} />
                        <Route path='contact' element={<Contact />} />
                    </Route>
                </Routes>
            </Suspense>
        </>
    )
}

export default AppRoutes;