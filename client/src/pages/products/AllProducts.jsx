import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../../components/Layout/Layout';
import AdvancedLoader from '../../components/loader/AdvancedLoader';
import ProductCard from '../../components/product/ProductCard';
import axiosInstance from '../../Utility/axios';

function AllProducts() {
  const { productCategory } = useParams();
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    async function Fetch() {
      try {
        const categories = await axiosInstance.get("/categories");
        const categoriesData = await categories.data;
        const category = categoriesData.categories.find((cat) => cat.slug === productCategory);
        const catName = category?.name;
        setCategoryName(catName || productCategory)
        
        const result = await axiosInstance.get("/products");
        let data = await result.data;
        data = await data.products.filter((product) => product.category.name === catName);
        await setProducts(data)
        setIsLoading(false)
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }
    Fetch()
  }, [productCategory])

  return (
    <Layout isFooterInclude={true}>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        {/* Category Header */}
        <div className='relative bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 py-4 mb-8'>
          <div className='container mx-auto px-4'>
            <h1 className='text-3xl md:text-4xl font-bold text-white text-center mb-2'>
              {categoryName || 'Products'}
            </h1>
            <p className='text-amber-100 dark:text-gray-300 text-center'>
              {products.length} {products.length === 1 ? 'product' : 'products'} available
            </p>
            <div className='w-20 h-1 bg-amber-400 mx-auto mt-4 rounded-full'></div>
          </div>
        </div>
        
        <div className='container mx-auto px-4 py-8'>
          {isLoading ? (
            <div className='flex justify-center items-center min-h-100'>
              <AdvancedLoader message={`Loading ${categoryName || 'products'}...`} />
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {products.map((singleProduct, index) => {
                    return <ProductCard key={index} product={singleProduct} />
                  })}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
                  <div className='text-6xl mb-4'>🛒</div>
                  <h2 className='text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2'>
                    No Products Found
                  </h2>
                  <p className='text-gray-500 dark:text-gray-400 mb-6'>
                    We couldn't find any products in the "{categoryName || productCategory}" category.
                  </p>
                  <button 
                    onClick={() => window.history.back()}
                    className='px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105'
                  >
                    ← Go Back
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default AllProducts