import { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormater";
import { Link } from "react-router-dom";
import { dataContext } from "../../dataProvider/DataProvider";
import { type } from "../../Utility/actionType";

function Cart() {
  // Sample cart items for demo
  const [state, dispatch] = useContext(dataContext);
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const groupCartItems = async () => {
      const groupedItems = state.basket.reduce((acc, item) => {
        const existingItem = acc.find((i) => i.slug === item.slug);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          acc.push({ ...item, quantity: 1 });
        }
        return acc;
      }, []);
      setCartItems(groupedItems);
    };
    groupCartItems();
  }, [state.basket]);

  // Calculate subtotal
  const calculateSubtotal = () => {
    const total = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    return total;
  };

  // Calculate total items count
  const totalItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Increase quantity
  const increaseQuantity = (product) => {
    dispatch({
      type: type.ADD_TO_CART,
      item: product,
    });
  };

  // Decrease quantity
  const decreaseQuantity = (product) => {
    dispatch({
      type: type.REMOVE_FROM_CART,
      item: product,
    });
  };

  // Remove item completely
  const removeItem = (product) => {
    dispatch({
      type: type.REMOVE_FROM_CART,
      item: product,
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Hello, {state.user ? state?.user?.name : "Guest"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Your Shopping Cart
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="flex-1">
              {cartItems.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center">
                  <div className="text-7xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Add items to your cart to continue shopping
                  </p>
                  <Link
                    to="/"
                    className="inline-block px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all"
                  >
                    Continue Shopping →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((product) => (
                    <div
                      key={product.slug}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6 flex flex-col sm:flex-row gap-6">
                        {/* Product Image */}
                        <Link
                          to={`/products/${product.slug}`}
                          className="flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 w-full sm:w-36 h-36 flex items-center justify-center"
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            className="max-w-full max-h-full object-contain"
                            loading="lazy"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col gap-2">
                          <Link to={`/products/${product.slug}`}>
                            <h1 className="text-md font-semibold text-gray-800 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2">
                              {product.title}
                            </h1>
                          </Link>

                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="text-sm text-gray-400 dark:text-gray-500">
                            Category: {product.category.name}
                          </div>

                          {/* Price */}
                          <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                            <CurrencyFormat amount={product.price} />
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-3">
                            <div className="cursor-pointer flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                              <button
                                onClick={() => decreaseQuantity(product)}
                                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={product.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-4 py-1.5 text-gray-700 dark:text-gray-300 font-medium min-w-[40px] text-center">
                                {product.quantity}
                              </span>
                              <button
                                onClick={() => increaseQuantity(product)}
                                className=" cursor-pointer px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold transition-colors"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(product)}
                              className="cursor-pointer text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline transition-colors"
                            >
                              Remove
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Item total:{" "}
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              <CurrencyFormat
                                amount={product.price * product.quantity}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout Section */}
            {cartItems.length > 0 && (
              <div className="lg:w-[380px]">
                <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>
                        Subtotal ({totalItemsCount}{" "}
                        {totalItemsCount === 1 ? "item" : "items"})
                      </span>
                      <span className="font-semibold">
                        <CurrencyFormat amount={calculateSubtotal()} />
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Shipping</span>
                      <span className="text-green-600 dark:text-green-400">
                        {calculateSubtotal() > 50 ? "Free" : "$5.99"}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Tax</span>
                      <span>
                        <CurrencyFormat amount={calculateSubtotal() * 0.1} />
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-lg font-bold text-gray-800 dark:text-white">
                      Total
                    </span>
                    <span className="text-xl font-bold text-gray-800 dark:text-white">
                      <CurrencyFormat
                        amount={
                          calculateSubtotal() > 50
                            ? calculateSubtotal()+ calculateSubtotal() * 0.1
                            : calculateSubtotal() +
                              5.99 +
                              calculateSubtotal() * 0.1
                        }
                      />
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <Link
                      to="/payment"
                      className="block w-full text-center py-3 rounded-xl font-semibold
                               bg-gradient-to-r from-amber-500 to-orange-500 
                               hover:from-amber-600 hover:to-orange-600 
                               text-white shadow-md hover:shadow-lg 
                               transform hover:-translate-y-0.5 
                               transition-all duration-200"
                    >
                      Proceed to Checkout →
                    </Link>

                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1 pt-2">
                      <p>✓ Free delivery on orders over $50</p>
                      <p>✓ 30-day return policy</p>
                      <p>✓ Secure payment guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
