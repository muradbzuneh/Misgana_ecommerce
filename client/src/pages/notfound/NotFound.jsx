import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { FaSearch } from 'react-icons/fa';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Animated 404 Number */}
          <div className="relative mb-8">
            <div className="text-[150px] md:text-[200px] font-black leading-none select-none">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                4
              </span>
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent animate-bounce inline-block mx-4">
                0
              </span>
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                4
              </span>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 animate-float-slow">
              <div className="w-12 h-12 bg-amber-400/20 rounded-full blur-xl"></div>
            </div>
            <div className="absolute bottom-10 right-10 animate-float-fast">
              <div className="w-16 h-16 bg-orange-400/20 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Oops! Page Not Found
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Search Suggestions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 text-left flex flex-col items-center">
            <h3 className="text-sm flex gap-5 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
              <div className="text-3xl mb-4 text-amber-500 flex justify-center">
                <FaSearch />
              </div>
              You might be looking for:
            </h3>
            <div className="flex flex-wrap gap-2">
              <Link to="/products" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
                All Products
              </Link>
              <Link to="/category/electronics" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
                Electronics
              </Link>
              <Link to="/category/clothing" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
                Clothing
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
            
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>


        </div>
      </div>

      {/* Add animations to global CSS or style tag */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </Layout>
  );
}

export default NotFound;