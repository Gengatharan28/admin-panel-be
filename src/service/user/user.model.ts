import { PaginationRes, SortDirection } from "../../common/index.model.js";


export enum SortColumnKey {
    CreatedAt = "createdAt",
    Name = "name",
    Email = "email",
}

/**
 * Endpoint : /api/user/create
 */
export interface CreateUserReq {
    email: string;
    password: string;
    firstName: string;
    lastName: string | null;
}

/**
 * Endpoint : /api/user/create
 */
export interface CreateUserRes {
    isCreated: boolean;
}

/**
 * Endpoint : /api/user/get/:id
 */
export interface GetUserReq {
    id: string;
}

export interface GetDBUser {
    id: string;
    first_name: string;
    last_name: string | null;
    email: string;
    password: string;
    created_at: string;
    created_by: string;
    updated_at: Date | null;
    updated_by: string | null;
    is_online: boolean;
    userRoles: {
        role: RoleDetail;
    }[];
}

export interface RoleDetail {
    id: number;
    name: string;
}

/**
 * Endpoint : /api/user/get/:id
 */
export interface GetUserRes {
    id: string,
    firstName: string;
    lastName: string | null;
    email: string;
    roles: RoleDetail[];
    createdAt: string;
    isOnline: boolean;
}

/**
 * EndPoint : /api/user/update/:id
 */
export interface UpdateUserReq {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string;
    roleIds: number[]
}

/**
 * EndPoint : /api/user/update/:id
 */
export interface UpdateUserRes {
    isUpdated: boolean;
}

/**
 * EndPoint : /api/user/delete/:id
 */
export interface DeleteUserReq extends GetUserReq { }

/**
 * EndPoint : /api/user/delete/:id
 */
export interface DeleteUserRes {
    isDeleted: boolean;
}

/**
 * Endpoint : /api/user/get/all
 */
export interface GetUsersReq {
    count: number | null,
    page: number;
    search: string | null;
    sortColumn: SortColumnKey;
    sortDirection: SortDirection;
}

/**
 * Endpoint : /api/user/get/all
 */
export interface GetUsersRes extends PaginationRes {
    users: GetUserRes[];
}

/**
 * Endpoint : /api/user/assign/role
 */
export interface AssignUserRoleReq {
    id: string;
    roleIds: number[];
}

/**
 * Endpoint : /api/user/assign/role
 */
export interface AssignUserRoleRes {
    isAssigned: boolean;
}
