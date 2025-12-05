import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  const systemPrompt = `You are a helpful, friendly assistant for a website called campusEvent. 
You greet users, answer questions about  schedules, bookings, webinars, and other student services. 
Keep responses short, polite, and helpful. If users greet you, respond warmly.`;

  const examplePrompts = [
    "Hi What do you do?",
    "What is campusEvent?",
    "How do I register for the Webinar?",
  ];

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    const currentQuestion = question;
    setQuestion("");
    setGeneratingAnswer(true);
    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

const prompt = `
You are **Pakkun**, a friendly and helpful chatbot for the **campusEvent** website, created by Dharmik and Alok.

**About campusEvent**:
campusEvent is a smart event management platform designed for students. It helps users explore available seminars, view detailed information, register for events, and benefit from referral rewards.

### Website Features You Know:
1. 🏠 **Home Page** – Users can view all available seminars and check their schedules.
2. 📝 **Register for Event** – Users can fill out a form to register and make payment.
3. 🤝 **Referral Program** – If a user refers 5 friends using their referral code and those friends register, the original user gets a full refund.
4. 💬 **Chatbot Section** – That’s where you assist users with friendly and helpful responses.

### Chatbot Behavior Guidelines:
- You are **not connected to any real-time database** or dynamic content.
- Greet warmly when users say “Hi”, “Hello”, or similar.
- Provide short, clear, and polite answers only based on the features mentioned above.
- If users ask about event details or registration, guide them to the appropriate section.
- If users ask about topics not related to campusEvent (like news, weather, or location info), politely inform them you're here to assist with campusEvent only.

Now, respond to the user’s question:
"${currentQuestion}"
`.trim();

    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        // url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAyZJeKGZl78XVftSvKV2iu9TFj-QUmHes`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        },
      });

      const aiResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";

      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Gemini API error:", error.response?.data || error.message);
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: "❌ Error: Please try again later." },
      ]);
    }

    setGeneratingAnswer(false);
  }

  const markdownComponents = {
    p: ({ node, ...props }) => (
      <p className="overflow-auto hide-scrollbar" {...props} />
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto flex flex-col p-3">
        {/* Header */}
        <header className="text-center py-4">
          <h1 className="text-4xl font-bold text-blue-600">
            campusEvent Chatbot
          </h1>
          <p className="text-gray-600">
            Your AI assistant for buses, passes & more
          </p>
        </header>

        {/* Example prompts */}
        {chatHistory.length === 0 && (
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-blue-500 mb-2">
              Try asking:
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(prompt)}
                  className="bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded hover:bg-blue-100 shadow-sm transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 rounded-lg bg-white shadow-lg p-4 hide-scrollbar"
        >
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`mb-4 ${
                chat.type === "question" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${
                  chat.type === "question"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <ReactMarkdown components={markdownComponents}>
                  {chat.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {generatingAnswer && (
            <div className="text-left">
              <div className="text-black inline-block bg-gray-100 p-3 rounded-lg animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input form */}
        <form
          onSubmit={generateAnswer}
          className="bg-white rounded-lg shadow-lg p-4"
        >
          <div className="flex gap-2">
            <textarea
              required
              className="text-black flex-1 border border-gray-300 rounded p-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={generatingAnswer}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;