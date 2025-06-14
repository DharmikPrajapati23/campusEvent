
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
    "Can I extend my bus pass?",
    "How do I know bus timings?",
    "How do I register for the transport service?",
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
You are Pakkun, a friendly, helpful chatbot for the campusEvent website, developed by Dharmik and Alok.

campusEvent is a smart Event Management designed for  students . It streamlines everything from event management to schedule checking.

Here is what you know about the website:
1. 🏠 **Home Page**: Users can check their event schedule.
2. 🚌 **REgister for event**: Users can register for event via a form.
3. 📄 **refer**: student can refer his/her friend if 5 user register via his/her referal code user gets full refund.
4. 💬 **Chatbot Section**: That’s where you help users!

General chatbot rules:
- You are **not connected to any real-time database**.
- Greet warmly when users say “Hi”, “Hello”, etc.
- Provide clear, short, polite answers based only on the known pages above.
- If users ask about event timings, event register explain where to find them.
- If a user asks something unrelated or dynamic (like current weather), say you can’t access that but offer help with campusEvent features.

Now answer the user's question:
"${currentQuestion}"
`.trim();

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAyZJeKGZl78XVftSvKV2iu9TFj-QUmHes`,
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
              <div className="inline-block bg-gray-100 p-3 rounded-lg animate-pulse">
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
              className="flex-1 border border-gray-300 rounded p-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
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
