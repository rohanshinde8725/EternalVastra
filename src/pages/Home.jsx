import React from 'react'
import Hero from '../components/hero/Hero'
import TrustBar from '../components/trustbar/TrustBar'
import Category from '../components/category/Category'
import CategoryBanner from '../components/categoryBanner/CategoryBanner'
import Seller from '../components/seller/Seller'
import NewsLetter from '../components/newsletter/NewsLetter'
import Testimonial from '../components/testimonial/Testimonial'

const Home = () => {
  return (
    <div>
      <Hero />
      <TrustBar />
      <Category />
      <CategoryBanner />
      <Seller />
      <NewsLetter />
      <Testimonial />
    </div>
  )
}

export default Home