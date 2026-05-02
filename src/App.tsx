import Auth from './Auth/Auth'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './user/page/LandingPage'
import FashionPage from './user/component/FashionPage'
import WishList from './user/page/WishList'
import Thrift from './user/page/Thrift'
import ThriftList from './user/page/ThriftList'
import Product from './user/page/Product'

import AddressPage from './user/page/AddressPage'
import Payment from './user/page/Payment'
import Allproduct from './user/page/Allproduct'
import Orders from './user/page/Orders'
import Checkout from './user/page/Checkout'
import ChatWidget from './user/page/ChatWidget'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Auth key="register" register />} />
        <Route path="/login" element={<Auth  key="login"/>} />
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
