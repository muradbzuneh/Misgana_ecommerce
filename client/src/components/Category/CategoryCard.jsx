import { Link } from "react-router-dom";

function CategoryCard(props) {
  return (
    <Link to={`/category/${props.id}`}>
      <div className="flex flex-col mb-2 bg-white dark:bg-gray-800 w-55 md:w-70 ml-4 gap-3 pt-6 h-80 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <h2 className="p-2 ml-3 text-lg font-semibold font-serif text-gray-800 dark:text-white">
          {props.title}
        </h2>
        <img 
          className="flex-1 w-full max-h-35 md:max-h-45 object-contain" 
          src={props.image} 
          alt={props.title} 
        />
        <p className="p-2 ml-3 text-amber-600 dark:text-amber-400 text-md hover:underline font-medium">
          Shop now →
        </p>
      </div>
    </Link>
  );
}

export default CategoryCard;