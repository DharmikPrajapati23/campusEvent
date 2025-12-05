// import React from 'react'

// function FAQ() {
//   return (
//     <div>FAQ</div>
//   )
// }

// export default FAQ



import React, { useState } from 'react';

const faqData = [
  {
    question: "Can I get a refund if I can't attend?",
    answer:
      "Yes, we offer full refunds if requested at least 48 hours before the webinar. Alternatively, you can transfer your registration to a future session or receive access to the recorded version.",
  },
  {
    question: "Will there be individual attention during the webinar?",
    answer:
      "While the main session is presented to all participants, we include interactive elements and a dedicated Q&A period. For more personalized guidance, we recommend our one-on-one counseling sessions available as an add-on.",
  },
  {
    question: "How does the referral program work?",
    answer:
      "After registering, you'll receive a unique referral code. Share this with friends or colleagues. When five people register using your code, you'll automatically qualify for a free 1-hour group counseling session worth $200.",
  },
  {
    question: "What technology is required to participate?",
    answer:
      "You'll need a computer or tablet with internet access, a web browser, and audio capabilities. We use Zoom for our webinars, which can be accessed through your browser or by downloading the free Zoom application.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div id ="faq" className="bg-gray-50 py-16 px-4 sm:px-8">
      <h2 className="text-3xl md:text-4xl text-center font-bold text-blue-700 mb-4">Frequently Asked Questions</h2>
      <p className='text-lg mb-10 text-center text-gray-600'>
      Quick answers to common questions about our webinar and referral program
      </p>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
          >
            <button
              onClick={() => toggleAnswer(index)}
              className="text-lg mb-2 text-center text-gray-600 w-full text-left font-medium text-lg flex justify-between items-center"
            >
              {faq.question}
              <span className="text-blue-600">{openIndex === index ? '-' : '+'}</span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
