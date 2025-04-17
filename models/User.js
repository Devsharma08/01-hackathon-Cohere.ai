import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Chat',
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true,
        },
        prompt: String,
        response: String,
        tokensUsed: Number,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  chatSessions: [chatSessionSchema], // embedded chat sessions
});
export default mongoose.model('User',UserSchema)