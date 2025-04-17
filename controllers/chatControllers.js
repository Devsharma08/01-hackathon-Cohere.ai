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

  // Get sessionId from signed cookie or generate new one
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

  // Find or create session
  let session = user.chatSessions.find((s) => s.sessionId === sessionId);

  // Generate assistant response from ONLY current user prompt

  const recentMessages = session?.messages?.length
  ? session.messages.slice(-8)
  : []; // fallback to empty array if no session or messages yet

const formattedPrompt = formatMessagesToPrompt(recentMessages) + `\nUser: ${prompt}`;

  const response = await cohere.generate({
    model: "command-light",
    prompt: formattedPrompt,
    max_tokens: 300,
    temperature: 0.7,
  });
  const outputText = response.generations[0].text.trim();
  const inputTokens = response.meta.billedUnits.inputTokens;
  const outputTokens = response.meta.billedUnits.outputTokens;
  const totalTokens = inputTokens + outputTokens;

  // If no session exists yet, create one
  if (!session) {
    const titleResponse = await cohere.generate({
      model: 'command-light',
      prompt: `Generate a short, relevant title for a chat about: "${prompt}"`,
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

  // Add current user and assistant messages to session
  session.messages.push(
    {
      role: 'user',
      prompt,
      response: '',
      tokensUsed: totalTokens,
      timestamp: new Date(),
    },
    {
      role: 'assistant',
      prompt: '',
      response: outputText,
      tokensUsed: totalTokens,
      timestamp: new Date(),
    }
  );

  // Ensure mongoose detects changes
  user.markModified('chatSessions');
  await user.save();

  res.status(StatusCodes.OK).json({
    msg: outputText,
    approxTokenCount: totalTokens,
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
