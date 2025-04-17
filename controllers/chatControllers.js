// import { v4 as uuidv4 } from "uuid"; // npm i uuid
import { CohereClient } from "cohere-ai"; // Updated import
import { BadRequestError } from "../Errors/customError.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import bcrypt, { genSalt } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
dotenv.config(); // Load environment variables
// import cookie from 'cookie'
// Initialize the Cohere client
import { formatMessagesToPrompt } from "../utils/formatMessagetoPrompt.js";
import { token } from "morgan";
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export const createChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prompt } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new BadRequestError('Invalid user ID');
  }

  // Get or create sessionId from signed cookie
  let sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const oneDay = 24 * 60 * 60 * 1000;
    res.cookie('sessionId', token, {
      maxAge: oneDay,
      signed: true,
      secure: false,
    });

    sessionId = token;
  }

  // Find or create a chat session
  let session = user.chatSessions.find((s) => s.sessionId === sessionId);

  const recentMessages = session?.messages?.length
    ? [
        session.messages[0],  // First message (if exists)
        ...session.messages.slice(-8) // Last 8 messages (if they exist)
      ]
    : [];

  function wrapUserCodeIfNeeded(text) {
    const codeBlockRegex = /```[\s\S]*?```/;
    const codePattern = /(?:def|function|class|import|#include|console\.log|print)/; // Basic code detection
    if (codeBlockRegex.test(text) || codePattern.test(text)) {
      return `\`\`\`\n${text}\n\`\`\``; // Wrap code in a code block if detected
    }
    return text;
  }

  const safePrompt = wrapUserCodeIfNeeded(prompt);

  // Prepare the context with recent messages if any
  const recentMessagesText = recentMessages.length > 0
    ? `Here are the recent messages in this session:\n${recentMessages.map((msg, index) => `**${index + 1}. ${msg.prompt}**\nResponse: ${msg.response}`).join('\n\n')}\n\n`
    : '';

    const formattedPrompt = `
    You are **Dev Mate**, a friendly and supportive AI mentor. Your goals are:
    
    1. **Generate Code**: If the user asks for code (e.g., "Write a Python script..."), generate clean and well-commented code.
    2. **Check User Well-being**: If the user seems stressed, anxious, or frustrated, include supportive messages like:
       - "You're doing great!"
       - "Don't worry, you're learning!"
       - "Take it one step at a time!"
    
    Here are the previous messages in this conversation:
    """
    ${recentMessages.map(msg => `User: ${msg.prompt}\nAssistant: ${msg.response}`).join('\n')}
    """
    
    ### User's message:
    """
    ${prompt}
    """
    `;
    
    

  // Determine if the user is asking for code generation
  const isCodeGenerationRequest = /write|generate|create|build/i.test(prompt);

  let outputText = '';

  if (isCodeGenerationRequest) {
    // If it's a request for code generation, let the AI generate code
    const codeResponse = await cohere.generate({
      model: "command-light",
      prompt: formattedPrompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    outputText = codeResponse.generations[0].text.trim();
  } else {
    // Otherwise, provide an explanation of the user's code
    const explanationResponse = await cohere.generate({
      model: "command-light",
      prompt: formattedPrompt,
      max_tokens: 300,
      temperature: 0.7,
    });

    outputText = explanationResponse.generations[0].text.trim();
  }

  // const inputTokens = codeResponse.meta.billedUnits.inputTokens;  // Fix: Reference the right response
  // const outputTokens = codeResponse.meta.billedUnits.outputTokens; // Fix: Reference the right response
  // const totalTokens = inputTokens + outputTokens;

  // If no session yet, create it with a smart title
  if (!session) {
    const titlePrompt = `Create a short, relevant, and encouraging title for a chat session based on this input: "${prompt}". If the message suggests emotional fatigue, stress, or self-doubt, reflect that in a caring way.`;

    const titleResponse = await cohere.generate({
      model: 'command-light',
      prompt: titlePrompt,
      max_tokens: 50,
      temperature: 0.7,
    });

    const title = titleResponse.generations[0].text.trim();

    session = {
      sessionId,
      title,
      messages: [],
    };

    user.chatSessions.push(session);
  }

  // Save user prompt and assistant response
  session.messages.push(
    {
      role: 'user',
      prompt,
      response: '',
      // tokensUsed: totalTokens,/
      timestamp: new Date(),
    },
    {
      role: 'assistant',
      prompt: '',
      response: outputText,
      // tokensUsed: totalTokens,
      timestamp: new Date(),
    }
  );

  user.markModified('chatSessions');
  await user.save();

  res.status(StatusCodes.OK).json({
    msg: outputText,
    // approxTokenCount: totalTokens,
    sessionId,
  });
});



export const getHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sessionId = req.signedCookies.sessionId;
  const hasSessionCookie = !!sessionId;

  // Debugging
  console.log("Signed session cookie:", sessionId);

  const user = await User.findById(id);
  if (!user) {
    throw new BadRequestError("User not found");
  }

  const allSessions = user.chatSessions || [];

  // If no sessions at all
  if (allSessions.length === 0) {
    return res.status(StatusCodes.OK).json({
      currentSession: null,
      otherSessions: [],
      sessionId: false,
    });
  }

  // Try to find the current session by sessionId
  let currentSession = null;
  let otherSessions = [];

  if (sessionId) {
    currentSession = allSessions.find(s => s.sessionId === sessionId);
    otherSessions = allSessions.filter(s => s.sessionId !== sessionId);
  }

  // If sessionId exists but session not found
  if (sessionId && !currentSession) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: "Session not found",
    });
  }

  // If sessionId does not exist, fallback to latest session
  if (!sessionId) {
    currentSession = allSessions[allSessions.length - 1];
    otherSessions = allSessions.slice(0, allSessions.length - 1);
  }

  res.set("Cache-Control", "no-store");

  return res.status(StatusCodes.OK).json({
    currentSession,
    otherSessions,
    sessionId: hasSessionCookie,
  });
});

