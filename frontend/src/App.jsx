import React from "react";
// import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import Footer from "./Components/Footer/Footer";
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />}></Route>
          <Route path="/mens"element={<ShopCategory category="men" banner={men_banner}/>}></Route>{/* category="men" (props) */}
          <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />}></Route>
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/login" element={<LoginSignup />}></Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
};

export default App;
