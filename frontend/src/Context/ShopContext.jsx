/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext, useEffect } from "react";
import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

// Default cart with size support
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < all_product.length + 1; index++) {
    // initialize for all sizes
    ["S","M","L","XL","XXL"].forEach((size) => {
      cart[`${index}_${size}`] = 0;
    });
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [allproducts, setAllproducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/allproduct")
      .then((response) => response.json())
      .then((data) => setAllproducts(data));

    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:3000/getcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: "",
      })
        .then((response) => response.json())
        .then((data) => setCartItems(data));
    }
  }, []);

  // ADD TO CART with size
  const addToCart = async (itemId, size) => {
    const key = `${itemId}_${size}`;
    setCartItems((prev) => ({ ...prev, [key]: prev[key] + 1 }));

    if (localStorage.getItem("auth-token")) {
      await fetch("http://localhost:3000/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: key }),
      }).then((res) => res.json())
        .then((data) => console.log(data));
    }
  };

  // REMOVE FROM CART with size
  const removeFromCart = async (itemId, size) => {
    const key = `${itemId}_${size}`;
    setCartItems((prev) => ({ ...prev, [key]: prev[key] - 1 }));

    if (localStorage.getItem("auth-token")) {
      await fetch("http://localhost:3000/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: key }),
      }).then((res) => res.json())
        .then((data) => console.log(data));
    }
  };

  // TOTAL AMOUNT
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        const [id] = key.split("_");
        const itemInfo = all_product.find((product) => product.id === Number(id));
        totalAmount += itemInfo.new_price * cartItems[key];
      }
    }
    return totalAmount;
  };

  // TOTAL ITEMS COUNT
  const getTotalCartItems = () => {
    let totalItems = 0;
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        totalItems += cartItems[key];
      }
    }
    return totalItems;
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;