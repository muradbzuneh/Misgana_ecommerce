import { Carousel } from "react-responsive-carousel";
import { Images } from "./bg images/Images";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function CarouselEffect() {
  return (
    <div className='relative'>
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showIndicators={false}
        showThumbs={false}
        interval={5000}
        showStatus={false}
        swipeable={true}
        stopOnHover={true}
      >
        {Images.map((image, index) => (
          <div key={index}>
            <img 
              src={image} 
              alt={`banner ${index + 1}`}
              className='w-full h-auto max-h-[600px] object-cover'
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </Carousel>
      
      {/* Gradient Overlay with Dark/Light Mode Support */}
      <div className='relative pointer-events-none'>
        <div className="absolute bottom-0 w-full h-[100px] md:h-[200px] lg:h-[300px] 
                      bg-gradient-to-t from-gray-200 via-gray-200/80 via-40% to-transparent
                      dark:from-gray-900 dark:via-gray-900/80 dark:via-40% dark:to-transparent">
        </div>
      </div>      
    </div>
  );
}

export default CarouselEffect;