// src/components/Profile.jsx
import { ShoppingBag, User, Settings, Shield, Camera, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../common/customer/Footer';
import Layout from '../common/customer/layout';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState({
    fname: '',
    lname: '',
    phone: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [profilePic, setProfilePic] = useState('/src/assets/images/profile.png');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    console.log('Profile.jsx: isAuthenticated:', isAuthenticated);
    console.log('Profile.jsx: user:', user);
    console.log('Profile.jsx: loading:', loading);
    console.log('Profile.jsx: sessionStorage:', {
      token: sessionStorage.getItem('token'),
      userId: sessionStorage.getItem('userId'),
      rememberMe: localStorage.getItem('rememberMe'),
    });

    // Fetch CSRF token
    axios
      .get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true })
      .then((response) => {
        console.log('Profile.jsx: CSRF Token fetched:', response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error('Profile.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to fetch CSRF token. Please refresh the page.');
      });

    if (!isAuthenticated && !user.token) {
      toast.error('Please log in to view your profile.');
      navigate('/login');
      return;
    }
    if (!loading) {
      fetchUserData();
    }
  }, [user, isAuthenticated, loading, navigate]);

  const fetchUserData = async () => {
    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/v1/auth/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const { fname, lname, phone, email, image } = response.data.data;
        setUserData((prev) => ({
          ...prev,
          fname: fname || '',
          lname: lname || '',
          phone: phone || '',
          email: email || '',
        }));
        setProfilePic(image ? `/Uploads/${image}` : '/src/assets/images/profile.png');
      } else {
        toast.error('Failed to fetch user data.');
      }
    } catch (error) {
      console.error('Profile.jsx: Error fetching user data:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error fetching user data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/api/v1/auth/uploadImage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setProfilePic(`/Uploads/${response.data.data}`);
        toast.success('Profile picture updated successfully!');
      } else {
        toast.error('Failed to upload profile picture.');
      }
    } catch (error) {
      console.error('Profile.jsx: Error uploading profile picture:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error uploading profile picture.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const updatedData = {
        fname: userData.fname,
        lname: userData.lname,
        phone: userData.phone,
        email: userData.email,
      };

      const response = await axios.put(`http://localhost:3000/api/v1/auth/update/${userId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Profile.jsx: Error updating profile:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (userData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (userData.newPassword !== userData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (userData.newPassword === userData.oldPassword) {
      toast.error('New password cannot be the same as the old password.');
      return;
    }

    setIsLoading(true);
    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const passwordData = {
        oldPassword: userData.oldPassword,
        newPassword: userData.newPassword,
        confirmNewPassword: userData.confirmPassword,
      };

      const response = await axios.put(`http://localhost:3000/api/v1/auth/updatePassword/${userId}`, passwordData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('Password updated successfully!');
        setUserData((prev) => ({
          ...prev,
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        toast.error('Failed to update password.');
      }
    } catch (error) {
      console.error('Profile.jsx: Error updating password:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <span className="text-gray-700 font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout />
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Manage your account settings and personal information
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {userData.fname} {userData.lname}
                  </h3>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                </div>

                <div className="space-y-2">
                  <button className="flex items-center w-full p-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
                    <User className="w-4 h-4 mr-3" />
                    Profile Settings
                  </button>
                  <Link to="/my-orders">
                    <button className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200">
                      <ShoppingBag className="w-4 h-4 mr-3" />
                      My Orders
                    </button>
                  </Link>
                  <button className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200">
                    <Settings className="w-4 h-4 mr-3" />
                    Account Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-6">
              {/* Personal Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
                </div>
                
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fname" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="fname"
                        value={userData.fname}
                        onChange={(e) => setUserData({ ...userData, fname: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 text-black placeholder-gray-500"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lname" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lname"
                        value={userData.lname}
                        onChange={(e) => setUserData({ ...userData, lname: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 text-black placeholder-gray-500"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 text-black placeholder-gray-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 text-black placeholder-gray-500"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full p-3 rounded-lg font-medium text-white transition-colors duration-200 ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    }`}
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                </div>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="oldPassword"
                      value={userData.oldPassword}
                      onChange={(e) => setUserData({ ...userData, oldPassword: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 text-black placeholder-gray-500"
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={userData.newPassword}
                        onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 text-black placeholder-gray-500"
                        placeholder="Enter your new password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200 text-black placeholder-gray-500"
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full p-3 rounded-lg font-medium text-white transition-colors duration-200 ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    }`}
                  >
                    {isLoading ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
    </>
  );
};

export default Profile;