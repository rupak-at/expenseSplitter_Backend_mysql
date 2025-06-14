import { NextFunction, Request } from "express";

export interface User {
  id: number;
  full_name: string;
  user_name: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface ExtendedReq extends Request {
  userId: number;
  email: string;
}
