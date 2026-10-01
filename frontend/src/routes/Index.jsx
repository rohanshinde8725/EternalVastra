import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import AdminRoute from "./AdminRoute";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Shop = lazy(() => import("../pages/Shop"));
const SareeDetail = lazy(() => import("../pages/SareeDetail"));
const Cart = lazy(()=> import ('../pages/Cart'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const Header = lazy(()=> import ('../components/header/Header'));
const Footer = lazy(()=> import ('../components/footer/Footer'));
const Contact = lazy(() => import("../pages/Contact"));
const Blog = lazy(() => import("../pages/Blog"));
const BlogDetail = lazy(() => import("../pages/BlogDetail"));
const AdminLayout = lazy(() => import("../pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("../pages/admin/Orders"));
const AdminProducts = lazy(() => import("../pages/admin/ProductCatalogue"));
const AdminCustomers = lazy(() => import("../pages/admin/Customers"));
const AdminUsers = lazy(() => import("../pages/admin/Users"));
const AdminCategories = lazy(() => import("../pages/admin/Categories"));
const AdminCoupons = lazy(() => import("../pages/admin/Coupons"));
const AdminReviews = lazy(() => import("../pages/admin/Reviews"));
const AdminBanners = lazy(() => import("../pages/admin/Banners"));
const AdminSettings = lazy(() => import("../pages/admin/Settings"));
const AdminRecycleBin = lazy(() => import("../pages/admin/RecycleBin"));
const AdminBlog = lazy(() => import("../pages/admin/Blog"));
const AdminProfile = lazy(() => import("../pages/admin/Profile"));

// User Pages
const UserLayout = lazy(() => import("../pages/user/UserLayout"));
const UserDashboard = lazy(() => import("../pages/user/Dashboard"));
const UserOrders = lazy(() => import("../pages/user/Orders"));
const UserReviews = lazy(() => import("../pages/user/Reviews"));
const UserAddressBook = lazy(() => import("../pages/user/AddressBook"));
const UserAccountDetails = lazy(() => import("../pages/user/AccountDetails"));
const UserSecurity = lazy(() => import("../pages/user/Security"));

const SignIn = lazy(() => import("../pages/SignIn"));
const SignUp = lazy(() => import("../pages/SignUp"));
const Profile = lazy(() => import("../pages/Profile"));

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full"
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

const AppRoutes = () => {
    return (
        <>
            <Suspense fallback={<div className='flex justify-center items-center h-screen'>Loading...</div>}>
                <Routes>
                    <Route element={<AdminRoute />}>
                        <Route path='admin' element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path='orders' element={<AdminOrders />} />
                            <Route path='products' element={<AdminProducts />} />
                            <Route path='customers' element={<AdminCustomers />} />
                            <Route path='users' element={<AdminUsers />} />
                            <Route path='categories' element={<AdminCategories />} />
                            <Route path='coupons' element={<AdminCoupons />} />
                            <Route path='reviews' element={<AdminReviews />} />
                            <Route path='banners' element={<AdminBanners />} />
                            <Route path='recycle-bin' element={<AdminRecycleBin />} />
                            <Route path='settings' element={<AdminSettings />} />
                            <Route path='blog' element={<AdminBlog />} />
                            <Route path='profile' element={<AdminProfile />} />
                        </Route>
                    </Route>

                    {/* Customer User Dashboard Routes */}
                    <Route path='profile' element={<UserLayout />}>
                        <Route index element={<UserDashboard />} />
                        <Route path='dashboard' element={<UserDashboard />} />
                        <Route path='orders' element={<UserOrders />} />
                        <Route path='reviews' element={<UserReviews />} />
                        <Route path='addresses' element={<UserAddressBook />} />
                        <Route path='address-book' element={<UserAddressBook />} />
                        <Route path='account' element={<UserAccountDetails />} />
                        <Route path='details' element={<UserAccountDetails />} />
                        <Route path='security' element={<UserSecurity />} />
                    </Route>

                    {/* User alias routes */}
                    <Route path='user' element={<UserLayout />}>
                        <Route index element={<UserDashboard />} />
                        <Route path='dashboard' element={<UserDashboard />} />
                        <Route path='orders' element={<UserOrders />} />
                        <Route path='reviews' element={<UserReviews />} />
                        <Route path='addresses' element={<UserAddressBook />} />
                        <Route path='account' element={<UserAccountDetails />} />
                        <Route path='security' element={<UserSecurity />} />
                    </Route>
                    <Route path='/' element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path='about' element={<About />} />
                        <Route path='cart' element={<Cart />} />
                        <Route path='shop' element={<Shop />} />
                        <Route path='shop/:productId' element={<SareeDetail />} />
                        <Route path='contact' element={<Contact />} />
                        <Route path='blog' element={<Blog />} />
                        <Route path='blog/:id' element={<BlogDetail />} />
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