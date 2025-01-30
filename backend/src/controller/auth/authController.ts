import { Request, RequestHandler } from "express";
import User from "../../model/userSchema";
import { sendResponse } from "../../utils/sendResponse";
import crypto from "crypto";
import { compareHashPassword, hashPassword } from "../../utils/passwordHelper";
import { generateJwtToken } from "../../utils/generateJwtToken";
import { resetPassowordEmail } from "../../mailer/resetPassword";

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
    return sendResponse(res, 200, true, "Successfully logged in", { user: { token: jwtToken } });
  } catch (error) {
    console.error(`Error in authentication`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

export const sendEmailForResetPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(res, 404, false, "Email not found");
    }
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 404, false, "Email not found");
    }

    await resetPassowordEmail(user);
    sendResponse(res, 200, true, "Check your inbox email to reset your password");
  } catch (error) {
    console.error(`Error in authentication`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

export const updatePassword: RequestHandler = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token) {
      return sendResponse(res, 404, false, "Token not found");
    }
    const user = await User.findOne({ token });
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.token = crypto.randomBytes(16).toString("hex");
    await user.save();
    return sendResponse(res, 200, true, "Password updated successfully");
  } catch (error) {
    console.error(`Error in authentication`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};
