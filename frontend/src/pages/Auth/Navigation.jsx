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
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from '../../redux/api/usersApiSlice';
import { logout } from '../../redux/features/auth/authSlice';
import "./Navigation.css";
import FavouritesCount from '../Products/FavouritesCount';
import CartItemCount from '../CartItemCount';

const Navigation = () => {
  const { userInfo } = useSelector(state => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const toggleDropdownOpen = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleShowSideBar = () => {
    setShowSideBar(!showSideBar);
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
    <div className="relative">
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden">
        <button onClick={toggleShowSideBar} className="p-2 text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div
        style={{ zIndex: 9999 }}
        className={`${
          showSideBar ? "flex" : "hidden"
        } md:flex flex-col justify-between p-4 text-white bg-[#000] w-[15%] md:w-[4%] hover:w-[25%] md:hover:w-[10%] h-[100vh] fixed transition-all duration-300 ease-in-out`}
        id="navigation-container"
      >
        <div className="flex flex-col justify-center space-y-4">
          <Link to="/home" className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Home</span>
          </Link>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <Link to="/shop" className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Shop</span>
          </Link>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <Link to="/cart" className="flex items-center transition-transform transform hover:translate-x-2 ">
            <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26} />
            <CartItemCount/>
            <span className="hidden nav-item-name mt-[3rem]">Cart</span>
            
          </Link>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <Link to="/favourite" className="flex items-center transition-transform transform hover:translate-x-2 ">
            <FaHeart className="mr-2 mt-[3rem]" size={26} />
            <FavouritesCount/>
            <span className="hidden nav-item-name mt-[3rem]">Favourite</span>

          </Link>
        </div>

        <div className="relative ">
          <button 
            onClick={toggleDropdownOpen}
            className="flex items-center text-gray-800 focus:outline-none mx-auto"
          >
            {userInfo ? (
              <span className="text-white font-bold">
                {userInfo.user.userName}
              </span>
            ) : (
              <span className="text-white font-bold">Guest</span>
            )}
            {
              userInfo && (
                <svg 
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 ${
                  dropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
                </svg>
              )
            }
          </button>
          {dropdownOpen && userInfo &&(
            <ul className={`absolute right-0 mt-2 space-y-2 bg-white text-gray-600 
              ${!userInfo.user.isAdmin ? '-top-20' : '-top-80'}
            `}>
              {userInfo.user.isAdmin && (
                <>
                  <li>
                    <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-gray-100">
                    Category
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-100">
                    Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-100">
                    Users
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                    </Link>
                  </li>
                
                  <li>
                    <Link to="/admin/logout"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={logoutHandler}
                    >
                    Logout
                    </Link>
                  </li>
                </>
              )}
              {!userInfo.user.isAdmin && (
                <>
                  <li>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                    Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/logout"
                    className="block px-4 py-2 hover:bg-gray-200"
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

        {!userInfo && (
          <ul className="mt-[3rem] pb-10 md:pb-0">
            <li>
              <Link to="/login" className="flex items-center transition-transform transform hover:translate-x-2">
                <AiOutlineLogin className="mr-2" size={26} />
                <span className="hidden nav-item-name">Login</span>
              </Link>
            </li>
            <li>
              <Link to="/register" className="flex items-center transition-transform transform hover:translate-x-2">
                <AiOutlineUserAdd className="mr-2" size={26} />
                <span className="hidden nav-item-name">Register</span>
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Backdrop for closing sidebar */}
      {showSideBar && (
        <div
          onClick={toggleShowSideBar}
          className="fixed inset-0 bg-black opacity-50 md:hidden"
        ></div>
      )}
    </div>
  );
}

export default Navigation;
