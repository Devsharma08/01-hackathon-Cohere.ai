import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { hashPassword, verifyPassword } from "../utils/password.js";
import asyncHandler from "express-async-handler";
import { BadRequestError, NotFoundError } from "../Errors/customError.js";
import { createToken } from "../utils/token.js";
export const register = asyncHandler(async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists (recommended)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(StatusCodes.CREATED).json({
      msg: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Registration failed" });
  }
});
export const Login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("Invalid email");
    }
    const checkPassword = verifyPassword(password, user.password);
    if (!checkPassword) {
      throw new BadRequestError("Invalid password");
    }
    const token = createToken({ userId: user._id, name: user.name });
    const SevenDay = 7 * 24 * 60 * 60 * 1000;
    res.cookie("login", token, {
      maxAge: SevenDay,
      signed: true,
      secure: true,
      httpOnly: true,
    });

    res
      .status(StatusCodes.OK)
      .json({
        msg: "User successfully logged in....",
        token,
        userr: user._id,
        session: req.signedCookies.sessionId,
      });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "logging in failed" });
  }
});
export const logout = asyncHandler(async (req, res) => {
  res.cookie("login", "logout", {
    httpOnly: true,
    expires: new Date(0), // Set expiration date to the past
    signed: true, // Optional: depending on whether you signed the cookie
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out" });
});
