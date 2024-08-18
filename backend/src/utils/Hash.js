import bcrypt, { genSalt } from "bcrypt"


export const hashPassword = async (password) => {
    const salt = (await genSalt(10)).toString();
    const hashedPassword = await bcrypt.hash(password, salt);
    return {
        salt,
        hashedPassword
    }
}

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}