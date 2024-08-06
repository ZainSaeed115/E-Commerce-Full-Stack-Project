import {apiSlice} from "./apiSlice.js"
import {CATEGORY_URL} from "../constant.js"


export const categoryApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({

        createCategory:builder.mutation({
            query:(newCategory)=>(
                {
                    url:`${CATEGORY_URL}/create`,
                    method:"POST",
                    body:newCategory
                }
            )
        }),


        updateCategoryById:builder.mutation(
            {
                query:({categoryId,updatedCategory})=>({
                    url:`${CATEGORY_URL}/${categoryId}`,
                    method:"PUT",
                    body:updatedCategory
                })
            }
        ),

        deleteCategoryById:builder.mutation({
            query:(categoryId)=>({
                url:`${CATEGORY_URL}/${categoryId}`,
                method:'DELETE'
            })
        }),

        fetchAllCategories:builder.query({
            query:()=>({
                url:`${CATEGORY_URL}/categories`,
                method:'GET',

            })
        })

    })
})

export const 
{
 useCreateCategoryMutation,
 useUpdateCategoryByIdMutation,
 useDeleteCategoryByIdMutation,
 useFetchAllCategoriesQuery,
}=categoryApiSlice