import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormater";
import { dataContext } from "../../dataProvider/DataProvider";
import { ClipLoader } from "react-spinners";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  MdOutlineLocalShipping,
  MdPayment,
  MdShoppingBag,
} from "react-icons/md";
import { FaRegCreditCard, FaTruck, FaShieldAlt } from "react-icons/fa";
import axiosInstance from "../../Utility/axios";
import { useToast } from "../../components/CurrencyFormat/ToastContext";
function Payment() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [state, dispatch] = useContext(dataContext);

  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("Ethiopia");
  const [errors, setErrors] = useState({});

  // Add phone number state
  const [phoneNumber, setPhoneNumber] = useState("");

  // Phone number validation function
  const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // Check if phone number has valid length (9-15 digits)
    if (cleaned.length < 9 || cleaned.length > 15) {
      return "Phone number must be between 9 and 15 digits";
    }

    // Check if phone number starts with valid country code (optional)
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return "Please enter a valid phone number";
    }

    return null;
  };

  // Fetch countries
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name",
        );
        const data = await response.json();
        const countryNames = data.map((country) => country.name.common).sort();
        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);

  // Process cart items
  const cart = state.basket;
  const cartItems = cart.reduce((acc, item) => {
    const existing = acc.find((i) => i.slug === item.slug);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  // Update validateForm function to include phone number
  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      const phoneError = validatePhoneNumber(phoneNumber);
      if (phoneError) newErrors.phoneNumber = phoneError;
    }
    if (!address.trim()) newErrors.address = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle card change
  const handleCardChange = (event) => {
    if (event.error) {
      setErrors({ ...errors, card: event.error.message });
    } else {
      setErrors({ ...errors, card: null });
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (errors.card) {
      return;
    }

    if (!stripe || !elements) {
      setErrors({ ...errors, card: "Stripe not initialized" });
      return;
    }

    setLoading(true);

    try {
      const totalAmount = Math.round(total * 100);
      const paymentResponse = await axiosInstance.post(
        `/payments/create?totalAmount=${totalAmount}`,
      );

      if (!paymentResponse.data.success) {
        throw new Error(
          paymentResponse.data.message || "Payment creation failed",
        );
      }

      const { clientSecret, paymentIntentsId } = paymentResponse.data;

      const confirmation = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (confirmation.error) {
        setErrors({
          ...errors,
          card: confirmation.error.message,
        });
        setLoading(false);
        return;
      }

      const orderItems = cartItems.map((item) => ({
        product: item.productId || item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        image: item.image,
      }));

      const orderData = {
        items: orderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          state: stateName,
          zipCode,
          country,
          phone: phoneNumber,
        },
        paymentIntentId: paymentIntentsId,
        subtotal: subtotal,
        tax: tax,
        shippingCost: shippingCost,
        total: total,
        notes: "",
      };

      const orderResponse = await axiosInstance.post("/orders", orderData);

      if (orderResponse.data.success) {
        showToast("Payment successful! Order placed successfully.", "success");
        dispatch({ type: "EMPTY_CART" });

        // Navigate to orders page
        navigate("/orders");
      } else {
        throw new Error(orderResponse.data.message || "Order creation failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrors({
        ...errors,
        card:
          error.response?.data?.message ||
          error.message ||
          "Payment failed. Please try again.",
      });
      showToast(
        error.response?.data?.message ||
          error.message ||
          "Payment failed. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-8xl mb-4 ">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/")}
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 
                       hover:from-amber-600 hover:to-orange-600 text-white font-semibold 
                       rounded-lg transition-all transform hover:scale-105 shadow-md"
              >
                Continue Shopping →
              </button>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Start exploring our amazing products!
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Checkout
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Complete your purchase securely
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section - Forms */}
            <div className="lg:w-2/3">
              {/* Shipping Address Form */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <MdOutlineLocalShipping className="text-amber-500 text-2xl" />
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                   focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                   focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="+251 912 345 678"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                   focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="123 Main St"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                   focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="Addis Ababa"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                   focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="State/Province"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                   focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="1000"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Country *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                   focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    >
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method Form */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <MdPayment className="text-amber-500 text-2xl" />
                  Payment Method
                </h2>

                <form onSubmit={handlePayment}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Details
                    </label>
                    <div
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                    bg-white dark:bg-gray-800
                    focus-within:ring-2 focus-within:ring-amber-500 
                    focus-within:border-transparent transition-all"
                    >
                      <CardElement
                        onChange={handleCardChange}
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color:
                                document.documentElement.classList.contains(
                                  "dark",
                                )
                                  ? "#ffffff"
                                  : "#1f2937",
                              backgroundColor:
                                document.documentElement.classList.contains(
                                  "dark",
                                )
                                  ? "#1f2937"
                                  : "#ffffff",
                              "::placeholder": {
                                color: "#9ca3af",
                              },
                              fontFamily:
                                "system-ui, -apple-system, sans-serif",
                            },
                            invalid: {
                              color: "#ef4444",
                              iconColor: "#ef4444",
                            },
                            complete: {
                              color: "#10b981",
                            },
                          },
                        }}
                      />
                    </div>
                    {errors.card && (
                      <p className="text-red-500 text-sm mt-1">{errors.card}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !stripe}
                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 
                 hover:from-amber-600 hover:to-orange-600 text-white font-semibold 
                 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 
                 transition-all duration-200 disabled:opacity-50 
                 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <ClipLoader color="#fff" size={24} />
                    ) : (
                      <>
                        <FaRegCreditCard />
                        Pay <CurrencyFormat amount={total} />
                      </>
                    )}
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
                      🔒 Test Card: 4242 4242 4242 4242
                      <br />
                      Exp: Any future date | CVC: Any 3 digits
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Section - Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <MdShoppingBag className="text-amber-500" />
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {cartItems.map((item, index) => (
                    <Link
                      to={`/products/${item.slug}`}
                      key={index}
                      className="flex gap-3 text-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-contain bg-gray-50 dark:bg-gray-700 rounded p-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-white line-clamp-2 text-xs">
                          {item.title}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium text-gray-800 dark:text-white text-sm">
                        <CurrencyFormat amount={item.price * item.quantity} />
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="text-gray-800 dark:text-white">
                      <CurrencyFormat amount={subtotal} />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping
                    </span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        FREE
                      </span>
                    ) : (
                      <span className="text-gray-800 dark:text-white">
                        <CurrencyFormat amount={shippingCost} />
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tax (10%)
                    </span>
                    <span className="text-gray-800 dark:text-white">
                      <CurrencyFormat amount={tax} />
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-800 dark:text-white">
                        Total
                      </span>
                      <span className="text-amber-600 dark:text-amber-400">
                        <CurrencyFormat amount={total} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <FaTruck className="text-amber-500" />
                    <span>Free delivery on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <FaShieldAlt className="text-green-500" />
                    <span>Secure payment guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Payment;
