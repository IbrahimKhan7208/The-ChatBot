import React, { useState } from "react";
import { GoArrowUp } from "react-icons/go";
import axios from "axios";

const App = () => {
  const [text, setText] = useState(``);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  //CREATE A UNIQUE KEY FOR USER-ID, EK SESSION KI HISTROY RAKHNE KE LIYE.
  const [threadId] = useState(Date.now().toString(36) + Math.random().toString(36).substring(2, 8));

  async function submitHandler() {
    if (!text.trim()) return;

    const userInput = text;
    setText('');
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    setMessages((prev) => [...prev, { role: "assistant", content: "thinking", isLoading: true }]);

    try {
      let textRes = await axios.post("http://localhost:3000/ai", { text: userInput, threadId });

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: "assistant", 
          content: textRes.data,
          isLoading: false 
        };
        return newMessages;
      });
    } 
    
    catch (error) {
      console.error("Error:", error);
      // Replace loading with error message
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: "assistant", 
          content: "Sorry, there was an error.",
          isLoading: false 
        };
        return newMessages;
      });
    }

    setLoading(false);
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitHandler();
    }
  };

  return (
    <>
      <div className="title text-4xl tracking-tighter bg-zinc-900 text-zinc-200 pt-10 pl-10 font-semibold fixed">
        theChatBot.
      </div>
      <div className="flex justify-center bg-zinc-900 text-zinc-200 p-2 overflow-auto min-h-screen font-mono">
        <div className="chat w-1/2 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-zinc-500 mt-32 text-xl animate-pulse font-semibold">
              Start a conversation...
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.role === "user"
                  ? "p-3 mb-24 mt-20 bg-zinc-800 w-fit ml-auto rounded-xl"
                  : "mt-10 mb-24"
              }`}
            >
              <p className={msg.isLoading ? "text-zinc-400 animate-pulse" : ""}>
                {msg.isLoading ? "Thinking..." : msg.content}
              </p>
            </div>
          ))}
        </div>

        <div className="input fixed inset-x bottom-0  w-1/2 flex mb-4">
          <input
            className=" w-full h-16 bg-zinc-800 rounded-full p-5 outline-none border-zinc-600 border"
            name="text"
            id="text"
            value={text}
            onKeyUp={handleKeyPress}
            onChange={(e) => {
              setText(e.target.value);
            }}
            placeholder="How Can I Help You?"
            disabled={loading}
          ></input>
          <button
            onClick={submitHandler}
            disabled={loading}
            className="p-2 ml-2 text-2xl bg-zinc-200 rounded-full border-zinc-400 border text-zinc-900 hover:bg-zinc-300 disabled:opacity-50"
          >
            <GoArrowUp />
          </button>
        </div>
      </div>
    </>
  );
};

export default App;