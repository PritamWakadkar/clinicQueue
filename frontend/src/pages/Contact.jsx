import React from "react";
import { assets } from "../assets/assets/assets_frontend/assets";

const Contact = () => {
  return (
    <div className="px-6 md:px-10 lg:px-20 py-12">

      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          CONTACT <span className="text-blue-600">US</span>
        </h1>
      </div>

      {/* Contact Section */}
      <div className="flex flex-col md:flex-row items-center gap-12">

        {/* Left Side */}
        <div className="md:w-1/2">
          <img
            src={assets.contact_image}
            alt="Contact"
            className="w-full rounded-xl shadow-lg"
          />
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 space-y-6 text-gray-600">

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              OUR OFFICE
            </h2>

            <p>
              54709 Willms Station
              <br />
              Suite 350, Washington, USA
            </p>
          </div>

          <div>
            <p>
              <span className="font-semibold text-gray-800">Tel:</span>{" "}
              (415) 555-0132
            </p>

            <p>
              <span className="font-semibold text-gray-800">Email:</span>{" "}
              greatstackdev@gmail.com
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Careers at PRESCRIPTO
            </h3>

            <p className="mt-2">
              Learn more about our teams and current job openings.
            </p>
          </div>

          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
            Explore Jobs
          </button>

        </div>

      </div>

    </div>
  );
};

export default Contact;