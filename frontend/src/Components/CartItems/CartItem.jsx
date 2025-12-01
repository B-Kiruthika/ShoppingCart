import React, { useContext } from "react";
import "./CartItem.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItem = () => {
  const { all_product, cartItems, removeFromCart,getTotalCartAmount} =
    useContext(ShopContext);

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product
        .filter((e) => cartItems[e.id] > 0) 
        .map((e) => (
          <div className="cartitems-format cartitems-format-main" key={e.id}>
            <img src={e.image} alt="" className="carticon-product-icon" />
            <p>{e.name}</p>
            <p>Rs.{e.new_price}</p>
            <button className="cartitems-quantity">{cartItems[e.id]}</button>
            <p>Rs.{e.new_price * cartItems[e.id]}</p>
            <img
              className="cartitems-remove-icon"
              src={remove_icon}
              onClick={() => removeFromCart(e.id)}
              alt=""
            />
          </div>
        ))}
      <div className="cart_items-down">
        <div className="cart_items-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cart_items-total_items">
              <p>Subtotal</p>
              <p>Rs.{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart_items-total_items">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cart_items-total_items">
              <h3>Total</h3>
              <h3>Rs.{getTotalCartAmount()}</h3>
            </div>
          </div>
          <button>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
