import { useContext } from "react";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormater";
import { Link, useNavigate } from "react-router-dom";
import { dataContext } from "../../dataProvider/DataProvider";
import { type } from "../../Utility/actionType";

function ProductCard({ product }) {
  const [state, dispatch] = useContext(dataContext)
  const navigate = useNavigate()
  function AddToCart() {
    dispatch({
      type: type.ADD_TO_CART,
      item: product
    })
  }
  function BuyNow() {
    dispatch({
      type:type.EMPTY_CART
    })
    AddToCart();
    navigate("/payment")
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <Link to={`/products/${product?.slug}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 p-4 h-48 flex items-center justify-center">
          <img
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
            src={product.image}
            alt={product.title}
            loading="lazy"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 h-10">
            {product.title}
          </h2>

          {/* Price */}
          <div className="mb-3 text-gray-800 text-md dark:text-gray-200">
            <CurrencyFormat amount={product.price} />
          </div>

          {/* Original Price & Discount */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 dark:text-gray-400 line-through">
              <CurrencyFormat amount={product.price * 1.2} />
            </span>
          </div>
        </div>
      </Link>

      {/* Buttons Section */}
      <div className="p-4 pt-0 flex gap-2">
        <button
          onClick={BuyNow}
          className="cursor-pointer flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                     bg-amber-500 hover:bg-amber-600 text-white
                     shadow-md hover:shadow-lg transform hover:scale-105"
        >
          🛒 Buy Now
        </button>
        <button
          onClick={AddToCart}
          className="cursor-pointer flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                     border-2 border-amber-500 text-amber-600 dark:text-amber-400 
                     hover:bg-amber-50 dark:hover:bg-amber-900/20
                     transform hover:scale-105"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
