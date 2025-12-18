import { PaginationRes, SortDirection } from "../../common/index.model.js";


export enum RoleSortColumnKey {
    Name = "name",
    IsActive = "isActive",
    CreatedAt = "createdAt",
}

/**
 * Endpoint : /api/role/add
 */
export interface AddRoleReq {
    name: string;
    isActive: boolean;
}

/**
 * Endpoint : /api/role/add
 */
export interface AddRoleRes {
    isAdded: boolean;
}

/**
 * EndPoint : /api/role/update/:id
 */
export interface UpdateRoleReq {
    id: number;
    name: string;
    isActive: boolean;
}

/**
 * EndPoint : /api/role/update/:id
 */
export interface UpdateRoleRes {
    isUpdated: boolean;
}

/**
 * EndPoint : /api/role/delete/:id
 */
export interface DeleteRoleReq {
    id: number;
}

/**
 * EndPoint : /api/role/delete/:id
 */
export interface DeleteRoleRes {
    isDeleted: boolean;
}

export interface GetRole {
    id: number,
    name: string,
    isActive: boolean,
    createdAt: string,
    isRoot: boolean;
}

/**
 * Endpoint : /api/role/get/all
 */
export interface GetAllRoleReq {
    count: number | null,
    page: number;
    search: string | null;
    sortColumn: RoleSortColumnKey;
    sortDirection: SortDirection;
}

/**
 * Endpoint : /api/role/get/all
 */
export interface GetAllRoleRes extends PaginationRes {
    roles: GetRole[];
}

/**
 * Endpoint : /api/roles
 */
export interface GetRolesRes {
    roles: GetRole[];
}