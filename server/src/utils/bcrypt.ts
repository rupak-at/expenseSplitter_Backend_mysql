import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

export async function comparePassword(password: string, hashPassword: string) {
  try {
    const result = await bcrypt.compare(password, hashPassword);
    return result;
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error;
  }
}
