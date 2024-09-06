import { useSelector } from "react-redux"

const FavouritesCount = () => {
    const favourites=useSelector(state=>state.favourites);
    
  return (
    <div className="relative">
            {favourites && favourites.length > 0 ? (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-full shadow-lg">
                    {favourites.length}
                </div>
            ) : null}
        </div>
  )
}

export default FavouritesCount