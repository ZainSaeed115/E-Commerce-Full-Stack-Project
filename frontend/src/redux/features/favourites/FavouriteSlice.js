import { createSlice } from "@reduxjs/toolkit";

const favouriteSlice=createSlice(
    {
        name:'favourites',
        initialState:[],
        reducers:{
            addToFavourites:(state,action)=>{
                // check if product is not already favourite
                if(!state.some((product)=>product._id===action.payload._id)){
                    state.push(action.payload)
                }
            },
            removeFromFavourites:(state,action)=>{
                // remove the product with matching id
                return state.filter((product)=>product._id!==action.payload)
            },
            setFavourites:(state,action)=>{
                return action.payload
            }
        }
    }
)


export const {addToFavourites,removeFromFavourites,setFavourites}=favouriteSlice.actions;
export const selectFavouriteProduct= (state)=>state.favourites;
export default favouriteSlice.reducer;