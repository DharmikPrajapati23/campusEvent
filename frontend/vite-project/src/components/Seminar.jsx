//===================================================================
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
// rtyt
const Seminars = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        // const res = await axios.get(`${BASE_URL}/webinar`);

        const res = await axios.get(`${BASE_URL}/seminar`);
        if (Array.isArray(res.data)) {
          setSeminars(res.data);
        } else {
          setSeminars([]);
        }
      } catch (err) {
        console.error('Failed to fetch seminars:', err);
        setError('Failed to fetch seminar data');
        setSeminars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeminars();
  }, []);

  const renderImage = (image) => {
    if (!image || !image.data) return '';
    const base64String = btoa(
      new Uint8Array(image.data.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:${image.contentType};base64,${base64String}`;
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div id="seminar" className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-blue-700 mb-4">Seminar Details </h2>
        <p className="text-lg mb-10 text-center text-gray-600">Explore our upcoming professional seminars to accelerate your career growth</p>

        {loading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-600">{error}</div>
        ) : (
          // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
          className={`grid gap-8 ${
            seminars.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : seminars.length === 2
              ? 'sm:grid-cols-2 max-w-4xl mx-auto'
              : 'sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
        
          {seminars.map((seminar, index) => (
    <div
      key={index}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
    >
      {seminar.image && (
        <img
          src={renderImage(seminar.image)}
          alt={seminar.title}
          className="w-full max-h-64 object-contain bg-gray-100"
        />
      )}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-center">{seminar.title}</h3>
        <p className="text-blue-700 font-medium text-center mb-4">{seminar.expert}</p>
        <div className="text-sm text-gray-700 space-y-1 mb-4">
          <p><strong>Start:</strong> {formatDate(seminar.beginning_date)}</p>
          <p><strong>End:</strong> {formatDate(seminar.end_date)}</p>
          <p><strong>Duration:</strong> {seminar.duration}</p>
          <p><strong>Venue:</strong> {seminar.venue}</p>
          <p><strong>Mode:</strong> {seminar.mode}</p>
          <p><strong>Price:</strong> ₹{seminar.price}</p>
        </div>
        <a
          href="#registration"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold inline-block mx-auto"
        >
          Register Now
        </a>
      </div>
    </div>
  ))}
</div>

          // <div
          //   className={`grid gap-8 ${seminars.length === 1
          //     ? 'grid-cols-1'
          //     : seminars.length === 2
          //       ? 'sm:grid-cols-2'
          //       : 'sm:grid-cols-2 lg:grid-cols-3'
          //     }`}
          // >
          //   {seminars.map((seminar, index) => (
          //     <div
          //       key={index}
          //       className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
          //     >
          //       {seminar.image && (
          //         <img
          //           src={renderImage(seminar.image)}
          //           alt={seminar.title}
          //           className="w-full h-56 object-cover"
          //         />
          //       )}
          //       <div className="p-6 flex flex-col justify-between flex-grow">
          //         <h3 className="text-xl font-semibold mb-2 text-center">{seminar.title}</h3>
          //         <p className="text-blue-700 font-medium text-center mb-4">{seminar.expert}</p>
          //         <div className="text-sm text-gray-700 space-y-1 mb-4">
          //           <p><strong>Start:</strong> {formatDate(seminar.beginning_date)}</p>
          //           <p><strong>End:</strong> {formatDate(seminar.end_date)}</p>
          //           <p><strong>Duration:</strong> {seminar.duration}</p>
          //           <p><strong>Venue:</strong> {seminar.venue}</p>
          //           <p><strong>Mode:</strong> {seminar.mode}</p>
          //           <p><strong>Price:</strong> ₹{seminar.price}</p>
          //         </div>
          //         <a
          //           href="#registration"
          //           className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold inline-block mx-auto"
          //         >
          //           Register Now
          //         </a>
          //       </div>
          //     </div>
          //   ))}
          // </div>
        )}
      </div>
    </section>
  );
};

export default Seminars;
