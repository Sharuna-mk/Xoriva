import React from 'react'
import Header from '../component/Header'
import NewArrivals from '../component/NewArrivals'
import Carousel from '../component/Carousel'
import ExploreByCategory from '../component/ExploreByCategory'
import SaleBanner from '../component/SaleBanner'
import WhyXoriva from '../component/WhyXoriva'
import BestSellers from '../component/BestSellers'
import DealOfTheDay from '../component/DealOfTheDay'
import Footer from '../component/Footer'
import Testimonials from '../component/Testimonials'
import BrandMarquee from '../component/BrandMarquee'
import GenderSection from '../component/GenderSection'

function LandingPage() {
  return (
    <div>
      <Header/>
      <Carousel/>
      <BrandMarquee/>
      <ExploreByCategory/>
      <NewArrivals/>
      <GenderSection/>
       <DealOfTheDay/>
      <BestSellers/>
       <SaleBanner/>
     
      <WhyXoriva/>
      <Testimonials/>
      <Footer/>
    </div>
  )
}

export default LandingPage
