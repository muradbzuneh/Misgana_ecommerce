
function AdvancedLoader({ message = "Loading...", size = "medium" }) {
  
  // Size configurations
  const sizes = {
    small: {
      container: "w-16 h-16",
      dot: "w-2 h-2",
      text: "text-sm"
    },
    medium: {
      container: "w-24 h-24",
      dot: "w-3 h-3",
      text: "text-base"
    },
    large: {
      container: "w-32 h-32",
      dot: "w-4 h-4",
      text: "text-lg"
    }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      {/* Animated Loader Container */}
      <div className={`relative ${currentSize.container}`}>
        {/* Rotating Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 border-r-amber-500 border-b-gray-200 border-l-gray-200 dark:border-b-gray-700 dark:border-l-gray-700 animate-spin"></div>
        
        {/* Inner Pulsing Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${currentSize.dot} bg-amber-500 rounded-full animate-pulse`}></div>
        </div>
        
        {/* Outer Ripple Effect */}
        <div className="absolute inset-[-8px] rounded-full border-2 border-amber-500/30 animate-ping"></div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-6 text-center">
        <p className={`${currentSize.text} font-medium text-gray-700 dark:text-gray-300`}>
          {message}
        </p>
        
        {/* Animated Dots */}
        <div className="flex items-center justify-center gap-1 mt-2">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
      
      {/* Loading Progress Bar (Optional) */}
      <div className="mt-6 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-loading-bar"></div>
      </div>
    </div>
  );
}

export default AdvancedLoader;