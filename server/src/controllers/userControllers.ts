import { RequestHandler } from "express";
import db from "../dbConnection/db";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { generateJwtToken } from "../utils/jwt";

const registerUser: RequestHandler = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;

    if (!fullName || !userName || !email || !password) {
      res
        .status(400)
        .json({
          sucess: false,
          message: "Please provide all the required fields",
        });
      return;
    }

    const [existingUser] = (await db.query(
      `SELECT email FROM users WHERE email=?`,
      [email]
    )) as any[];

    if (existingUser.length > 0) {
      res.status(409).json({ status: false, message: "User alreday exists." });
      return;
    }

    const hashedPassword = await hashPassword(password);

    await db.query(
      `insert into users (full_name, user_name, email, password) values(?,?,?,?)`,
      [fullName, userName, email, hashedPassword]
    );

    res.status(201).json({ sucess: true, message: "Register Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ sucess: false, message: "Internal Server Failure" });
    return;
  }
};

const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
      return;
    }

    const [user] = (await db.query(`select * from users where email=(?)`, [
      email,
    ])) as any[];

    if (user.length === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const isValidMessage = await comparePassword(password, user[0]?.password);

    if (!isValidMessage) {
      res.status(401).json({ success: false, message: "Invalid Password" });
      return;
    }

    const token = generateJwtToken(user[0]?.id, user[0]?.email);

    const { password: _, ...otherData } = user[0];

    res.cookie("token", token, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    });

    res
      .status(200)
      .json({ success: true, message: "Login Successfully", data: otherData });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ sucess: false, message: "Internal Server Failure" });
    return;
  }
};

export { registerUser, loginUser };
