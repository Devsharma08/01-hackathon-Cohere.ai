import React from 'react';
import { useLoaderData, useParams } from 'react-router';
import customFetch from '../utils/customFetch';

export const loader = async ({ params }) => {
  const { id } = params;
  const { data } = await customFetch.get(`/chat/history/${id}`);
  console.log(data);
  return data;
};

const History = () => {
  const userr = useParams();
  console.log(userr.id);
  const data = useLoaderData();
  console.log(data);

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

  return (
    <>
      {/* Previous Sessions */}
      {data?.otherSessions?.length > 0 && (
        <div className="mt-10 space-y-8">
          <h2 className="text-white text-2xl font-semibold mb-4">Previous Conversations</h2>
          {data.otherSessions.map((session, sessionIndex) => (
            <div key={session.sessionId} className="bg-[#2e2e2e] rounded-xl p-4 shadow">
              {session?.messages !== session?.messages == []  ? session.messages.map((msg, idx) => {
                if (msg.role === "user") {
                  const assistantMsg = session.messages[idx + 1];

                  return (
                    <div key={msg._id || idx} className="mb-6">
                      {/* Render only if user message is not empty */}
                      {msg.prompt && msg.prompt.trim().length > 0 && (
                        <div className="text-sm flex justify-end bg-[#1f1f1f] rounded-2xl px-4 py-3 text-white mb-2">
                          {msg.prompt}
                        </div>
                      )}

                      {/* Render assistant response only if it's not empty */}
                      {assistantMsg?.role === "assistant" && assistantMsg.response?.trim().length > 0 && (
                        <div className="text-sm bg-[#1f1f1f] rounded-2xl px-4 py-4 text-blue-300">
                          <span className="font-bold">Assistant:</span>{" "}
                          <div className="mt-1">{renderResponseWithCode(assistantMsg.response)}</div>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }) : null}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default History;
