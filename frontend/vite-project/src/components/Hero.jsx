

//=================================================================

import React from "react";
import { Users } from "lucide-react"; // Import only the necessary icons
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative bg-cover bg-center h-[85vh] flex items-center"
      style={{
        backgroundImage: "url('../images/hero-banner.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Shape Your Future Career Path
        </h1>

        <p className="text-lg mb-6">
          Join our exclusive career counselling webinar and discover the
          opportunities waiting for you.
        </p>

        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-400" />
            <span>Limited to 100 participants</span>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Button with blue background and white text */}
          <a
            href="#registration"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-bold"
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;