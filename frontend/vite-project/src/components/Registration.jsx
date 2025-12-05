import React, { useState, useEffect } from "react";
import axios from "axios";
import PassForm from "../pages/PassForm";
import { fetchEvents } from "../utils/fatchEvent";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const Registration = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    referalcode: "",
    userspecialref: "",
    eventName: "",
    amount: 0,
    discount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showSubmit, setShowSubmit] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");
  const [discountedAmount, setDiscountedAmount] = useState(null);
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    const getEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);

        if (fetchedEvents.length > 0) {
          setFormData((prev) => ({
            ...prev,
            eventName: fetchedEvents[0].title,
            amount: fetchedEvents[0].price,
            discount: fetchedEvents[0].discount,
          }));
        }
      } catch (err) {
        setError("Failed to load events.");
        console.error("Error fetching events:", err);
      }
    };

    getEvents();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setShowPayment(true);
        setShowSubmit(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEventChange = (e) => {
    const selectedEvent = events.find(
      (event) => event.title === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      eventName: selectedEvent.title,
      amount: selectedEvent.price,
      discount: selectedEvent.discount,
    }));
    console.log("formData: ", formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${BASE_URL}/signup`, formData);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error("Registration error:", err.response);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySpecialRef = async () => {
    setDiscountMessage("");
    setDiscountError("");
    setDiscountedAmount(null);

    try {
      const response = await axios.post(`${BASE_URL}/userDiscount`, {
        specialref: formData.userspecialref,
        eventName: formData.eventName,
      });

      if (response.data && response.data.message === "Discount applied") {
        setDiscountMessage(
          `Referral code applied! You are eligible for a discount. New price: ₹${response.data.discount}`
        );
        setDiscountedAmount(response.data.discount);
        setFormData((prev) => ({
          ...prev,
          amount: response.data.discount,
        }));
      } else if (
        response.data &&
        response.data.message === "No discount applied or invalid special ref"
      ) {
        setDiscountError("Invalid referral code.");
      } else {
        setDiscountError("Failed to apply referral code.");
      }
    } catch (error) {
      setDiscountError(
        error.response?.data?.message || "Failed to apply referral code."
      );
    }
  };

  return (
    <div
      id="registration"
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6">
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
            Registration Form
          </h2>
          <p className="mt-2 text-center text-sm text-blue-100">
            Join our community today
          </p>
        </div>

        <div className="p-8">
          {message && (
            <div className="mb-6 p-4 border-l-4 border-green-500 bg-green-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0"></div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0"></div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {showSubmit ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="mobileNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobileNo"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label
                  htmlFor="eventName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Event
                </label>
                <select
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleEventChange}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                >
                  {events.map((event) => (
                    <option key={event.title} value={event.title}>
                      {event.title} (₹{event.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={`₹${formData.amount}`}
                  readOnly
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="referalcode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Referral Code
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  id="referalcode"
                  name="referalcode"
                  value={formData.referalcode}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                  placeholder="REF123"
                />
              </div>
              <div>
                <label
                  htmlFor="userspecialref"
                  className="block text-sm font-medium text-gray-700"
                >
                  Special Referral Code
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <div className="flex items-center mt-1">
                  <input
                    type="text"
                    id="userspecialref"
                    name="userspecialref"
                    value={formData.userspecialref}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                    placeholder="GUNI123"
                  />
                  <button
                    type="button"
                    className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    onClick={handleApplySpecialRef}
                  >
                    Apply
                  </button>
                </div>
                {discountMessage && (
                  <div className="mt-2 text-green-700 bg-green-50 border-l-4 border-green-500 p-2 rounded">
                    {discountMessage}
                  </div>
                )}
                {discountError && (
                  <div className="mt-2 text-red-700 bg-red-50 border-l-4 border-red-500 p-2 rounded">
                    {discountError}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  } transition-all duration-200`}
                >
                  {loading ? "Registering..." : "Register Now"}
                </button>
              </div>
            </form>
          ) : null}

          {showPayment ? (
            <PassForm
              feeAmount={formData.amount}
              email={formData.email}
              mobileNo={formData.mobileNo}
              firstName={formData.firstName}
              lastName={formData.lastName}
              discount={formData.discount}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Registration;

