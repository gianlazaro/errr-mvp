import NavBar from './NavBar';
import Footer from './footer';

export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      {children}
      {/* <Footer /> */}
    </>
  )
};
