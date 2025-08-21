import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Book, Send } from "lucide-react";
import PlaceHolder from "../component/sections/PlaceHolder";
import AiResponse from "../component/sections/AiResponse";
import axios from "axios";

const TalkDataInterface = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [visibleWords, setVisibleWords] = useState([]);
  const [responseText, setResponseText] = useState([]);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");

  const handleMessageChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleResponse = async () => {
    if (!inputMessage.trim()) return; // Prevent empty message

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
    };

    setResponses((prevMessages) => [...prevMessages, userMessage]);

    setIsTyping(true);

    const response = await axios.post(
      'http://localhost:3001/messages',
      { text: inputMessage },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const payload = {
      question: inputMessage,
      // session_id: "1234",
      // model: "llama3-70b-8192",
    };

    // const response = "Hello this is Farhaan Shaikh, kaise hai sab log, sab maze me na?";
    // const data = await axios.post(`http://localhost:8000/chat`, payload);
    // const response = data.data;

    const { data } = await axios.post("http://localhost:8001/ask/", payload, {
      headers: {
        "Content-Type": "application/json", // Ensure JSON format
      },
    });
    console.log(data);



    // setResponses((prev) => [...prev, { id: Date.now().toString(), text: data.response, sender: "ai" }]);
    setTimeout(() => {
      setResponseText(data.response
        .trim()
        .split(/\s+/) // Split by any whitespace
        .filter(word => word.length > 0));
    }, 2000)

    setInputMessage("");
  };

  useEffect(() => {
    if (responseText.length === 0) return;

    setVisibleWords([]);
    let i = 0;
    const totalWords = responseText.length;

    const interval = setInterval(() => {
      if (i < totalWords) {
        setVisibleWords(prev => [...prev, responseText[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setResponses(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              text: responseText.join(" "),
              sender: "bot",
            },
          ]);
          setVisibleWords([]);
          setResponseText([]);
          setIsTyping(false);
        }, 100);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [responseText]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses, isTyping]);

  return (
    <div className="relative max-w-5xl mx-auto text-center text-black h-screen flex flex-col justify-between flex-1">
      {/* Header */}

      {responses.length === 0 && (
        <PlaceHolder setInputMessage={setInputMessage} />
      )}

      {responses.length !== 0 && (
        // <AiResponse messages={responses}/>
        <div className="relative w-full mx-auto text-center text-black h-screen flex flex-col justify-between flex-1">
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            {responses.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-800 text-left"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 bg-gray-200 text-gray-800 text-left">
                  {visibleWords.join(" ")}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-gray-200 rounded-xl p-4 absolute items-center bottom-0 w-full mb-4 flex justify-between mb-8">
        <div className="flex items-start gap-2 w-[85%]">
          <Sparkles className="w-5 h-5 text-gray-600" />
          <input
            placeholder="Ask AI a question or make a request..."
            className="flex-1 bg-transparent resize-none outline-none text-md"
            value={inputMessage}
            onChange={handleMessageChange}
          />
        </div>

        <div className="flex items-center gap-2 ">
          <span className="text-sm text-gray-500">
            {inputMessage.length}/2000
          </span>
          <button className="text-gray-400 hover:text-gray-900">
            <Send
              className={`mr-5 w-6 h-6 ${
                inputMessage.length !== 0
                  ? "text-gray-900 cursor-pointer"
                  : "text-gray-500"
              }`}
              style={{ rotate: "45deg" }}
              onClick={inputMessage.length !== 0 ? handleResponse : undefined}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TalkDataInterface;
