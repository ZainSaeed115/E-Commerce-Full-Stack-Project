import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from '../../components/Loader';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../../redux/api/usersApiSlice';

const Register = () => {
   const [userName, setUserName] = useState(''); 
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [register, { isLoading }] = useRegisterMutation();
   const { userInfo } = useSelector(state => state.auth);

   const { search } = useLocation();
   const sp = new URLSearchParams(search);

   const redirect = sp.get('redirect') || '/';

   const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const res = await register({ userName, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User Successfully registered");
    } catch (error) {
        toast.error(error?.data?.message || error.message);
    }
   };

   useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
   }, [navigate, redirect, userInfo]);

  return (
    <section className='pl-[10rem] flex'>
        <div className='mr-[4rem] mt-[5rem]'>
           <h1 className='text-2xl font-semibold mb-4 text-white'>
                Register
           </h1>

           <form onSubmit={submitHandler} className='w-[40rem]'>
            <div className='my-[2rem]'>
            <label htmlFor='name' className='block text-sm font-medium text-white'>
              UserName
            </label>
            <input type='text' 
            id='name' 
            placeholder='Enter your userName'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className='mt-2 p-2 border rounded w-full'/>
            </div>

            <div className='my-[2rem]'>
            <label htmlFor='email' className='block text-sm font-medium text-white'>
              Email
            </label>
            <input 
             type='email'
             id='email'
             placeholder='Enter your email'
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className='mt-2 p-2 border rounded w-full'/>
            </div>

            <div className='my-[2rem]'>
            <label htmlFor='password' className='block text-sm font-medium text-white'>
              Password
            </label>
            <input
             type='password' 
             id='password'
             placeholder='Enter your password'
             value={password}
             onChange={(e) => setPassword(e.target.value)} 
             className='mt-2 p-2 border rounded w-full'/>
            </div>

            <button
            disabled={isLoading}
            type='submit'
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
            {isLoading ? "Registering..." : "Register"}
           </button>
           {isLoading && <Loader />}
           </form>

           <div className="mt-4">
            <p className="text-white">
              Already have an account? {" "}
              <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-pink-500 hover:underline">Login</Link>
            </p>
          </div>
        </div>
        <img
        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        alt=""
        className="h-[48rem] w-[53%] xl:block md:hidden sm:hidden rounded-lg"
      />
    </section>
  );
};

export default Register;
