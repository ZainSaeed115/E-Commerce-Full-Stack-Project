import { useState,useEffect } from "react"
import { useSelector,useDispatch } from "react-redux"
import { toast } from "react-toastify"
import Loader from "../../components/Loader"
import { setCredentials } from "../../redux/features/auth/authSlice"
import { Link } from "react-router-dom"
import { useProfileMutation } from "../../redux/api/usersApiSlice"





const Profile = () => {
    const [userName,setUserName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const dispatch=useDispatch();
    const [updateProfile,{isLoading:loadingUpdateProfile}]=useProfileMutation();

    const {userInfo}=useSelector(state=>state.auth)

    useEffect(()=>{
        setUserName(userInfo.user.userName);
        setEmail(userInfo.user.email)
    },[userInfo.user.userName,userInfo.user.email])
    const submitHandler=async(e)=>{
        e.preventDefault()
        try {
            const res= await updateProfile({_id:userInfo.user._id,userName,password,email}).unwrap()
             dispatch(setCredentials({...res}))
             toast.success("Profile Updated Successfully")
        } catch (error) {
            toast.error(error?.data?.message || error.message)
        }
    }
  return (
    <div className=' container mx-auto p-4 mt-[10rem]'>
         <h1 className="text-white text-4xl"> {userInfo.user.userName}</h1>
        <div className=" flex justify-center align-center md:flex md:space-x-5">
         <div className="md:w-1/3">
         <h2 className="text-2xl text-white font-semibold mb-4">
                Update Profile
             </h2>

             <form onSubmit={submitHandler}>
                <div className="mb-4">
                    <label htmlFor="text" className="block text-white mb-4">
                        UserName
                    </label>
                    <input type="text"
                     placeholder="Enter UserName"
                     className=" form-input p-4 rounded-sm w-full"
                     value={userName}
                     onChange={e=>setUserName(e.target.value)}
                     />
                </div>


                <div className="mb-4">
                    <label htmlFor="text" className="block text-white mb-4">
                        Email
                    </label>
                    <input type="email"
                     placeholder="Enter Email"
                     className=" form-input p-4 rounded-sm w-full"
                     value={email}
                     onChange={e=>setEmail(e.target.value)}
                     />
                </div>


                <div className="mb-4">
                    <label htmlFor="text" className="block text-white mb-4">
                        Password
                    </label>
                    <input type="password"
                     placeholder="Enter Password"
                     className=" form-input p-4 rounded-sm w-full"
                     value={password}
                     onChange={e=>setPassword(e.target.value)}
                     />
                </div>

                <div className="flex justify-between">
                 <button type="submit" 
                 className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
                 >Update</button>

                 <Link to='/user-orders' 
                 className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700">
                    My Orders
                 </Link>
                </div>
             </form>
         </div>
         {loadingUpdateProfile&&<Loader/>}
        </div>
    </div>
  )
}

export default Profile