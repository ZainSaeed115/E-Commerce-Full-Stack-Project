import React, { useState } from 'react';
import { 
    AiOutlineHome,
    AiOutlineShopping,
    AiOutlineShoppingCart,
    AiOutlineLogin,
    AiOutlineLogout,
    AiOutlineUserAdd
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from '../../redux/api/usersApiSlice';
import { setCredentials, logout } from '../../redux/features/auth/authSlice';

const Navigation = () => {
  const { userInfo } = useSelector(state => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
   console.log(userInfo)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const toggleDropdownOpen = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleShowSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  const closeSideBar = () => {
    setShowSideBar(false);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSideBar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#000] w-[4%] hover:w-[15%] h-[100vh] fixed`}
      id="navigation-container"
    >
      <div className='flex flex-col justify-center space-y-4'>
        <Link to='/' className='flex items-center transition-transform transform hover:translate-x-2'>
          <AiOutlineHome className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>Home</span>
        </Link>
      </div>

      <div className='flex flex-col justify-center space-y-4'>
        <Link to='/shop' className='flex items-center transition-transform transform hover:translate-x-2'>
          <AiOutlineShopping className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>Shop</span>
        </Link>
      </div>

      <div className='flex flex-col justify-center space-y-4'>
        <Link to='/cart' className='flex items-center transition-transform transform hover:translate-x-2'>
          <AiOutlineShoppingCart className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>Cart</span>
        </Link>
      </div>

      <div className='flex flex-col justify-center space-y-4'>
        <Link to='/favourite' className='flex items-center transition-transform transform hover:translate-x-2'>
          <FaHeart className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>Favourite</span>
        </Link>
      </div>

      <div className='relative'>
        <button 
          onClick={toggleDropdownOpen}
          className='flex items-center text-gray-800 focus:outline-none mx-auto'
        >
          {userInfo ? (
            <span className='text-white font-bold'>
              {userInfo.user.userName}
            </span>
          ) : (
            <span className='text-white font-bold'>Guest</span>
          )}


          {
            userInfo&&(
              <svg 
              xmlns='http://www.w3.org/2000/svg'
              className={`h-4 w-4 ml-1 ${
                dropdownOpen?"transform rotate-180":""
              }`}
              fill='none'
              viewBox='0 0 24 24'
              stroke='white'
              >
               <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth="2"
                d={dropdownOpen? "M5 15l7-7 7 7":"M19 9l-7 7-7-7"}
               />
              </svg>
            )
          }
        </button>
        {dropdownOpen && userInfo &&(
          <ul className={` absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-600 
            ${!userInfo.user.isAdmin?'-top-20':'-top-80'}
          `}>
              {userInfo.user.isAdmin &&(
                <>
                <li>
                  <Link to='/admin/dashboard' className='block px-4 py-2 hover:bg-gray-100'>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to='/admin/productlist' className='block px-4 py-2 hover:bg-gray-100'>
                    Products
                  </Link>
                </li>
                <li>
                  <Link to='/admin/categorylist' className='block px-4 py-2 hover:bg-gray-100'>
                   Category
                  </Link>
                </li>
                <li>
                  <Link to='/admin/orderlist' className='block px-4 py-2 hover:bg-gray-100'>
                   Orders
                  </Link>
                </li>
                <li>
                  <Link to='/admin/userlist' className='block px-4 py-2 hover:bg-gray-100'>
                   Users
                  </Link>
                </li>
                <li>
                  <Link to='/admin/profile' className='block px-4 py-2 hover:bg-gray-100'>
                   Profile
                  </Link>
                </li>
              
                <li>
                  <Link to='/admin/logOut'
                   className='block px-4 py-2 hover:bg-gray-100'
                   onClick={logoutHandler}
                   >
                   Logout
                  </Link>
                </li>
                </>
              )}
              {!userInfo.user.isAdmin&&(
                <>
                <li>
                  <Link to='/profile' className='block px-4 py-2 hover:bg-gray-200'>
                   Profile
                  </Link>
                </li>
                <li>
                  <Link to='/logOut'
                   className='block px-4 py-2 hover:bg-gray-200'
                   onClick={logoutHandler}
                   >
                   Logout
                  </Link>
                </li>
                </>
              )}
              
          </ul>
        )}
      </div>

    {!userInfo&&(
        <ul>
        <li>
          <Link to='/login' className='flex items-center transition-transform transform hover:translate-x-2'>
            <AiOutlineLogin className='mr-2 mt-[3rem]' size={26} />
            <span className='hidden nav-item-name mt-[3rem]'>Login</span>
          </Link>
        </li>
        <li>
          <Link to='/register' className='flex items-center transition-transform transform hover:translate-x-2'>
            <AiOutlineUserAdd className='mr-2 mt-[3rem]' size={26} />
            <span className='hidden nav-item-name mt-[3rem]'>Register</span>
          </Link>
        </li>
      </ul>
    )}
    </div>
  );
}

export default Navigation;
