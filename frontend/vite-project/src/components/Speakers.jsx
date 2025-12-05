



import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

const Speakers = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        // const res = await axios.get(`${BASE_URL}/webinar`);
        const res = await axios.get(`${BASE_URL}/speakers`);
        if (Array.isArray(res.data)) {
          setSpeakers(res.data);
        } else {
          setSpeakers([]);
        }
      } catch (err) {
        console.error('Failed to fetch speakers:', err);
        setError('Failed to fetch speaker data');
        setSpeakers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div id="speakers" className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-blue-700 mb-4">Meet Our Speakers</h2>
        <p className="text-lg mb-10 text-center text-gray-600">
          Industry professionals who will guide you toward career success
        </p>

        {loading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-600">{error}</div>
        ) : (
          <div
            className={`grid gap-8 justify-center ${speakers.length === 1
                ? 'grid-cols-1 max-w-md mx-auto'
                : speakers.length === 2
                  ? 'sm:grid-cols-2 max-w-3xl mx-auto'
                  : 'sm:grid-cols-2 lg:grid-cols-3'
              }`}
          >
            {speakers.map((speaker, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* <img
                  src={`data:${speaker.expert_image.contentType};base64,${btoa(
                    String.fromCharCode(...speaker.expert_image.data.data)
                  )}`}
                  alt={speaker.expert}
                  className="w-full h-64 object-cover"
                /> */}


                <img
                  src={`data:${speaker.expert_image.contentType};base64,${arrayBufferToBase64(speaker.expert_image.data.data)}`}
                  alt={speaker.expert}
                  className="w-full h-64 object-cover"
                />


                <div className="flex flex-col h-full justify-between text-center p-6">
                  <h3 className="text-xl font-semibold mb-2">{speaker.expert}</h3>
                  <p className="text-blue-600 font-medium">{speaker.expert_experience}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Speakers;
