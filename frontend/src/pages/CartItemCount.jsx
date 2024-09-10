import React from 'react'
import { useSelector } from 'react-redux'

const CartItemCount = () => {
  const cart=useSelector((state)=>state.cart);
  const {cartItems}=cart;
  return (
    <div className=' relative'>
      {
        cart&&cartItems.length>0?(
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs 
          font-bold py-1 px-2 rounded-full shadow-lg">{cartItems.length}</div>
        ):null
      }
    </div>
  )
}

export default CartItemCount