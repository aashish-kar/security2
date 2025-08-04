
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { Shield, Mail, ArrowRight, ArrowLeft, Clock, CheckCircle } from 'lucide-react';

const OtpVerification = () => {
  const { login, getRole, isAuthenticated } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isCsrfLoading, setIsCsrfLoading] = useState(true);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
        console.log('VerifyOtp.jsx: CSRF Token fetched:', response.data.csrfToken);
      } catch (error) {
        console.error('VerifyOtp.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to initialize. Please refresh the page.');
      } finally {
        setIsCsrfLoading(false);
      }
    };
    fetchCsrfToken();
  }, []);

  useEffect(() => {
  if (isAuthenticated) {
    const role = getRole();
    console.log('VerifyOtp.jsx: isAuthenticated changed, role:', role);
    toast.success('Logged in successfully!');
    
    setTimeout(() => {
      window.location.href = role === 'admin' ? '/admin/dashboard' : '/login';
    }, 1500); // Delay to allow toast to show
  }
}, [isAuthenticated, getRole]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/verify-otp',
        { userId: state?.userId, otp },
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      );

      console.log('VerifyOtp.jsx: OTP Verification Response:', response.data);

      if (response.data.success) {
        const { token, userId } = response.data;
        if (!token || !userId) {
          throw new Error('Missing token or userId in response');
        }
        console.log('VerifyOtp.jsx: JWT Token:', token);
        const decoded = jwtDecode(token);
        console.log('VerifyOtp.jsx: Decoded JWT:', decoded);
        sessionStorage.clear(); // Clear any stale tokens
        login(token, userId, state?.rememberMe);
        console.log('VerifyOtp.jsx: Login called with:', { userId, rememberMe: state?.rememberMe });
      } else {
        toast.error(response.data.message || 'Invalid or expired OTP.');
      }
    } catch (error) {
      console.error('VerifyOtp.jsx: OTP Verification Error:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Error verifying OTP. Please try again.';
      toast.error(message);
      if (message.includes('Invalid or expired OTP')) {
        setTimeout(() => navigate('/login'), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!state?.userId || !state?.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Session</h2>
              <p className="text-sm text-gray-600 mb-6">Please log in again to continue.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Verify Your Email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          {/* Email Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-900">
                  Code sent to <span className="font-medium">{state.email}</span>
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Check your email and enter the 6-digit verification code
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setOtp(value);
                  }}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 text-center text-lg font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || isCsrfLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 ${
                  isLoading || isCsrfLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Verifying...</span>
                  </div>
                ) : isCsrfLoading ? (
                  <span>Loading...</span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Didn't receive the code?</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Back to Sign In
              </button>
              <button
                onClick={() => navigate('/forgot-password')}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Resend Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-1 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
    </div>
  );
};

export default OtpVerification;
