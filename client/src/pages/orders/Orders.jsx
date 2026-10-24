import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormater";
import { Link } from "react-router-dom";
import axiosInstance from "../../Utility/axios";
import AdvancedLoader from "../../components/loader/AdvancedLoader";
import { useToast } from "../../components/CurrencyFormat/ToastContext";
import { FaSpinner } from "react-icons/fa";

function Orders() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const [loadCanceling, setLoadCanceling] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/orders/my-orders");
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalSpent = () => {
    return orders.reduce((sum, order) => {
      if (order.status !== "Cancelled") {
        return sum + order.total;
      }
      return sum;
    }, 0);
  };

  const cancelOrder = async (orderId) => {
    setLoadCanceling(true);
    try {
      const response = await axiosInstance.put(`/orders/${orderId}/cancel`);
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order,
          ),
        );
        getTotalSpent();
        showToast("Order cancelled successfully", "success");
      } else {
        showToast("Failed to cancel order. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      showToast(
        "An error occurred while cancelling the order. Please try again.",
        "error",
      );
    } finally {
      setLoadCanceling(false);
    }
  };

  // Filter orders based on status
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === filterStatus.toLowerCase(),
        );

  const getStatusBadgeClass = (status) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-semibold";
    const statusColors = {
      Delivered:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Shipped:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Processing:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return `${baseClass} ${statusColors[status] || statusColors.Processing}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <AdvancedLoader message="Loading your orders..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Error Loading Orders
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              My Orders
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and manage your orders
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filter Section */}
          {orders.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by:
                </span>
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      filterStatus === "all"
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  All Orders ({orders.length})
                </button>
                <button
                  onClick={() => setFilterStatus("processing")}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      filterStatus === "processing"
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  Processing (
                  {orders.filter((o) => o.status === "Processing").length})
                </button>
                <button
                  onClick={() => setFilterStatus("shipped")}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      filterStatus === "shipped"
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  Shipped ({orders.filter((o) => o.status === "Shipped").length}
                  )
                </button>
                <button
                  onClick={() => setFilterStatus("delivered")}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      filterStatus === "delivered"
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  Delivered (
                  {orders.filter((o) => o.status === "Delivered").length})
                </button>
                <button
                  onClick={() => setFilterStatus("cancelled")}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      filterStatus === "cancelled"
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  Cancelled (
                  {orders.filter((o) => o.status === "Cancelled").length})
                </button>
              </div>
            </div>
          )}

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center">
              <div className="text-7xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {orders.length === 0 ? "No Orders Yet" : "No Orders Found"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {orders.length === 0
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : `No ${filterStatus !== "all" ? filterStatus : ""} orders found`}
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all transform hover:scale-105"
              >
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order._id || order.orderId}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Order ID
                        </p>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {order.orderId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Order Date
                        </p>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Amount
                        </p>
                        <p className="font-bold text-lg text-gray-800 dark:text-white">
                          <CurrencyFormat amount={order.total} />
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Status
                        </p>
                        <span className={getStatusBadgeClass(order.status)}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                        >
                          {/* Product Image */}
                          <Link
                            to={`/products/${item.product?.slug || item.productId}`}
                            className="flex-shrink-0"
                          >
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 w-20 h-20 flex items-center justify-center">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="max-w-full max-h-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1">
                            <Link
                              to={`/products/${item.product?.slug || item.productId}`}
                            >
                              <h4 className="font-semibold text-gray-800 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                {item.title}
                              </h4>
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.category}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                Quantity: {item.quantity}
                              </span>
                              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                <CurrencyFormat amount={item.price} /> each
                              </span>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Item Total
                            </p>
                            <p className="font-bold text-gray-800 dark:text-white">
                              <CurrencyFormat
                                amount={item.price * item.quantity}
                              />
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Shipping Address:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {order.shippingAddress.fullName},{" "}
                          {order.shippingAddress.address},
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state},
                          {order.shippingAddress.zipCode},{" "}
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    )}

                    {/* Order Actions */}
                    <div className="flex flex-wrap justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {order.status === "Processing" && (
                        <button
                          className={`
      px-4 py-2 rounded-lg text-sm font-medium 
      transition-all duration-200 transform 
      ${
        loadCanceling
          ? "bg-gray-500 cursor-not-allowed opacity-70"
          : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 cursor-pointer"
      } 
      text-white shadow-md hover:shadow-lg
      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      flex items-center justify-center gap-2
      min-w-[120px]
    `}
                          onClick={() => cancelOrder(order._id)}
                          disabled={loadCanceling}
                        >
                          {loadCanceling ? (
                            <>
                              <FaSpinner className="animate-spin text-sm" />
                              <span>Canceling...</span>
                            </>
                          ) : (
                            "Cancel Order"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Summary Stats */}
          {orders.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-amber-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Order Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {orders.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    <CurrencyFormat
                      amount={getTotalSpent()}
                    />
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Delivered Orders
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {orders.filter((o) => o.status === "Delivered").length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {
                      orders.filter(
                        (o) =>
                          o.status === "Processing" || o.status === "Shipped",
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Orders;