export const deleteHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sessionId } = req.body;
  const user = await User.findById(id);
  if (!user) {
    throw new BadRequestError(
      "Invalide user id please check your id or try again later"
    );
  }
  console.log(req.body); // Debug line

  console.log("Provided sessionId:", sessionId);
  console.log(
    "Available sessionIds:",
    user.chatSessions.map((s) => s.sessionId)
  );

  const initalLength = user.chatSessions.length;
  user.chatSessions = user.chatSessions.filter(
    (i) => i.sessionId !== sessionId
  );
  if (user.chatSessions.length === initalLength) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Session ID not found." });
  }

  await user.save();

  res.status(StatusCodes.OK).json({
    msg: "Chat session deleted successfully.",
    remainingSessions: user.chatSessions,
  });
});
export const createNewChat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new BadRequestError("Invalid user ID");
  }

  // Clear old sessionId cookie if exists
  if (req.cookies.sessionId) {
    res.clearCookie("sessionId");
  }

  // Generate new sessionId
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  const oneDay = 24 * 60 * 60 * 1000;
  res.cookie("sessionId", token, {
    maxAge: oneDay,
    signed: true,
    secure: false,
  })  

  res.status(StatusCodes.OK).json({
    msg: "successfully delted previous cookie and here is your new chat",
    token,
  });
});
export const continueChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prompt } = req.body;
  
  const {sessionId} = req.query

  const user = await User.findById(id);
  if (!user) {
    throw new BadRequestError("Invalid user id...");
  }

  const session = user.chatSessions.find((i) => i.sessionId === sessionId);

  if (!session) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: "No session found with this ID...",
    });
  }

  // If session exists, continue adding to it
  let messagesForPrompt = [...session.messages];

  messagesForPrompt.push({
    role: "user",
    prompt,
    response: "",
    tokensUsed: 0,
  });

  const formattedPrompt = formatMessagesToPrompt(messagesForPrompt);

  // Send to Cohere
  const response = await cohere.generate({
    model: "command",
    prompt: formattedPrompt,
    max_tokens: 300,
    temperature: 0.7,
  });

  const outputText = response.generations[0].text.trim();
  const inputTokens = response.meta.billedUnits.inputTokens;
  const outputTokens = response.meta.billedUnits.outputTokens;
  const totalTokens = inputTokens + outputTokens;

  // No need to generate a new title if session exists
  // Only update messages
  session.messages.push(
    {
      role: "user",
      prompt,
      response: "",
      tokensUsed: totalTokens,
    },
    {
      role: "assistant",
      prompt: "",
      response: outputText,
      tokensUsed: totalTokens,
    }
  );

  await user.save();

  res.status(StatusCodes.OK).json({
    msg: outputText,
    approxTokenCount: totalTokens,
    sessionId,
  });
});
