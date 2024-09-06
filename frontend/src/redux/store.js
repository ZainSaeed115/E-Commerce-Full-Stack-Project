import {configureStore} from "@reduxjs/toolkit"
import { useLoginMutation } from "./api/usersApiSlice"
import { setupListeners } from "@reduxjs/toolkit/query"
import { apiSlice } from "./api/apiSlice"
import authReducer from "./features/auth/authSlice"
import FavouriteSlice from "./features/favourites/FavouriteSlice"
import { getFavouritesFromLocalSTorage } from "../Utils/localStorage"


const initialFavourites=getFavouritesFromLocalSTorage() ||[];
   
export const store=configureStore({
 reducer:{
   [apiSlice.reducerPath]:apiSlice.reducer,
   auth:authReducer,
   favourites:FavouriteSlice

 },

 preloadedState:{
   favourites:initialFavourites
 },

 middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware),
 devTools:true
})

setupListeners(store.dispatch);
