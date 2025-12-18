


declare module 'express' {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Request {
        authToken: AuthToken;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Response {
        isSent: boolean;
    }
}

export interface AuthToken {
    id: string;
    firstName: string;
    roleId: number;
    email: string;
    lastName: string | null;
    iat?: string;
    exp?: string;
}

export enum SortDirection {
    Asc = "ASC",
    Desc = "DESC",
}

export interface PaginationRes {
    totalCount: number;
    totalPage: number;
}

export interface ISort {
    column: string;
    direction: string;
}