import { useState, useEffect, useContext } from "react";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/product/ProductCard";
import AdvancedLoader from "../../components/loader/AdvancedLoader";
import { dataContext } from "../../dataProvider/DataProvider";
import { FaSearch, FaFilter, FaTimes, FaSortAmountDown } from "react-icons/fa";
import axiosInstance from "../../Utility/axios";

function Search() {
  const [{ searchTerm }, dispatch] = useContext(dataContext);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/products");
      const data = response.data;
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      const data = response.data;
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category.name === selectedCategory,
      );
    }

    // Price range filter
    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "under-25":
          filtered = filtered.filter((product) => product.price < 25);
          break;
        case "25-50":
          filtered = filtered.filter(
            (product) => product.price >= 25 && product.price <= 50,
          );
          break;
        case "50-100":
          filtered = filtered.filter(
            (product) => product.price >= 50 && product.price <= 100,
          );
          break;
        case "over-100":
          filtered = filtered.filter((product) => product.price > 100);
          break;
        default:
          break;
      }
    } else if (priceRange.min || priceRange.max) {
      filtered = filtered.filter((product) => {
        const price = product.price;
        const minOk = !priceRange.min || price >= parseFloat(priceRange.min);
        const maxOk = !priceRange.max || price <= parseFloat(priceRange.max);
        return minOk && maxOk;
      });
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "relevance":
      default:
        filtered.sort((a, b) => a.id - b.id);
        break;
    }

    setFilteredProducts(filtered);
  };
  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, priceFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch({ type: "SEARCH_TERM", searchTerm: searchTerm });
    applyFilters();
  };

  const clearFilters = () => {
    dispatch({ type: "SEARCH_TERM", searchTerm: "" });
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("relevance");
    setPriceFilter("all");
    dispatch({ type: "SEARCH_TERM", searchTerm: "" });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === parseInt(categoryId));
    return category ? category.name : categoryId;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-orange-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 py-10 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Search Products
            </h1>
            <p className="text-amber-100 dark:text-gray-300 text-center">
              Find the perfect product for your needs
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      dispatch({
                        type: "SEARCH_TERM",
                        searchTerm: e.target.value,
                      })
                    }
                    placeholder="Search products by name, description, or category..."
                    className="w-full px-5 py-3 pl-12 pr-4 border border-gray-300 dark:border-gray-600 
                             rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                             focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 
                           hover:from-amber-600 hover:to-orange-600 text-white font-semibold 
                           rounded-xl transition-all transform hover:scale-105 shadow-md"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="cursor-pointer w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                       rounded-lg flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <FaFilter />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div
              className={`lg:w-72 ${showFilters ? "block" : "hidden lg:block"}`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <FaFilter className="text-amber-500" />
                    Filters
                  </h3>
                  {(searchTerm ||
                    selectedCategory !== "all" ||
                    priceFilter !== "all" ||
                    sortBy !== "relevance") && (
                    <button
                      onClick={clearFilters}
                      className="cursor-pointer text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <FaTimes />
                      Clear All
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="cursor-pointer w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                             focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range
                  </label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="cursor-pointer w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                             focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Prices</option>
                    <option value="under-25">Under $25</option>
                    <option value="25-50">$25 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="over-100">Over $100</option>
                  </select>
                </div>

                {/* Custom Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      min="0"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                      className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                               focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                      className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                               focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                             focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    <option value="relevance">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <AdvancedLoader message="Searching products..." />
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {filteredProducts.length} Results Found
                      </h2>
                      {searchTerm && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          Showing results for:{" "}
                          <span className="font-semibold">"{searchTerm}"</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FaSortAmountDown />
                      <span>Sorted by: {sortBy.replace("-", " ")}</span>
                    </div>
                  </div>

                  {/* Products */}
                  {filteredProducts.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center">
                      <div className="text-7xl mb-4 text-amber-500 flex justify-center">
                        <FaSearch />
                      </div>{" "}
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        No Products Found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {searchTerm
                          ? `We couldn't find any products matching "${searchTerm}"`
                          : "Try adjusting your filters or search terms"}
                      </p>
                      <button
                        onClick={clearFilters}
                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 
                                 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg 
                                 transition-all transform hover:scale-105"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Search;
