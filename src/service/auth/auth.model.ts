import { RoleDetail } from "../user/user.model.js";


/**
 * Endpoint : /api/auth/register
 */
export interface RegisterReq {
    email: string;
    firstName: string;
    lastName: string | null;
    password: string;
    roleId: number
}

/**
 * Endpoint : /api/auth/register
 */
export interface RegisterRes {
    isRegistered: boolean;
}

/**
 * Endpoint : /api/auth/login
 */
export interface LoginReq {
    email: string;
    password: string;
}

/**
 * Endpoint : /api/auth/login
 */
export interface LoginRes {
    isLoggedIn: boolean;
    roleId: number;
    userId: string;
    authorization: string;
}

/**
 * Endpoint : /api/auth/get/:id
 */
export interface GetAuthReq {
    id: string;
}

/**
 * Endpoint : /api/auth/get/:id
 */
export interface GetAuthRes {
    id: string,
    firstName: string;
    lastName: string | null;
    email: string;
    roles?: RoleDetail[];
    createdAt: string;
}