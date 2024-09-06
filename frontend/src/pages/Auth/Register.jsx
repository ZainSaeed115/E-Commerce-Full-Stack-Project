import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from '../../components/Loader';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../../redux/api/usersApiSlice';
import {FaEye,FaEyeSlash} from "react-icons/fa"

const Register = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword,setShowPassword]=useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector(state => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const redirect = sp.get('redirect') || '/home';

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

  const toggelShowPassword=()=>{
    setShowPassword(!showPassword);
  }

  return (
    <section className='flex flex-col md:flex-row items-center md:px-[5rem] px-4 p-4 md:p-0'>
      <div className='mb-4 md:mb-0 mt-4 md:mt-[5rem] w-full md:w-[50%] lg:w-[40%]'>
        <h1 className='text-2xl font-semibold mb-4 text-white'>Register</h1>
        <form onSubmit={submitHandler} className='space-y-4 md:space-y-6 w-full'>
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-white'>UserName</label>
            <input
              type='text'
              id='name'
              placeholder='Enter your userName'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className='mt-2 p-2 border rounded w-full'
            />
          </div>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-white'>Email</label>
            <input
              type='email'
              id='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-2 p-2 border rounded w-full'
            />
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-white'>Password</label>
            <div className='relative'>
            <input
              type={showPassword? "text":"password"}
              id='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-2 p-2 border rounded w-full'
            />
            <span
             onClick={toggelShowPassword}
             className="absolute top-1/2 right-3 transform  -translate-y-1/2 cursor-pointer">
               {showPassword?<FaEyeSlash/>:<FaEye/>}
            </span>
            </div>
          </div>
          <button
            disabled={isLoading}
            type='submit'
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer w-full"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          {isLoading && <Loader />}
        </form>
        <div className="mt-4">
          <p className="text-white">
            Already have an account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-pink-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        alt="Registration"
        className="hidden  ml-20 md:block h-[30rem] md:h-[48rem] w-full md:w-[50%] lg:w-[60%] rounded-lg"
      />
    </section>
  );
};

export default Register;
