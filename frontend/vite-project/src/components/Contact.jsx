
//==========================================================================

import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Webinar Question',
    message: '',
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const subjects = [
    'Webinar Question',
    'Registration Help',
    'Payment Issue',
    'Referral Program',
    'Group Counselling Session',
    'Other',
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          mail: formData.email, // matching backend field `mail`
          message: `[${formData.subject}] ${formData.message}`
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatusMessage("Message sent successfully!");
        setMessageType("success");
        setFormData({ name: "", email: "", subject: "Webinar Question", message: "" });
      } else {
        setStatusMessage(result.message || "Something went wrong.");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Failed to submit form", err);
      setStatusMessage("Failed to send message. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div id="contact" className="pt-10 px-4 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl md:text-4xl text-center font-bold text-blue-700 mb-4">Get in Touch</h2>
      <p className='text-lg mb-10 text-center text-gray-600'>
        Have questions? We're here to help you navigate your career journey
      </p>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg space-y-4">
          <label className='text-black'>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-md text-black"
          />
          <label className='text-black'>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-md text-black"
          />
          <label className='text-black'>Select Subject</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md text-black"
          >
            {subjects.map((subj, idx) => (
              <option key={idx} value={subj}>
                {subj}
              </option>
            ))}
          </select>
          <label className='text-black'>Your Message</label>
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border border-gray-300 p-3 rounded-md text-black"
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md font-semibold"
            >
              Submit
            </button>
          </div>


          {/* Message Display */}
          {statusMessage && (
            <div
              className={`text-center font-medium mt-2 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {statusMessage}
            </div>
          )}
        </form>

        {/* Contact Info */}
        <div className="space-y-6 text-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Connect With Us</h2>
            <p><strong>Phone:</strong> +91 9999 999 999</p>
            <p>Monday - Friday, 9AM - 5PM EST</p>
          </div>
          <div>
            <p><strong>Email:</strong> info@careerwebinar.com</p>
            <p className="text-sm">For general inquiries</p>
          </div>
          <div>
            <p><strong>Support:</strong> support@careerwebinar.com</p>
            <p className="text-sm">For technical assistance</p>
          </div>
          <div>
            <p><strong>Location:</strong></p>
            <p>Ganpat University</p>
            <p>Kherva, India</p>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-blue-700 hover:text-blue-900">
              <FaFacebookF size={20} />
            </a>
            <a href="https://www.instagram.com/dharmik_23_06?utm_source=qr&igsh=dmU4anZsMzRlZGty" className="text-pink-600 hover:text-pink-800">
              <FaInstagram size={20} />
            </a>
            <a href="https://www.linkedin.com/in/dharmik-prajapati-548018250/" className="text-blue-500 hover:text-blue-700">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
