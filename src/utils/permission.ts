import { Response } from "express";
import { getAPIResponse } from "../middleware/route.js";

const permissions = [
    { mode: "C", accessRole: 1, module: "role" },
    { mode: "U", accessRole: 1, module: "role" },
    { mode: "R", accessRole: 1, module: "role" },
    { mode: "D", accessRole: 1, module: "role" },
    { mode: "C", accessRole: 1, module: "user" },
    { mode: "C", accessRole: 2, module: "user" },
    { mode: "U", accessRole: 1, module: "user" },
    { mode: "R", accessRole: 1, module: "user" },
    { mode: "R", accessRole: 2, module: "user" },
    { mode: "D", accessRole: 1, module: "user" },
];

export const checkPermission = (roleId: number, mode: string, module: string, res: Response) => {
    const isPermissionHave = permissions.some((per) => per.mode == mode && per.accessRole === roleId && per.module === module);

    if (!isPermissionHave) {
        res.isSent = false;
        return res.status(403).send('Unauthorized Access');
    }
    return isPermissionHave;
};
