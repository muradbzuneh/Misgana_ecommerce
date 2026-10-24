import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Layout from "../../components/Layout/Layout";
import axiosInstance from "../../Utility/axios";
import { dataContext } from "../../dataProvider/DataProvider";
import { type } from "../../Utility/actionType";
function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [{ user }, dispatch] = useContext(dataContext);
  const navigateStates = useLocation();
  const [navigateTo, setNavigateTo] = useState("/");
  const [navigateMessage, setNavigateMessage] = useState("");

  useEffect(() => {
    if (navigateStates?.state) {
      setNavigateTo(navigateStates.state.redirect || "/");
      setNavigateMessage(
        navigateStates.state.message ||
          "Please login to continue to the requested page.",
      );
    } else {
      setNavigateTo("/");
      setNavigateMessage("");
    }
  }, [navigateStates]);

  useEffect(() => {
    if (user) {
      navigate(navigateTo);
    }
  }, [user, navigateTo]);
  // Form States
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  // Handle Login Input Changes
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // Handle Register Input Changes
  const handleRegisterChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setRegisterData({
      ...registerData,
      [e.target.name]: value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // Validate Login Form
  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!loginData.password) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  // Validate Register Form
  const validateRegister = () => {
    const newErrors = {};
    if (!registerData.fullName) {
      newErrors.fullName = "Full name is required";
    }
    if (!registerData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!registerData.phone) {
      newErrors.phone = "Phone number is required";
    }
    if (!registerData.password) {
      newErrors.password = "Password is required";
    } else if (registerData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!registerData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }
    return newErrors;
  };

  // Handle Login Submission

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/users/login", {
        email: loginData.email,
        password: loginData.password,
      });

      const responseData = res.data;

      if (responseData.success) {
        const user = responseData.data;

        // Save user + token
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
          }),
        );

        localStorage.setItem("token", user.token);
        dispatch({
          type: type.SET_USER,
          user: JSON.parse(localStorage.getItem("user")),
        });
        // redirect after login
        navigate(navigateTo);
      } else {
        setErrors({ general: "Invalid email or password" });
      }
    } catch (error) {
      console.log(error);

      const message =
        error?.response?.data?.message || "Login failed. Please try again.";

      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submission

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegister();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/users/register", {
        name: registerData.fullName,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
      });

      // response data
      const responseData = res.data;

      if (responseData.success) {
        const user = responseData.data;

        // store user + token
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
          }),
        );

        localStorage.setItem("token", user.token);

        dispatch({
          type: type.SET_USER,
          user: JSON.parse(localStorage.getItem("user")),
        });
        // navigate to home
        navigate(navigateTo);
      } else {
        setErrors({ general: "Registration failed. Try again." });
      }
    } catch (error) {
      console.log(error);

      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";

      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout isFooterInclude={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
                Afri
                <span className="text-amber-600 dark:text-amber-400">
                  Gebeya
                </span>
              </span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isLogin
                ? "Sign in to your account to continue shopping"
                : "Join AfriGebeya and start shopping today"}
            </p>
            {navigateMessage && (
              <p className="mt-2 text-sm text-red-500 text-center">
                {navigateMessage}
              </p>
            )}
          </div>

          {/* Error Messages */}
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.general}
              </p>
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className={`block w-full pl-10 pr-10 py-2 border ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form className="mt-8 space-y-6" onSubmit={handleRegister}>
              <div className="space-y-4">
                {/* Full Name Field */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={registerData.fullName}
                      onChange={handleRegisterChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.fullName
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      placeholder="Your Name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="regEmail"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="regEmail"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.phone
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      placeholder="+251 912 345 678"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="regPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="regPassword"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className={`block w-full pl-10 pr-10 py-2 border ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className={`block w-full pl-10 pr-10 py-2 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={registerData.agreeTerms}
                    onChange={handleRegisterChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-amber-600 hover:text-amber-500 dark:text-amber-400"
                    >
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          {/* Toggle between Login and Register */}
          <div className="text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setLoginData({ email: "", password: "" });
                setRegisterData({
                  fullName: "",
                  email: "",
                  phone: "",
                  password: "",
                  confirmPassword: "",
                  agreeTerms: false,
                });
              }}
              className="text-sm text-amber-600 hover:text-amber-500 dark:text-amber-400"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                Demo Credentials:
                <br />
                Email: demo@afrigebeya.com
                <br />
                Password: 123456
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Auth;
