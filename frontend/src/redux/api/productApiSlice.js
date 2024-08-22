import {apiSlice} from "./apiSlice.js"
import {PRODUCT_URL,UPLOAD_URL} from "../constant.js"

export const productApiSlice=apiSlice.injectEndpoints({
     
    endpoints:(builder)=>({


        getProducts:builder.query({
            query:(keyword)=>({
                url:`${PRODUCT_URL}`,
                params:{keyword},
                method:"GET"
            }),
            keepUnusedDataFor:5,
            providesTags:()=>["Product"]
        }),


        getProductById:builder.query({
            query:(productId)=> `${PRODUCT_URL}/${productId}`,
            providesTags:(result,error,productId)=>[
                {type:"Product",id:productId}
            ]
            
        }),

        allProducts:builder.query({
            query:()=>`${PRODUCT_URL}/allProducts`
        }),

        getProducDetails:builder.query({
            query:(productId)=>({
                url:`${PRODUCT_URL}/${productId}`
            }),
            keepUnusedDataFor:5,
        }),

        createProduct:builder.mutation({
            query:(ProductData)=>({
                url:`${PRODUCT_URL}`,
                method:"POST",
                body:ProductData

            }),
            invalidatesTags:["Product"]
        }),

        updateProduct:builder.mutation({
            query:({productId,formData})=>({
                url:`${PRODUCT_URL}/${productId}`,
                method:"PUT",
                body:formData
            
            }),
          
        }),

        uploadProductImage:builder.mutation({
            query:(data)=>({
                url:`${UPLOAD_URL}`,
                method:"POST",
                body:data
            })
        }),

        deleteProduct:builder.mutation({
            query:(productId)=>({
                url:`${PRODUCT_URL}/${productId}`,
                method:"DELETE",
            }),
           providesTags:["Product"]
        }),

        createReviews:builder.mutation({
            query:(data)=>({
                url:`${PRODUCT_URL}/${data.productId}/reviews`,
                method:"POST",
                body:data
            })
        }),

        getTopProducts:builder.query({
            query:()=>`${PRODUCT_URL}/top`,
            keepUnusedDataFor:5
        }),
        
        getNewProducts:builder.query({
            query:()=>`${PRODUCT_URL}/new`,
            keepUnusedDataFor:5
        })
    })
})

export const 
{
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProducDetailsQuery,
  useGetNewProductsQuery,
  useGetTopProductsQuery,
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewsMutation,
  useUploadProductImageMutation,
}=productApiSlice;