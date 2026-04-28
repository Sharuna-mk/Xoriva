import React from 'react'
import Auth from './Auth/Auth'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './user/page/LandingPage'
import FashionPage from './user/component/FashionPage'
import WishList from './user/page/WishList'
import Thrift from './user/page/Thrift'
import ThriftList from './user/page/ThriftList'
import Product from './user/page/Product'
import ChatWidget from './user/page/Chatwidget'
import Checkout from './user/page/CheckOut'
import AddressPage from './user/page/AddressPage'
import Payment from './user/page/Payment'
import Allproduct from './user/page/Allproduct'
import Orders from './user/page/Orders'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Auth register />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/fashion" element={<FashionPage />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/products" element={<Allproduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/thrift" element={<Thrift />}>
          <Route path="list" element={<ThriftList />} />
        </Route>
        <Route path='/cart' element={<Checkout />} />
        <Route path='/address' element={<AddressPage />} />
        <Route path='/payment' element={<Payment />} />

      </Routes>
      <ChatWidget />

    </div>
  )
}

export default App
