import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    confirmAlert({
      title: "Confirm Logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            logout();
            navigate("/");
          },
        },
        { label: "No" },
      ],
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/searchresult?query=${searchQuery}`);
    }
  };

  const activeLinkStyle = ({ isActive }) =>
    isActive ? "text-blue-600 font-semibold" : "text-gray-800 hover:text-blue-600";

  return (
    <nav className="bg-gray-100 shadow border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/src/assets/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavLink to="/" className={activeLinkStyle}>Home</NavLink>
          <NavLink to="/menu" className={activeLinkStyle}>Collection</NavLink>
          <NavLink to="/about" className={activeLinkStyle}>About</NavLink>
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center relative">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400 text-sm"
              placeholder="Search watches..."
            />
            <button onClick={handleSearch} className="ml-2 p-1 rounded hover:bg-gray-100">
              Search
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link to="/wishlist" className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 rounded hover:bg-gray-200">
            Wishlist
          </Link>
          <Link to="/cart" className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 rounded hover:bg-gray-200">
            Cart
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                My Account
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow py-2 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">My Profile</Link>
                  <Link to="/my-orders" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">My Orders</Link>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white"
              >Sign In</button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >Sign Up</button>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 pt-4 pb-6 space-y-4 border-t bg-white">
          <NavLink to="/" className="block text-gray-700 hover:text-blue-600">Home</NavLink>
          <NavLink to="/menu" className="block text-gray-700 hover:text-blue-600">Collection</NavLink>
          <NavLink to="/about" className="block text-gray-700 hover:text-blue-600">About</NavLink>

          <div className="flex items-center border rounded-lg px-4 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full outline-none text-sm"
              placeholder="Search..."
            />
          </div>

          <div className="flex space-x-4 justify-center">
            <Link to="/wishlist" className="text-blue-600 hover:text-blue-700 font-medium">
              Wishlist
            </Link>
            <Link to="/cart" className="text-blue-600 hover:text-blue-700 font-medium">
              Cart
            </Link>
          </div>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="block bg-blue-600 text-white py-2 px-4 rounded-lg text-center">My Profile</Link>
              <Link to="/my-orders" className="block border border-blue-600 text-blue-600 py-2 px-4 rounded-lg text-center">My Orders</Link>
              <button onClick={handleLogout} className="block bg-red-500 text-white py-2 px-4 rounded-lg w-full text-center">Log Out</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="block border border-blue-600 text-blue-600 py-2 px-4 rounded-lg w-full text-center">Sign In</button>
              <button onClick={() => navigate("/register")} className="block bg-blue-600 text-white py-2 px-4 rounded-lg w-full text-center">Sign Up</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;