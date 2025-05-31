import jwt from "jsonwebtoken";

export const generateJwtToken = (id: number, email: string) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRY;

  if (!secret || !expiresIn) {
    throw new Error("JWT env missing")
  }
  return jwt.sign({ id, email }, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
