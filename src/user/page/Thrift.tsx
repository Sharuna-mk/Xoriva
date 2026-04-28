import React from 'react'
import HeroBanner from '../component/thrift/Herobanner'
import LastDrop from '../component/thrift/LastDrop'
import SellWithUs from '../component/thrift/SellWithUs'
import ShopByStyle from '../component/thrift/ShopByStyle'
import ThriftList from './ThriftList'
import Header from '../component/Header'

const Thrift = () => {
  return (
    <div>
      <Header/>
      <HeroBanner/>
      <LastDrop/>
      <ShopByStyle/>
      <SellWithUs/>
      {/* <ThriftList/> */}
    </div>
  )
}

export default Thrift
