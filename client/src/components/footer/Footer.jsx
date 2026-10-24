import { Link } from 'react-router-dom';
import { 
  FaLinkedin, 
  FaGithub, 
  FaInstagram, 
  FaFacebook, 
  FaTwitter,
  FaArrowUp,
  FaHome,
  FaShoppingCart,
  FaTruck,
  FaSearch,
  FaBoxOpen
} from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';

function Footer() {
  const currentYear = new Date().getFullYear();

  // Social Media Links with React Icons
  const socialLinks = [
    { name: 'LinkedIn', icon: <FaLinkedin className="text-2xl" />, link: 'https://www.linkedin.com/in/yohannes-wegayehu/', color: 'hover:text-blue-500' },
    { name: 'GitHub', icon: <FaGithub className="text-2xl" />, link: 'https://github.com/yohannes-wegayehu', color: 'hover:text-gray-400' },
    { name: 'Instagram', icon: <FaInstagram className="text-2xl" />, link: 'https://www.instagram.com/yohannes_wegayehu/', color: 'hover:text-pink-500' },
    { name: 'Facebook', icon: <FaFacebook className="text-2xl" />, link: 'https://web.facebook.com/yohanneswegayehuu', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: <FaTwitter className="text-2xl" />, link: 'https://x.com/yohannes_dev', color: 'hover:text-sky-400' }
  ];

  // Navigation Links (Header)
  const navLinks = [
  { 
    text: 'Home', 
    path: '/', 
    icon: <FaHome className="mr-2 text-amber-500 group-hover:text-amber-400" />,
    active: true
  },
  { 
    text: 'Products', 
    path: '/products', 
    icon: <FaBoxOpen className="mr-2 text-amber-500 group-hover:text-amber-400" />,
    description: 'Browse all products'
  },
  { 
    text: 'Search', 
    path: '/search', 
    icon: <FaSearch className="mr-2 text-amber-500 group-hover:text-amber-400" />,
    description: 'Find your favorite items'
  },
  { 
    text: 'Orders', 
    path: '/orders', 
    icon: <FaTruck className="mr-2 text-amber-500 group-hover:text-amber-400" />,
    description: 'Track your orders'
  },
  { 
    text: 'Cart', 
    path: '/cart', 
    icon: <FaShoppingCart className="mr-2 text-amber-500 group-hover:text-amber-400" />,
    description: 'View your cart',
    badge: true
  }
];


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-100 mt-auto transition-all duration-300">
      
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="w-full bg-white/10 hover:bg-white/20 py-3 text-sm text-center transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2 group"
      >
        <FaArrowUp className="group-hover:-translate-y-1 transition-transform" />
        Back to top
      </button>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4 col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">
                Afri<span className="text-amber-300">Gebeya</span>
              </span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              Your premier African marketplace for authentic products, 
              connecting artisans and buyers across the continent.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-200">
              <FiMapPin className="text-amber-400" />
              <span>Ethiopia 🇪🇹</span>
            </div>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transform transition-all duration-300 hover:scale-110 ${social.color} text-gray-200 hover:text-white`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4 col-span-2">
            <h3 className="font-bold text-lg border-b-2 border-amber-500/50 inline-block pb-1">
              Quick Navigation
            </h3>
            <ul className="space-y-2">
              {navLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-gray-200 hover:text-amber-300 hover:translate-x-1 transition-all duration-200 inline-flex items-center text-sm group"
                  >
                    {item.icon}
                    <span className="group-hover:ml-1 transition-all">{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/20 backdrop-blur-sm py-4 text-center text-xs">
        <div className="container mx-auto px-4">
          <p className="text-gray-300 flex items-center justify-center gap-1">
            © {currentYear} AfrigeBeya. All rights reserved. 
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;