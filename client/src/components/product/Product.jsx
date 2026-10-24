import  { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import axiosInstance from '../../Utility/axios'
import AdvancedLoader from '../loader/AdvancedLoader'

function Product() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    async function Fetch() {
      try {
        const result = await axiosInstance.get("/products")
        let data = await result.data
        data = await data.products
        const randomProducts = await data.sort(() => 0.5 - Math.random()).slice(0, 8)
        await setProducts(randomProducts)
        setIsLoading(false)
      } catch (error) {
        console.log(error);
        setIsLoading(true)
      }
    }
    Fetch()
  }, [])

  return (
    <div className=' bg-gray-200 dark:bg-gray-600 md:-mt-15 xl:-mt-25'>
      <div className=' w-full max-w-425 mx-auto flex flex-col items-center pb-8 pt-6 px-4'>
      <div className='text-center mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold font-serif text-gray-800 dark:text-white mb-2'>
          Best Seller's Products
        </h1>
        <div className='w-20 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full'></div>
        <p className='text-gray-500 dark:text-gray-400 text-sm mt-2'>
          Most popular items this month
        </p>
      </div>
      
      {isLoading ? (
        <AdvancedLoader message={"Loading best seller products..."} />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full'>
          {products.map((product, index) => {
            return <ProductCard product={product} key={index}/>
          })}
        </div>
      )}
    </div>
    </div>
  )
}

export default Product