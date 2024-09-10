import { FaTrash } from "react-icons/fa"
import { useDispatch,useSelector } from "react-redux"
import { Link,useNavigate} from "react-router-dom"
import { addToCart,removeFromCart} from "../redux/features/cart/cartSlice"





const Cart = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const cart=useSelector((state)=>state.cart)
    const {cartItems}=cart;

    const addToCartHandler=(product,qty)=>{
      dispatch(addToCart({...product,qty}))
    }

    const removeFromCartHandler=(productId)=>{
     dispatch(removeFromCart(productId))
    }

    const checkoutHandler=()=>{
        navigate("/login?redirect=/shipping")
    }
  return <>
     <div className=" container flex justify-around items-start flex-wrap mx-auto mt-8">
      {cartItems.length===0? 
      (<div className="  text-pink-900 font-bold text-3xl">
        Your Cart is empty <Link to='/shop' className="text-pink-200"> Go shop</Link>
        </div>):
            (<>
            <div className="flex flex-col w-[80%]">
             <h1 className="text-2xl font-semibold mb-4 text-white">Shopping Cart</h1>
             {
                cartItems.map((item)=>(
                  <div key={item._id} className="flex items-center mb-[1rem] pb-2">
                       <div className="w-[5rem] h-[5rem]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded"/>
                       </div>

                       <div className="flex-1 ml-4">
                        <Link to={`/product/${item._id}`} className="text-pink-500">
                        {item.name}
                        </Link>

                        <div className="text-white mt-2">{item.brand}</div>
                        <div className="text-white mt-2 font-bold">${item.price}</div>
                       </div>

                       <div className="w-24">
                       <select className="w-full p-1 border rounded text-black" 
                       value={item.qty}
                       onChange={(e)=>addToCartHandler(item,Number(e.target.value))}
                       >
                        {[...Array(item.countInStock).keys()].map((x)=>(
                            <option key={x+1} value={x+1}>{x+1}</option>
                        ))}
                       </select>
                       </div>
                       <div  >
                           <button className="text-red-500 mr-[5rem]"
                           onClick={()=>removeFromCartHandler(item._id)}
                           >
                            <FaTrash className="ml-[1rem]"/>
                           </button>
                       </div>
                  </div>
                ))
             }
               <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                   <h2 className="text-xl font-semibold mb-2 text-white">
                    Items(
                        {
                            cartItems.reduce((acc,item)=>acc+item.qty,0)
                        }{""}
                    )
                   </h2>

                   <div className="text-2xl font-bold text-white">
                       $ {cartItems.reduce((acc,item)=>acc+item.qty*item.price,0).toFixed(2)}
                   </div>

                   <button 
                   disabled={cartItems.length===0}
                   onClick={checkoutHandler}
                   className="bg-pink-500 hover:bg-pink-700 mt-4 py-2 text-white px-4 rounded-full text-lg w-full">
                         Proceed To Checkout
                   </button>
                </div>
            </div>
            </div>
            </>)}
 
          
     </div>
  </>
}

export default Cart