import { Outlet, useLocation, Link } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import Slider from "../components/Slider/Slider"; 


const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/app'; 

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white ">
      <Navbar />
      
      {isHomePage && <Slider />}

      <main className="grow container mx-auto p-4">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;