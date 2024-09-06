import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.jsx";
import {FaEye,FaEyeSlash} from "react-icons/fa"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword,setShowPassword]=useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const redirect = sp.get("redirect") || "/home";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const togglePassword=()=>{
    setShowPassword(!showPassword)
  }

  return (
    <section className="flex flex-col md:flex-row items-center md:px-[5rem] px-4 p-4 md:p-0">
      <div className="mb-4 md:mb-0 mt-[2rem] md:mt-[5rem] w-full md:w-[50%] lg:w-[40%]">
        <h1 className="text-2xl font-semibold mb-4 text-white">Sign In</h1>
        <form onSubmit={submitHandler} className="space-y-4 md:space-y-7 w-full ml-1">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 p-2 border rounded w-full"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
             <div className="relative ">
             <input
              type={showPassword? "text":"password"}
              id="password"
              className="mt-2 p-2 border rounded w-full"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <span

              onClick={togglePassword}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
             >
              {showPassword? <FaEyeSlash />:<FaEye/>}
             </span>
             </div>
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer w-full"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
          {isLoading && <Loader />}
        </form>
        <div className="mt-4">
          <p className="text-white">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-pink-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      <img
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
        alt=""
        className="hidden md:block h-[30rem] md:h-[48rem] w-full md:w-[50%] lg:w-[60%] rounded-lg md:ml-20"
      />
    </section>
  );
};

export default Login;
