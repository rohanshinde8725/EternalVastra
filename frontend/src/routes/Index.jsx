import { Routes, Route, Outlet } from 'react-router-dom'
import { lazy, Suspense } from "react";
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Shop = lazy(() => import("../pages/Shop"));
const SareeDetail = lazy(() => import("../pages/SareeDetail"));
const Cart = lazy(()=> import ('../pages/Cart'));
const Wishlist = lazy(() => import('../components/wishlist/Wishlist'));
const Header = lazy(()=> import ('../components/header/Header'));
const Footer = lazy(()=> import ('../components/footer/Footer'));
const Contact = lazy(() => import("../pages/Contact"));
const AdminLayout = lazy(() => import("../pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("../pages/admin/Orders"));
const AdminProducts = lazy(() => import("../pages/admin/ProductCatalogue"));
const AdminCustomers = lazy(() => import("../pages/admin/Customers"));
const AdminCategories = lazy(() => import("../pages/admin/Categories"));
const AdminCoupons = lazy(() => import("../pages/admin/Coupons"));
const AdminReviews = lazy(() => import("../pages/admin/Reviews"));
const AdminBanners = lazy(() => import("../pages/admin/Banners"));
const AdminSettings = lazy(() => import("../pages/admin/Settings"));
const AdminRecycleBin = lazy(() => import("../pages/admin/RecycleBin"));
const AdminBlog = lazy(() => import("../pages/admin/Blog"));
const AdminProfile = lazy(() => import("../pages/admin/Profile"));
const SignIn = lazy(() => import("../pages/SignIn"));
const SignUp = lazy(() => import("../pages/SignUp"));
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
                    <Route path='admin' element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path='orders' element={<AdminOrders />} />
                        <Route path='products' element={<AdminProducts />} />
                        <Route path='customers' element={<AdminCustomers />} />
                        <Route path='categories' element={<AdminCategories />} />
                        <Route path='coupons' element={<AdminCoupons />} />
                        <Route path='reviews' element={<AdminReviews />} />
                        <Route path='banners' element={<AdminBanners />} />
                        <Route path='recycle-bin' element={<AdminRecycleBin />} />
                        <Route path='settings' element={<AdminSettings />} />
                        <Route path='blog' element={<AdminBlog />} />
                        <Route path='profile' element={<AdminProfile />} />
                    </Route>
                    <Route path='/' element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path='about' element={<About />} />
                        <Route path='cart' element={<Cart />} />
                        <Route path='shop' element={<Shop />} />
                        <Route path='shop/:productId' element={<SareeDetail />} />
                        <Route path='contact' element={<Contact />} />
                        <Route path='wishlist' element={<Wishlist />} />
                        <Route path='signin' element={<SignIn />} />
                        <Route path='login' element={<SignIn />} />
                        <Route path='signup' element={<SignUp />} />
                        <Route path='register' element={<SignUp />} />
                    </Route>
                </Routes>
            </Suspense>
        </>
    )
}

export default AppRoutes;