import  { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import ProductCard from '../../components/product/ProductCard';
import AdvancedLoader from '../../components/loader/AdvancedLoader';
import axiosInstance from '../../Utility/axios';
import { FaSearch } from 'react-icons/fa';

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    setIsLoading(true);
    async function Fetch() {
      try {
        // Fetch all products
        const productsRes = await axiosInstance.get("/products");
        const productsData = await productsRes.data;

        setProducts(productsData.products);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    Fetch();
  }, []);

  // Filter products by category
  const getFilteredProducts = () => {
    if (filterCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category.slug === filterCategory);
  };

  // Sort products
  const getSortedProducts = (filteredProducts) => {
    let sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    return sorted;
  };

  const filteredProducts = getFilteredProducts();
  const sortedProducts = getSortedProducts(filteredProducts);

  // Get unique categories for filter
  const uniqueCategories = ['all', ...new Set(products.map(p => p.category.slug))];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        
        {/* Page Header */}
        <div className="relative bg-gradient-to-r from-amber-800 via-amber-700 to-orange-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 py-6 mb-6 shadow-lg">
          <div className="container mx-auto px-4">
            
            
            <h1 className="text-3xl md:text-3xl font-bold text-white text-center mb-2">
              All Products
            </h1>
            <p className="text-amber-100 dark:text-gray-300 text-center">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
            </p>
            <div className="w-20 h-1 bg-amber-400 mx-auto mt-4 rounded-full"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          
          {/* Filter and Sort Bar */}
          {products.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm
                             focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm
                             focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>
              
              {/* Results count */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <AdvancedLoader message="Loading products..." />
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map((singleProduct, index) => (
                    <ProductCard key={singleProduct.id || index} product={singleProduct} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
<div className="text-7xl mb-4 text-amber-500 flex justify-center">
  <FaSearch />
</div>                  <h2 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                    No Products Found
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    We couldn't find any products matching your criteria.
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                    Try clearing the filters or check back later for new arrivals!
                  </p>
                  <button 
                    onClick={() => {
                      setFilterCategory('all');
                      setSortBy('default');
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 
                             hover:from-amber-600 hover:to-orange-600 text-white font-medium 
                             rounded-lg transition-all transform hover:scale-105 shadow-md"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Products;