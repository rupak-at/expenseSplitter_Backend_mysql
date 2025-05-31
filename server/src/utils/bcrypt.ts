import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

export async function comparePassword(password: string, hashPassword: string) {
    const result = await bcrypt.compare(password, hashPassword);
    console.log(result);
    return result;
}
