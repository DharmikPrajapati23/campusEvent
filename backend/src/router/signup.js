const express = require("express");
const authRouter = express.Router();

const User = require("../model/register");
const sendVerificationEmail = require("../util/emailService");
const webinar = require("../model/webinar");
const Refund = require("../model/refund");
const Payment = require("../model/payment");

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      lastName,
      firstName,
      email,
      mobileNo,
      referalcode,
      eventName,
      userspecialref,
    } = req.body;

    const userExists = await User.find(
      { email: email } && { mobileNo: mobileNo } && { eventName: eventName }
    );

    const flag = 0;
    // userExists.forEach((usera) => {
    if (
      userExists.length > 0 &&
      userExists[0].email === email &&
      userExists[0].mobileNo === mobileNo &&
      userExists[0].eventName === eventName
    ) {
      return res.status(500).json({
        message: "User already exists jake dosto ko refer kar",
        referalcode: userExists[0].referalcodeUserGenerated,
      });
    }
    console.log("flag: ", flag);
    console.log("userExists: ", userExists);

    function generateReferralCode() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
      return result;
    }

    const generateReferralcode = generateReferralCode();
    console.log(generateReferralcode);

    const user = new User({
      firstName,
      lastName,
      email,
      mobileNo,
      referalCodeUserEnter: referalcode,
      referalcodeUserGenerated: generateReferralcode,
      specialref: userspecialref,
      eligibleForRefund: 0,
      eventName,
    });

    await user.save();
    const users = await User.find({ referalCodeUserEnter: referalcode });
    // console.log("Users: ", users);
    // const refralUsers = await User.find({
    //   referalcodeUserGenerated: referalcode,
    // });
    // console.log("Refral User: ", refralUsers);
    const isObtainedRefund = users.length >= 5 ? 1 : 0;

    const events = await webinar.find({ title: eventName });
    // console.log("events: ", events);

    const price = events[0].price;
    const discount = events[0].discount;
    const specialref = events[0].specialref;
    console.log(
      "price: ",
      price,
      "   ",
      "discount: ",
      discount,
      "  ",
      "specialref:",
      specialref
    );

    if (userspecialref === specialref) {
    console.log(
      `Discount ${discount} applied: `,
      price - (price * discount) / 100
    );
    }

    console.log("obtain: ", isObtainedRefund);
    const userExistsRefund =
      (
        await Refund.find({
          referalcodeUserGenerated: referalcode,
        })
      ).length > 0
        ? 1
        : 0;

    console.log("userExistsRefund: ", userExistsRefund);
    if (isObtainedRefund && !userExistsRefund) {
      const refralUsers = await User.find({
        referalcodeUserGenerated: referalcode,
      });
      console.log("Refral User: ", refralUsers);

      const refund = new Refund({
        ...refralUsers[0]._doc,
        eligibleForRefund: 1,
        userId: refralUsers[0]._id,
      });

      await refund.save();
    }
    // console.log("Users: ", users);

    try {
      await sendVerificationEmail(email, generateReferralcode);
      return res.status(201).json({
        message: "Referral Code sent to email",
        users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error sending email",
      });
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

authRouter.get("/refundUser", async (req, res) => {
  try {
    const users = await User.find({ eligibleForRefund: 1 });
    const enrollmentOfUsers = users
      .filter((user) => user.enrollment !== undefined)
      .map((user) => user.enrollment);

    console.log("Refral User: ", users);
    console.log("Refral User: ", enrollmentOfUsers);

    res.status(200).json({
      message: "Refund Users",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



authRouter.post("/userDiscount", async (req, res) => {
 
  try {
    const { specialref, eventName } = req.body;
    const webinarData = await webinar.find({ title: eventName });
    const discount = webinarData[0].discount;
    const price = webinarData[0].price;
    const specialrefEvent = webinarData[0].specialref;

    if (specialref === specialrefEvent) {
      console.log(
        `Discount ${discount} applied: `,
        price - (price * discount) / 100
      
      );

      return res.status(200).json({
        message: "Discount applied",
        eventName: eventName,
        price: price,
        discount: price - (price * discount) / 100,
      });
    } else {
      console.log("No discount applied: ", price);
      return res.status(200).json({
        message: "No discount applied or invalid special ref",
        eventName: eventName,
        price: price,
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
 

});


module.exports = authRouter;
