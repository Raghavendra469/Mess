import React from "react";
import Navbar from "../components/homeComponents/Navbar";
import Body from "../components/homeComponents/body";
import Footer from "../components/homeComponents/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-teal-500 flex flex-col">
      <Navbar />
      <div className="pt-16"> {/* Add padding-top to prevent overlap */}
        <Body />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
