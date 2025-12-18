import type { Route } from "../middleware/route.js";
import { AuthRoutes } from "./auth/auth.route.js";
import { RoleRoutes } from "./role/role.route.js";
import { UserRoutes } from "./user/user.route.js";


export const routes: Route[] = [
    ...AuthRoutes,
    ...UserRoutes,
    ...RoleRoutes,
];