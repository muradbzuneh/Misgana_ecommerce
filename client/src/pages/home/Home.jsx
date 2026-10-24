
import CarouselEffect from "../../components/Carousel/Carousel"
import Category from "../../components/Category/Category"
import Layout from "../../components/Layout/Layout"
import Product from "../../components/product/Product"
const Home = () => {
  return (
    <Layout isFooterInclude={true}>
      <CarouselEffect />
      <Category />
      <Product />
      
      
    
    </Layout>
  )
}

export default Home