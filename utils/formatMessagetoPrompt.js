// utils/formatMessagesToPrompt.js
export const formatMessagesToPrompt = (messages) => {
    return messages
      .map((msg) => {
        if (msg.role === "user") return `User: ${msg.prompt}`;
        if (msg.role === "assistant") return `Assistant: ${msg.response}`;
      })
      .join("\n") + "\nAssistant:"; // Prompt Cohere to continue from the assistant's turn
  };
  