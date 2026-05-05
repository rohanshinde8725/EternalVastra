import React from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Shop from '../pages/Shop'
import Cart from '../pages/Cart'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'

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
            <Routes>
                <Route path='/' element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path='about' element={<About />} />
                    <Route path='cart' element={<Cart />} />
                    <Route path='shop' element={<Shop />} />
                </Route>
            </Routes>
        </>
    )
}

export default AppRoutes;