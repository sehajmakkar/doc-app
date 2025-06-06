import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { token, setToken } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const renderAuthButton = () => {
    if (token) {
      return (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center bg-[#D84040] hover:bg-[#A31D1D] text-white py-2 px-4 rounded font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                <Link
                  to="/my-profile"
                  className="block px-4 py-2 text-sm text-[#A31D1D] hover:bg-[#F8F2DE] hover:text-[#D84040]"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/my-appointments"
                  className="block px-4 py-2 text-sm text-[#A31D1D] hover:bg-[#F8F2DE] hover:text-[#D84040]"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Appointments
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-[#A31D1D] hover:bg-[#F8F2DE] hover:text-[#D84040]"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link to="/login">
        <button className="bg-[#D84040] hover:bg-[#A31D1D] text-white py-2 px-4 rounded font-medium transition-colors">
          Create Account
        </button>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 backdrop-blur-md bg-white/70 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Name */}

          <div className="flex items-center">
            <Link to={"/"}>
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-[#D84040] text-[#F8F2DE] h-10 w-10 rounded-full flex items-center justify-center font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <rect width="24" height="24" rx="4" fill="#D84040" />
                    <path
                      d="M22 12h-4l-3 9L9 3l-3 9H2"
                      fill="none"
                      stroke="#F8F2DE"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <h1 className="ml-3 text-xl font-bold text-[#A31D1D]">
                  DocTime
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-8 mr-8">
              <Link
                to="/"
                className="text-[#A31D1D] hover:text-[#D84040] px-3 py-2 text-base font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/doctors"
                className="text-[#A31D1D] hover:text-[#D84040] px-3 py-2 text-base font-medium transition-colors"
              >
                All Doctors
              </Link>
              <Link
                to="/about"
                className="text-[#A31D1D] hover:text-[#D84040] px-3 py-2 text-base font-medium transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-[#A31D1D] hover:text-[#D84040] px-3 py-2 text-base font-medium transition-colors"
              >
                Contact
              </Link>
              
              {/* Admin Panel Link - This will stand out */}
              <a
                href="https://admin-doc-time.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-white bg-gradient-to-r from-[#D84040] to-[#FF9B48] hover:from-[#A31D1D] hover:to-[#F38220] px-3 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2 text-[#F8F2DE] group-hover:animate-pulse" 
              fill="none"
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
              />
            </svg>
                Admin Panel
              </a>
            </div>
            {renderAuthButton()}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#A31D1D] hover:text-[#D84040]"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-[#ECDCBF]/80 backdrop-blur-sm">
          <Link
            to="/"
            className="text-[#A31D1D] hover:bg-[#ECDCBF] hover:text-[#D84040] block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            to="/doctors"
            className="text-[#A31D1D] hover:bg-[#ECDCBF] hover:text-[#D84040] block px-3 py-2 rounded-md text-base font-medium"
          >
            All Doctors
          </Link>
          <Link
            to="/about"
            className="text-[#A31D1D] hover:bg-[#ECDCBF] hover:text-[#D84040] block px-3 py-2 rounded-md text-base font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-[#A31D1D] hover:bg-[#ECDCBF] hover:text-[#D84040] block px-3 py-2 rounded-md text-base font-medium"
          >
            Contact
          </Link>
          
          {/* Admin Panel Link for mobile - Eye-catching */}
          <a
            href="https://admin-doc-time.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-white bg-gradient-to-r from-[#D84040] to-[#FF9B48] hover:from-[#A31D1D] hover:to-[#F38220] px-3 py-3 rounded-md text-base font-medium transition-all duration-300 shadow-md"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2 text-[#F8F2DE] group-hover:animate-pulse" 
              fill="none"
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
              />
            </svg>
            Admin Panel
          </a>
          
          {token ? (
            <>
              <Link
                to="/my-profile"
                className="text-[#A31D1D] hover:bg-[#ECDCBF] hover:text-[#D84040] block px-3 py-2 rounded-md text-base font-medium"
              >
                My Profile
              </Link>
              <Link
                to="/appointments"
                className="text-[#A31D1D] hover:bg-[#ECDCBF] hover:text-[#D84040] block px-3 py-2 rounded-md text-base font-medium"
              >
                My Appointments
              </Link>
              <button
                onClick={logout}
                className="w-full text-left text-[#A31D1D] hover:bg-[#ECDCBF] hover:text-[#D84040] block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <div className="pt-2">
                <button className="w-full bg-[#D84040] hover:bg-[#A31D1D] text-white py-2 px-4 rounded font-medium transition-colors">
                  Create Account
                </button>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;