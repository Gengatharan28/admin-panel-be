
import bcrypt from 'bcrypt';

const saltRound = 10;

export const hash = async (text: string) => {
    return await bcrypt.hash(text, saltRound);
};

export const compare = async (text: string, hashedText: string) => {
    return await bcrypt.compare(text, hashedText);
};