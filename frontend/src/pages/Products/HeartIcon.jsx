
import {
    FaHeart,
    FaRegHeart
} from "react-icons/fa";
import {useSelector,useDispatch} from "react-redux"
import {
     addToFavourites,
    removeFromFavourites,
    setFavourites
 } from "../../redux/features/favourites/FavouriteSlice";
import { 
    addFavouriteToLocalStorage,
    removeFromLocalStorage,
    getFavouritesFromLocalSTorage
 } from "../../Utils/localStorage";
import { useEffect } from "react";

const HeartIcon = ({product}) => {

    const dispatch=useDispatch()
    const favourites=useSelector(state=>state.favourites) ||[]
    const isFavourite=favourites.some((p)=>p._id===product._id);

    useEffect(()=>{
        const favouritesFromLocalStorage=getFavouritesFromLocalSTorage();
        dispatch(setFavourites(favouritesFromLocalStorage))

    },[dispatch])



    const toggleFavourites=()=>{
       if(isFavourite){
         dispatch(removeFromFavourites(product._id))
         removeFromLocalStorage(product._id)
       }
       else{
        dispatch(addToFavourites(product))
        addFavouriteToLocalStorage(product)
       }
    }
  return (
    <div onClick={toggleFavourites} className="absolute top-2 right-5 cursor-pointer">
        {isFavourite ? (
                <FaHeart  className="text-red-600 font-bold" />
            ) : (
                <FaRegHeart className="text-white font-bold" />
            )}
    </div>
  )
}

export default HeartIcon