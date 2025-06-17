# 🎓 CampusEvent

**CampusEvent** is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to explore upcoming webinars, interact with an intelligent chatbot, register for events with secure payments, and earn rewards through referrals and discount coupons.

---

## 🌐 Features

- 🔍 **Browse Webinars:** View all upcoming and available webinars with detailed descriptions.
- 🤖 **AI Chatbot Support:** Get quick and interactive help through an integrated chatbot.
- 💳 **Secure Payments:** Users can register and pay online for any webinar.
- 📧 **Email Authentication:** Receive confirmation and event details via email after successful registration.
- 🏰 **Referral Program:**
  - Each registered user receives a unique referral code.
  - When **5 new users** register using the referral code, the original user receives a **full refund**.
- 💸 **Discount Coupons:** Apply available promo codes for instant discounts during payment.

---

## 📦 Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, Nodemailer
- **Chatbot:** Custom prompt-engineered AI chatbot integrated with OpenAI APIs
- **Payment Gateway:** Razorpay or Stripe (based on your implementation)

---

## 🛠️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DharmikPrajapati23/campusEvent.git
   cd campusEvent
   ```

2. **Install server dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../frontend
   cd vita-project
   npm install
   ```

4. **Environment Variables**

   Create `.env` files in both `client/` and `server/` directories with necessary API keys and secrets (e.g., MongoDB URI, OpenAI Key, JWT Secret, SMTP settings, etc.).

5. **Run the application**

   ```bash
   # In server directory
   npm run dev

   # In client directory (in another terminal)
   npm run dev
   ```

---


## 📄 License

This project is licensed under the MIT License.

