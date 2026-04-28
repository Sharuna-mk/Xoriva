import React from 'react'
import HeroBanner from '../component/thrift/HeroBanner'
import LastDrop from '../component/thrift/LastDrop'
import SellWithUs from '../component/thrift/SellWithUs'
import ShopByStyle from '../component/thrift/ShopByStyle'
import Header from '../component/Header'

const Thrift = () => {
  return (
    <div>
      <Header />
      <HeroBanner />
      <LastDrop />
      <ShopByStyle />
      <SellWithUs />
    </div>
  )
}

export default Thrift