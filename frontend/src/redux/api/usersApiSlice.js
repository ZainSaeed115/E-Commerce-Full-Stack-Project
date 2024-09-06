import {apiSlice} from "./apiSlice.js"
import {USERS_URL} from "../constant.js"


export const userApiSlice=apiSlice.injectEndpoints(
    {
        //login 
        endpoints:(builder)=>({
            login:builder.mutation({
                query:(data)=>({
                    url:`${USERS_URL}/login`,
                    method:"POST",
                    body:data
                })
            }),
         
        //logout    
            logout:builder.mutation({
                query:(data)=>({
                    url:`${USERS_URL}/logOut`,
                    method:"POST",
                   
                })
            }),
            register:builder.mutation({
                query:(data)=>({
                  url:`${USERS_URL}/register`,
                  method:"POST",
                  body:data
                })
            }),
            profile:builder.mutation({
                query:(data)=>({
                    url:`${USERS_URL}/update`,
                    method:"PUT",
                    body:data

                })
            }),
            getUsers:builder.query({
                query:()=>({
                   url:USERS_URL,
                   method:"GET"
                }),
                providesTags:["User"],
                keepUnusedDataFor:5,
            }),
            deleteUser:builder.mutation({
              query:(userId)=>({
                url:`${USERS_URL}/${userId}`,
                method:"DELETE",
              
              }),
              transformResponse: (response) => response,
              invalidatesTags:["User"]
            }),

            getUserDetails:builder.query({
              query:(id)=>({
                url:`${USERS_URL}/${id}`
              }),
              keepUnusedDataFor:5,
            }),
           
            updateUser:builder.mutation({
                query:data=>({
                    url:`${USERS_URL}/${data.userId}`,
                    method:"PUT",
                    body:data
                }),
                invalidatesTags:["User"]
            })
        }),
    }
);

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useGetUsersQuery,
    useUpdateUserMutation,
}=userApiSlice