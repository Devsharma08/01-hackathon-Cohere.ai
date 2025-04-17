import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { useChatContext } from "../Store/context";
import { TbLayoutSidebar } from "react-icons/tb";
import customFetch from "../utils/customFetch";
import { Form, useActionData, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";

// Action function to handle the form submission
export const action = async ({ request, params }) => {
  const { userr } = params;
  const formData = await request.formData();
  const data1 = Object.fromEntries(formData);

  try {
    const response = await customFetch.post(`/chat/${userr}`, data1);
    const { data } = response;
    const { sessionId, msg } = data;
    return msg;
  } catch (error) {
    console.log(error);
    throw new Error("Please try again later...");
  }
};

// Loader function to fetch the chat history and session data
export const loader = async ({ params }) => {
  const { userr } = params;

  const { data } = await customFetch.get(`/chat/history/${userr}`);
  console.log(data);
  
  return data;
};

const Chat = () => {
  const { showSidebar, toggleSidebar } = useChatContext();
  const navigate = useNavigate();
  const { currentSession, otherSessions } = useLoaderData();
  const data = useActionData();

  const [prompt, setPrompt] = useState("");
  
  // Ref for scroll container to auto-scroll to bottom
  const messagesEndRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Auto-scroll to the bottom whenever a new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession]);

  const handlelogout = async () => {
    try {
      await customFetch.get("/logout");
      return navigate("/");
    } catch (error) {
      console.log(error);
      throw new Error("Please try again later...");
    }
  };

  const renderResponseWithCode = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const [fullMatch, lang, code] = match;
      const index = match.index;

      if (lastIndex !== index) {
        const contentBeforeCode = text.slice(lastIndex, index);
        parts.push(
          <div key={`text-${lastIndex}`} className="space-y-2">
            {renderFormattedText(contentBeforeCode)}
          </div>
        );
      }

      parts.push(
        <div key={`code-${index}`} className="my-4">
          <CodeBlock code={code.trim()} language={lang || "javascript"} />
        </div>
      );

      lastIndex = index + fullMatch.length;
    }

    if (lastIndex < text.length) {
      parts.push(
        <div key={`text-${lastIndex}`} className="space-y-2">
          {renderFormattedText(text.slice(lastIndex))}
        </div>
      );
    }

    return parts;
  };

  const renderFormattedText = (text) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Headings
      if (/^#{1,6}\s/.test(line)) {
        const level = line.match(/^#+/)[0].length;
        const Tag = `h${level}`;
        return (
          <Tag key={idx} className="font-bold text-white text-lg mt-2">
            {line.replace(/^#{1,6}\s/, "")}
          </Tag>
        );
      }

      // Numbered List
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-6 list-decimal text-white">
            {line.replace(/^\d+\.\s/, "")}
          </li>
        );
      }

      // Bullet List (also handles ":-" style)
      if (/^[-*+]|^:-/.test(line)) {
        return (
          <li key={idx} className="ml-6 list-disc text-white">
            {line.replace(/^[-*+:]?-?\s*/, "")}
          </li>
        );
      }

      // Default paragraph
      return (
        <p key={idx} className="text-white leading-relaxed">
          {line}
        </p>
      );
    });
  };
  useEffect(() => {
    if (navigation.state === "idle") {
      setPrompt("");
    }
  }, [navigation.state]);
  return (
    <div className="w-full h-screen flex bg-[#333333] overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={`flex flex-col transition-all duration-500 ease-in-out ${
          showSidebar ? "ml-[22vw] w-[78vw]" : "w-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 mt-4">
          <h1
            onClick={toggleSidebar}
            className="text-[20px] text-white font-semibold flex items-center gap-2 cursor-pointer"
          >
            {!showSidebar && <TbLayoutSidebar />} Cohere AI
          </h1>
          <button
            onClick={handlelogout}
            type="button"
            className="px-4 py-2 cursor-pointer text-white outline-none rounded-2xl bg-[#555]"
          >
            Logout
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 p-4 text-white custom-scrollbar overflow-y-auto">
          {currentSession ? (
            <div className="bg-[#333333] rounded-2xl p-4 shadow-md">
              <div className="space-y-6">
                {currentSession?.messages.map((msg, idx) => {
                  if (msg.role === "user") {
                    const assistantMsg =
                      currentSession.messages[idx + 1];
                    return (
                      <div key={msg._id} className="bg-[#333333] rounded-xl p-4">
                        <p className="text-sm flex justify-end gap-2.5 bg-[#1f1f1f] rounded-2xl px-4 py-4 text-white">
                          <span className="font-bold text-blue-300 "></span> {msg.prompt}
                        </p>
                        {assistantMsg?.role === "assistant" && (
                          <div className="text-sm bg-[#1f1f1f] rounded-2xl px-4 py-8 text-blue-300 mt-7">
                            <span className="font-bold">Assistant:</span>{" "}
                            <div className="mt-1">
                              {renderResponseWithCode(assistantMsg.response)}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ) : (
            <div className="text-white text-center text-4xl font-bold mt-20 ">How can i help you today ?....</div>
          )}

          {/* Show Loading Text */}
          {navigation.state === "submitting" && (
            <div className="text-white text-center font-bold mt-20">Loading...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Input at Bottom */}
        <div className="p-4 flex items-center justify-center flex-shrink-0">
          <Form method="post">
            <input
              type="text"
              name="prompt"
              id="prompt"
              // defaultValue={navigation.state==="loading"?"Please wait":"Ask anything..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-[60vw] h-[8vh] rounded-2xl bg-[#4c4c4c] text-white px-4 outline-none"
              placeholder={navigation.state==="submitting"?"Please wait":"Ask anything..."}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
