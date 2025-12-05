const connectDB = require("./src/database/register");
const express = require("express");
const app = express()
const cors = require("cors");
const authRouter = require("./src/router/signup");
const paymentRouter = require("./src/router/payment");
const adminRouter = require("./src/router/admin");












require("dotenv").config();






app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/", authRouter);
app.use("/", paymentRouter);

app.use("/", adminRouter);



connectDB()
  .then(() => {
    console.log("connection sucessfull");
    app.listen(process.env.PORT, () => {
      console.log("port listen at 3000");
    });
  })
  .catch((err) => {
    console.error("Connection Failed: ", err);
  });
