import {configureStore} from "@reduxjs/toolkit"
import { useLoginMutation } from "./api/usersApiSlice"
import { setupListeners } from "@reduxjs/toolkit/query"
import { apiSlice } from "./api/apiSlice"
import authReducer from "./features/auth/authSlice.js"
import FavouriteSlice from "./features/favourites/FavouriteSlice.js"
import cartSliceReducer from "./features/cart/cartSlice.js"
import shopReducer from "./features/shop/shopSlice.js"
import { getFavouritesFromLocalSTorage } from "../Utils/localStorage.js"


const initialFavourites=getFavouritesFromLocalSTorage() ||[];
   
export const store=configureStore({
 reducer:{
   [apiSlice.reducerPath]:apiSlice.reducer,
   auth:authReducer,
   favourites:FavouriteSlice,
   cart:cartSliceReducer,
   shop:shopReducer

 },

 preloadedState:{
   favourites:initialFavourites
 },

 middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware),
 devTools:true
})

setupListeners(store.dispatch);
