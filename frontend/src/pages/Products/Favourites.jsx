import { useSelector } from "react-redux";
import Product from "./Product";

const Favourites = () => {
   // Access the favourites state from Redux
   const favourites = useSelector(state => state.favourites);

   return (
     <div className="ml-[10rem]">

       <h1 className="text-lg font-bold ml-[3rem] mt-[3rem] text-white">
        Favourite Products
        </h1>
       
       <div className="flex flex-wrap">
          {
            favourites.map((product)=>(
              <Product key={product._id} product={product}/>
            ))
          }
       </div>

     </div>
   );
};

export default Favourites;
