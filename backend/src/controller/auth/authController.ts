import { Request, RequestHandler } from "express";
import User from "../../model/userSchema";
import { sendResponse } from "../../utils/sendResponse";
import crypto from "crypto";
import { compareHashPassword, hashPassword } from "../../utils/passwordHelper";
import { generateJwtToken } from "../../utils/generateJwtToken";

interface RegisterReq extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const signUpUser: RequestHandler = async (req: RegisterReq, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, false, "User already exists");
    }

    const hashedPassword = await hashPassword(password);
    await User.create({
      email,
      password: hashedPassword,
      token: crypto.randomBytes(16).toString("hex"),
    });
    return sendResponse(res, 200, true, "User created successfully");
  } catch (error) {
    console.error(`Error message ${error}`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

export const signInUser: RequestHandler = async (req: RegisterReq, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, "Account does not register");
    }

    const matchPassword = await compareHashPassword(password, user.password);
    if (!matchPassword) {
      return sendResponse(res, 400, false, "Password does not match");
    }
    const jwtToken = await generateJwtToken(user);
    return sendResponse(res, 200, true, "Successfully logged in", { user: jwtToken });
  } catch (error) {
    console.error(`Error in authentication`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};
