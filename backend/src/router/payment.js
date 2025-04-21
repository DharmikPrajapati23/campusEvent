
const express = require("express");
// const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../util/razorpay");
const Payment = require("../model/payment");
const User = require("../model/register");
// const BusPass = require("../model/busPass");






paymentRouter.post("/payment/create", async (req, res) => {
  const {
    amount,
    currency = "INR",
    receipt,
    firstName,
    lastName,
    email,
    mobileNo,
  } = req.body;
  console.log("user", req.body);

  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  try {
    const options = {
      amount: amount * 100,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        firstName,
        lastName,
        email,
        mobileNo,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    const payment = new Payment({
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});




// paymentRouter.js

paymentRouter.post("/payment/update", async (req, res) => {
  const { paymentId, razorpayPaymentId, status } = req.body;

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        paymentId: razorpayPaymentId,
        status: status,
      },
      { new: true } // Return the updated document
    );

    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully.",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment status.",
      error: error.message,
    });
  }
});





module.exports = paymentRouter;