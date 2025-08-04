
import axios from 'axios';
import { Eye, EyeOff, Clock, Lock, Mail, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { isAuthenticated, getRole, csrfToken, fetchCsrfToken } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', recaptchaToken: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isCsrfLoading, setIsCsrfLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Initialize CSRF token if not available
    const initializeCsrf = async () => {
      if (!csrfToken) {
        setIsCsrfLoading(true);
        await fetchCsrfToken();
        setIsCsrfLoading(false);
      }
    };
    initializeCsrf();
  }, [csrfToken, fetchCsrfToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleRecaptchaChange = (token) => {
    setFormData({ ...formData, recaptchaToken: token });
    setErrors({ ...errors, recaptchaToken: '' });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const validate = () => {
    let temp = {};
    if (!formData.email.trim()) {
      temp.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      temp.email = 'Enter a valid email';
    }
    if (!formData.password) {
      temp.password = 'Password is required';
    }
    if (!formData.recaptchaToken) {
      temp.recaptchaToken = 'Please complete the reCAPTCHA';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/login',
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          recaptchaToken: formData.recaptchaToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success('OTP sent to your email!');
        navigate('/verify-otp', { state: { userId: response.data.userId, email: formData.email, rememberMe } });
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      if (msg.includes('Please verify your email')) {
        toast.error('Please verify your email before logging in');
        navigate('/verify-otp', { state: { userId: error.response?.data?.userId, email: formData.email, rememberMe } });
      } else if (msg.includes('Invalid credentials')) {
        toast.error('Invalid email or password');
      } else if (msg.includes('reCAPTCHA')) {
        toast.error('reCAPTCHA verification failed');
      } else if (msg.includes('Account is locked')) {
        toast.error('Too many attempts. Please try again after 15 minutes.');
      } else if (msg.includes('Error sending OTP email')) {
        toast.error('Failed to send OTP email. Please try again later.');
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error('Login failed: Please try again.');
      }
      console.error('Login.jsx: Login Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const role = getRole();
      toast.success('Already logged in!');
      navigate(role === 'admin' ? '/admin/dashboard' : '/');
    }
  }, [isAuthenticated, getRole, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Welcome to watchShop
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your luxury timepiece collection
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900"
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.password}
                </p>
              )}
            </div> 

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LfdWZIrAAAAABEHkzQkNm2HY1LiSUJ92cqyKrPi"
                onChange={handleRecaptchaChange}
              />
            </div>
            {errors.recaptchaToken && (
              <p className="text-sm text-red-600 text-center flex items-center justify-center">
                <span className="mr-1">⚠️</span>
                {errors.recaptchaToken}
              </p>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || isCsrfLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 ${
                  loading || isCsrfLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Signing in...</span>
                  </div>
                ) : isCsrfLoading ? (
                  <span>Loading...</span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to watchShop?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Create your account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-1"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to Home</span>
        </Link>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
    </div>
  );
};

export default Login;
