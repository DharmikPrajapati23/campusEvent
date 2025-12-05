
import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const PassForm = ({
  feeAmount,
  email,
  mobileNo,
  firstName,
  lastName,
  discount,
}) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // const discountedFee = feeAmount - (feeAmount * discount) / 100;
  const discountedFee = feeAmount;

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () =>
        setPaymentError("Failed to load Razorpay SDK. Please refresh.");
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  const handleBuyClick = async () => {
    if (!razorpayLoaded) {
      setPaymentError("Razorpay SDK is still loading. Please wait.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/payment/create`,
        {
          amount: parseInt(discountedFee.toString()),
          currency: "INR",
          receipt: `receipt_${mobileNo}`,
          firstName,
          lastName,
          mobileNo,
          email,
        },
        { withCredentials: true }
      );

      const {
        amount,
        keyId,
        currency,
        orderId,
        _id: paymentId,
      } = response.data;

      const options = {
        key: keyId,
        amount: amount.toString(),
        currency,
        name: "Campus Event",
        description: "Event Pass Payment",
        order_id: orderId,
        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
        },
        theme: {
          color: "#3498db",
        },
        handler: async (response) => {
          try {
            const update = await axios.post(`${BASE_URL}/payment/update`, {
              paymentId,
              razorpayPaymentId: response.razorpay_payment_id,
              status: "success",
            });

            if (update.data.success) {
              setPaymentSuccess(true);
              setPaymentError(null);
            } else {
              setPaymentError(
                update.data.message || "Failed to update payment."
              );
            }
          } catch (err) {
            setPaymentError("Failed to update payment status.");
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentError("Payment cancelled by user.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPaymentError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6 relative">
      {/* Background Blur */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 opacity-50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 opacity-30 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden transition-transform hover:scale-105">
        {/* Success Message */}
        {paymentSuccess && (
          <div className="mx-8 mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded-md">
            ✅ Payment successful! Thank you for registering.
          </div>
        )}

        {/* User Info */}
        <div className="p-8 space-y-6">
          <h2 className="text-xl font-bold text-blue-800">Your Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard label="First Name" value={firstName} fullWidth/>
            <InfoCard label="Last Name" value={lastName} fullWidth/>
            <InfoCard label="Mobile Number" value={mobileNo} fullWidth/>
            <InfoCard label="Email" value={email} fullWidth />
          </div>
        </div>

        {/* Footer Section */}
        <div className="px-8 pb-6 space-y-4">
          {paymentError && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
              ❌ {paymentError}
            </div>
          )}

          {discount > 0 && (
            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded-md">
              🎉 Discount applied: {discount}% off
            </div>
          )}

          <div className="text-lg font-semibold text-gray-800">
            Payable Amount: ₹{discountedFee}
          </div>

          <button
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-300"
            onClick={handleBuyClick}
            disabled={paymentSuccess}
          >
            {paymentSuccess ? "Payment Completed" : "Proceed to Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, fullWidth = false }) => (
  <div
    className={`bg-white border border-blue-100 hover:border-blue-300 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${
      fullWidth ? "md:col-span-2" : ""
    }`}
  >
    <label className="text-xs font-semibold text-blue-800 mb-1 block">
      {label}
    </label>
    <div className="text-gray-800 font-medium text-lg break-words">{value}</div>
  </div>
);

export default PassForm;
