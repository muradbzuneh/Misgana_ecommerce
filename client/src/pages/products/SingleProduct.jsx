import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormater";
import AdvancedLoader from "../../components/loader/AdvancedLoader";
import ProductCard from "../../components/product/ProductCard";
import { type } from "../../Utility/actionType";
import { dataContext } from "../../dataProvider/DataProvider";
import axiosInstance from "../../Utility/axios";
import { FaSearch } from "react-icons/fa";

function SingleProduct() {
  const { productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [state, dispatch] = useContext(dataContext);
  const navigate = useNavigate();

  function AddToCart() {
    for (let i = 1; i <= quantity; i++) {
      dispatch({
        type: type.ADD_TO_CART,
        item: product,
      });
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    async function Fetch() {
      try {
        const result = await axiosInstance.get(`/products`);
        const allProducts = await result.data;
        const products = allProducts.products;
        
        const currentProduct = products.find(
          (p) => p?.slug === productSlug,
        );
        console.log(productSlug)
        setProduct(currentProduct);

        // Find related products
        if (currentProduct) {
          const related = products
            .filter((p) => {
              if (p?.slug === currentProduct?.slug) return false;

              // Check same category
              const sameCategory = p?.category?.name === currentProduct?.category?.name;

              // Check if keywords from title or description match
              const productKeywords =
                `${currentProduct.title} ${currentProduct.description || ""}`.toLowerCase();
              const otherKeywords =
                `${p.title} ${p.description || ""}`.toLowerCase();

              // Split into words and find matches
              const currentWords = productKeywords
                .split(" ")
                .filter((w) => w.length > 3);
              const matchCount = currentWords.filter((word) =>
                otherKeywords.includes(word),
              ).length;

              return sameCategory || matchCount > 0;
            })
            .slice(0, 4); // Get top 4 related products

          setRelatedProducts(related);
        }

        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }
    Fetch();
  }, [productSlug]);

  const buyNow = () => {
    dispatch({
      type:type.EMPTY_CART
    })
    AddToCart()
    navigate("/payment")
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="bg-gray-100 dark:bg-gray-700 min-h-screen">
          <AdvancedLoader message="Loading product details..." />
        </div>
      </Layout>
    );
  }
console.log(product)
  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
<div className="text-7xl mb-4 text-amber-500 flex justify-center">
  <FaSearch />
</div>            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Main Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
              {/* Product Image Section */}
              <div className="relative">
                <div className="sticky top-24">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 flex items-center justify-center">
                    <img
                      className="w-full max-h-[400px] object-contain mix-blend-multiply dark:mix-blend-normal"
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="flex flex-col">
                {/* Category Tag */}
                <div className="mb-2">
                  <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold uppercase tracking-wide">
                    {product.category.name}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  {product.title}
                </h1>

                {/* Description Section */}
                {product.description && (
                  <div className="mb-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-gray-800 dark:text-white">
                      <CurrencyFormat amount={product.price} />
                    </span>
                    {product.oldPrice && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          <CurrencyFormat amount={product.oldPrice} />
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          Save{" "}
                          {Math.round(
                            ((product.oldPrice - product.price) /
                              product.oldPrice) *
                              100,
                          )}
                          %
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    ✓ Free shipping on orders over $50
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="cursor-pointer w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold text-gray-800 dark:text-white w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="cursor-pointer w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      In stock
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={buyNow}
                    className="cursor-pointer flex-1 px-6 py-3 rounded-xl font-semibold
                             bg-gradient-to-r from-amber-500 to-orange-500 
                             hover:from-amber-600 hover:to-orange-600
                             text-white shadow-lg hover:shadow-xl 
                             transform hover:scale-105 transition-all duration-300
                             flex items-center justify-center gap-2"
                  >
                    <span>💰</span>
                    Buy Now
                    <span>→</span>
                  </button>

                  <button
                    onClick={AddToCart}
                    className="cursor-pointer flex-1 px-6 py-3 rounded-xl font-semibold
                             border-2 border-amber-500 text-amber-600 dark:text-amber-400
                             hover:bg-amber-500 hover:text-white
                             transition-all duration-300 transform hover:scale-105
                             flex items-center justify-center gap-2"
                  >
                    <span>🛒</span>
                    Add to Cart
                  </button>
                </div>

                {/* Delivery Info */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-green-600 dark:text-green-400 text-xl">
                      ✓
                    </span>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Free Delivery
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Get it by tomorrow with express shipping
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-600 dark:text-blue-400 text-xl">
                      ↺
                    </span>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        30 Days Return
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Easy returns within 30 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    You Might Also Like
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Products similar to this one
                  </p>
                </div>
                <Link
                  to={`/category/${product.category?.slug.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                  className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-medium"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard key={index} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default SingleProduct;
