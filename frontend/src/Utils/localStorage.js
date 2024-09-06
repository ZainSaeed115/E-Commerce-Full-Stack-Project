// add a product to localStorage
export const addFavouriteToLocalStorage=(product)=>{
   const favourites=getFavouritesFromLocalSTorage()
   if(!favourites.some((p)=>p._id===product._id)){
    favourites.push(product)
    localStorage.setItem('favourites',JSON.stringify(favourites))
   }
}
// remove product from localStorage
export const removeFromLocalStorage=(productId)=>{
    const favourites=getFavouritesFromLocalSTorage()
    const updateFavourites=favourites.filter((product)=>product._id!==productId)
    localStorage.setItem('favourites',JSON.stringify(updateFavourites))
 }
// retrive favourites from localStorage
export const getFavouritesFromLocalSTorage=()=>{
    const favouritesJson=localStorage.getItem('favourites');
    return favouritesJson?JSON.parse(favouritesJson):[];
}