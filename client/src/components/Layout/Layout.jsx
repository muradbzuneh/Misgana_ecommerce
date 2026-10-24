import Header from "../Header/Header";
import Footer from "../footer/Footer";

const Layout = ({ children, isFooterInclude }) => {
  return (
    <>
      <Header />
      {children}
      {isFooterInclude && <Footer />}
    </>
  );
};

export default Layout;
