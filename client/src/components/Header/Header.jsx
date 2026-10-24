import { useState, useEffect, useContext } from "react";
import {
  IoSearchOutline,
  IoSunnyOutline,
  IoMoonOutline,
} from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { dataContext } from "../../dataProvider/DataProvider";
import { type } from "../../Utility/actionType";
import { useTheme } from "../context/ThemeContext";
import useUserLocation from "../../hooks/useUserLocation";
import axiosInstance from "../../Utility/axios";

function Header() {
  const { city, country, loading, error } = useUserLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [state, dispatch] = useContext(dataContext);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    dispatch({
      type: type.SET_USER,
      user: null,
    });

    navigate("/auth");
  };
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axiosInstance.get("/categories");
        const data = response.data;
        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategories();
  }, []);

  const HandleChangeCategory = (e) => {
    if (e.target.value === "all") {
      navigate("/products");
    } else {
      navigate(`/category/${e.target.value}`);
    }
  };

  const HandleSearch = () => {
    dispatch({ type: type.SEARCH_TERM, searchTerm: searchTerm });
    navigate("/search");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-orange-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-100 shadow-lg transition-all duration-300">
        {/* Top Header Row */}
        <div className="container mx-auto px-2 sm:px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="group flex items-center gap-2 transition-transform hover:scale-105"
              >
                <div className="text-xl sm:text-2xl font-bold tracking-tight">
                  Afri
                  <span className="text-amber-300 dark:text-amber-400">
                    Gebeya
                  </span>
                </div>
              </Link>
            </div>

            {/* Location Selector - Hidden on mobile */}
            <button className="hidden lg:flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group">
              <IoLocationOutline className="text-xl text-amber-300 group-hover:scale-110 transition-transform" />

              <div className="text-left">
                <p className="text-xs text-gray-200">Deliver to</p>

                <p className="text-sm font-semibold text-white flex items-center gap-1">
                  {loading && "Getting location..."}
                  {!loading && error && "Location unavailable"}
                  {!loading && !error && `${city}, ${country}`}
                </p>
              </div>
            </button>

            {/* Search Bar - Responsive */}
            <div className="flex-1 w-full md:w-auto md:min-w-[300px] lg:min-w-[500px]">
              <div className="flex bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border-2 border-amber-500/50 dark:border-amber-600/50 focus-within:border-amber-500 dark:focus-within:border-amber-500 transition-all">
                <select
                  onChange={HandleChangeCategory}
                  className="w-28 sm:w-32 md:w-36 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium text-xs sm:text-sm border-0 outline-none px-2 py-2.5 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option value={category.slug} key={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && HandleSearch()}
                  className="flex-1 text-sm sm:text-base font-sans px-3 py-2 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                  type="text"
                  placeholder="Search products from Africa..."
                />

                <button
                  onClick={HandleSearch}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 cursor-pointer w-10 sm:w-12 text-white text-xl sm:text-2xl flex items-center justify-center transition-all duration-200 hover:shadow-lg"
                  aria-label="Search"
                >
                  <IoSearchOutline />
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="cursor-pointer relative w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center overflow-hidden group"
                aria-label="Toggle theme"
              >
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${theme == "dark" ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`}
                >
                  <IoMoonOutline className="text-xl text-amber-300" />
                </div>
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${theme !== "dark" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
                >
                  <IoSunnyOutline className="text-xl text-yellow-400" />
                </div>
              </button>

              {/* User Account - Not Logged In State */}
              <div>
      {state?.user ? (
        <div className="flex items-center gap-3">
          {/* Avatar circle */}
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-amber-400 text-black font-bold uppercase">
            {state?.user?.name?.charAt(0)}
          </div>

          {/* Name */}
          <div className="hidden sm:block">
            <p className="text-xs text-gray-200">Hello, {state?.user?.name.slice(0,7)}</p>
            <p className="text-sm font-semibold text-white">My Account</p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          to="/auth"
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition-all group"
        >
          <FaUserCircle className="text-2xl text-amber-300 group-hover:scale-110 transition-transform" />
          <div className="hidden sm:block">
            <p className="text-xs text-gray-200">Hello, sign in</p>
            <p className="text-sm font-semibold text-white">
              Account & Lists
            </p>
          </div>
        </Link>
      )}
    </div>

              {/* Orders */}
              <Link
                to="/orders"
                className="hidden md:block px-3 py-1 rounded-lg hover:bg-white/10 transition-all"
              >
                <p className="text-xs text-gray-200">Returns</p>
                <p className="text-sm font-semibold text-white">& Orders</p>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative px-2 py-1 rounded-lg hover:bg-white/10 transition-all group"
              >
                <div className="relative">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M4 21h1M19 21h1"
                    />
                  </svg>
                  <span
                    className={`absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow-lg`}
                  >
                    {state.basket.length || 0}
                  </span>
                </div>
                <span className="hidden sm:inline text-sm font-semibold ml-1">
                  Cart
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
