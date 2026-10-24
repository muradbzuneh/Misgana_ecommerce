import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import AdvancedLoader from "../loader/AdvancedLoader";
import axiosInstance from "../../Utility/axios";


function Category() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    async function fetchData() {
      try {
        const res = await axiosInstance.get("/categories");
        // Get only first 8 categories
        setCategories(res.data.categories.slice(0, 8));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Check scroll position to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="w-full max-w-425 mx-auto  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center relative z-10 -mt-62.5  px-4">
        {isLoading ? (
          <div className="flex items-center justify-center w-full">
            <AdvancedLoader message="Loading categories..." />
          </div>
        ) : (
          categories.map((element) => {
            return (
              <CategoryCard
                key={element.slug}
                title={element.name}
                image={element.image}
                name={element.name}
                id={element.slug}
              />
            );
          })
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:hidden z-50 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Back to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
      <svg
  data-name="Layer 1"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1200 120"
  preserveAspectRatio="none"
  className="fill-current text-gray-200 dark:text-gray-600 hidden md:block"
>
  <path
    d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
  />
</svg>
    </div>
  );
}

export default Category;
