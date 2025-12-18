import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthToken } from '../common/index.model.js';



export const validateJWTToken = <T>(token: string) => {
    const jwtKey = getJWTKey();
    return jwt.verify(token, jwtKey);
};

export const getJWTToken = (payload: AuthToken) => {
    const jwtKey = getJWTKey();
    const jwtExpiryIn = process.env.JWT_EXPIRY_IN ? Number(process.env.JWT_EXPIRY_IN) : 3600;
    const token = jwt.sign(payload, jwtKey, {
        expiresIn: jwtExpiryIn,
        algorithm: 'HS512'
    });
    return token;
};

const getJWTKey = () => {
    const jwtKey = process.env.JWT_KEY
    if (!jwtKey) throw new Error('jwt key not found');
    return jwtKey;
}