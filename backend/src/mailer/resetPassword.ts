import { transporter } from "../config/nodemailer";
import User, { IUser } from "../model/userSchema";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const resetPassowordEmail = async (user: IUser) => {
  try {
    const emailHtml = await ejs.renderFile(path.join(__dirname, "../view/resetPassword.ejs"), { token: user.token });
    const options = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset your password",
      html: emailHtml,
    };
    await transporter.sendMail(options);
  } catch (error) {
    console.error(`Error in sending the email reset password ${error}`);
  }
};
