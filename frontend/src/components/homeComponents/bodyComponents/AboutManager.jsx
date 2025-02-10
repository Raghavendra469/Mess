import React from "react";
import managerImage from "./assets/manager.jpg";

const AboutManager = () => {
  return (
    <div className="border-2 border-gray-300 rounded-lg bg-white text-teal-600 p-6 mb-6 shadow-md">
      <div className="flex flex-col md:flex-row items-center md:items-center gap-6 max-w-3xl justify-between">
        <div className="text-teal text-lg md:text-xl">
          <h2 className="text-2xl font-bold">About Managers</h2>
          <p>
            A music manager plays a crucial role in an artist's career, handling business, contracts, and promotions.
            They oversee scheduling, negotiate deals, and connect artists with record labels, producers, and promoters.
            A good manager helps musicians grow their brand, secure gigs, and navigate the industry’s complexities.
            They often provide career guidance, ensuring the artist stays on track creatively and financially.
          </p>
        </div>
        <img src={managerImage} alt="Manager" className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover self-center md:self-end" />
      </div>
    </div>
  );
};

export default AboutManager;
