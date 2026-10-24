import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import AllProducts from "./pages/products/AllProducts";
import SingleProduct from "./pages/products/SingleProduct";
import ScrollToTop from "./components/scroll to top/ScrollToTop";
import Auth from "./pages/auth/Auth";
import Cart from "./pages/cart/Cart";
import Orders from "./pages/orders/Orders";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./pages/payment/Payment";
import ProtectedRoutes from "./components/protected/ProtectedRoutes";
import Products from "./pages/products/Products";
import NotFound from "./pages/notfound/NotFound";
import Search from "./pages/search/Search";

function Router() {
  const stripePromise = loadStripe(
    "pk_test_51THukvCbg0DtktvL3YQK0ry2dTKzyAbUHfYd7kuDqKCR6KLoLc3UbS4WsbGa0RHr88wn2ojbIb5gOY7aM5deuqVQ0003aYMqiQ",
  );

  const clientSecret = import.meta.env.VITE_STRIPE_KEY;

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:productCategory" element={<AllProducts />} />
        <Route path="/products/:productSlug" element={<SingleProduct />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes
              message={"You must be authenticated first to view orders"}
              redirect={"/orders"}
            >
              <Orders />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/payment"
          element={
            clientSecret && (
              <ProtectedRoutes
                message={"You must be authenticated first to pay"}
                redirect={"/payment"}
              >
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <Payment />
                </Elements>
              </ProtectedRoutes>
            )
          }
        />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default Router;
