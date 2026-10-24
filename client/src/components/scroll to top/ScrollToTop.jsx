import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // or 'auto' for instant scroll
    });
  }, [pathname]); // Triggers on every route change

  return null;
}

export default ScrollToTop;