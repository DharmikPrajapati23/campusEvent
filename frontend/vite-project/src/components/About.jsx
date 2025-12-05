//================================================================
import React from "react";
import { CheckCircle } from "lucide-react";

const About = () => {
  return (
    <section className="py-16 bg-gray-50">
      {/* Header Section */}
      <div id="about" className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-blue-700 mb-4">
          About Our Career Counselling Webinar
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Designed to help students and professionals navigate their career paths with confidence and clarity.
        </p>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">Why Attend Our Webinar?</h3>

          <div className="space-y-6">
            {[
              {
                title: "Expert Guidance",
                desc: "Learn from industry professionals with proven track records in career development.",
              },
              {
                title: "Personalized Insights",
                desc: "Gain tailored advice that aligns with your skills, interests, and career aspirations.",
              },
              {
                title: "Networking Opportunities",
                desc: "Connect with like-minded individuals and expand your professional network.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <CheckCircle className="text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Button with proper arrangement */}
          <div className="mt-8 flex justify-center md:justify-start">
            <a
              href="#registration"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
            >
              Secure Your Spot
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <img
            src="./images/guni-campus.jpeg"
            alt="GUNI Campus"
            className="w-full md:w-[500px] lg:w-[600px] xl:w-[700px] h-auto rounded-2xl shadow-lg"
          />
        </div>

      </div>
    </section>
  );
};

export default About;
