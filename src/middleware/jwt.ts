import { NextFunction, Request, Response } from "express";
import { getJWTToken, validateJWTToken } from "../utils/jwtToken.js";
import { removeProperties } from "../utils/common.js";
import { AuthToken } from "../common/index.model.js";
import { getAPIResponse } from "./route.js";




const jwtExecutePath = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/roles',
];

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    // if (req.url.startsWith("/socket.io")) {
    //     return next();
    // }
    if (jwtExecutePath.includes(req.path))
        return next();

    await checkToken(req, res, next);
};

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    let jwtToken = req.headers['authorization'];
    if (jwtToken?.startsWith('Bearer '))
        jwtToken = jwtToken?.replace('Bearer ', '');
    if (jwtToken) {
        try {
            const payload = validateJWTToken<AuthToken>(jwtToken) as unknown as AuthToken;
            if (!payload) throw {};
            if (!payload.id) throw {};
            if (!payload.email) throw {};
            if (!payload.roleId) throw {};

            removeProperties(payload, ['iat', 'exp']);
            req.authToken = payload;
            const token = getJWTToken(payload);
            res.setHeader('authorization', token);
            next();
        } catch (err) {
            const response = getAPIResponse(false, undefined, err.message);
            return res.status(401).send(response);
        }
    } else {
        const response = getAPIResponse(false, undefined, 'Unauthorized Access. Please log in again.');
        return res.status(401).send(response);
    }
};

