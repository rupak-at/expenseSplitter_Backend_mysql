import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ExtendedReq } from "../utils/types";

export const verifyLogin: RequestHandler = async (req, res, next) => {
  try {
    if (!req.headers.cookie) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const token =
      (req.headers.cookie as string).split("=")[1] ||
      req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    (req as unknown as ExtendedReq).userId = payload.id;
    (req as unknown as ExtendedReq).email = payload.email;

    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Failure" });
  }
};
