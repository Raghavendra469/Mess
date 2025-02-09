import React from "react";
import WelcomeText from "./bodyComponents/WelcomeText";
import LoginButton from "./bodyComponents/LoginButton";
import AboutWebsite from "./bodyComponents/AboutWebsite";
import AboutArtist from "./bodyComponents/AboutArtist";
import AboutManager from "./bodyComponents/AboutManager";

const Body = () => {
  return (
    <div className="flex flex-col items-center space-y-1 mt-1">
      {/* Welcome Section */}
      <section id="home" className="flex flex-col justify-center items-center min-h-screen text-center">
        <WelcomeText />
      </section>

      <section id="about-website">
        <AboutWebsite />
      </section>

      <section id="about-artist">
        <AboutArtist />
      </section>

      <section id="about-manager">
        <AboutManager />
      </section>
    </div>
  );
};

export default Body;
