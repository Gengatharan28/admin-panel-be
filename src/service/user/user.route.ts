import { SortDirection } from "../../common/index.model.js";
import { type Route, APIMethod } from "../../middleware/route.js";
import { UserController } from "./user.controller.js";
import * as Model from "./user.model.js";


export const UserRoutes: Route[] = [
    {
        path: '/api/user/create',
        method: APIMethod.Post,
        handler: (req, res): Promise<Model.CreateUserRes> => {
            const controller = new UserController(req.authToken, res);
            return controller.createUser(req.body);
        }
    },
    {
        path: '/api/user/update/:id',
        method: APIMethod.Put,
        handler: (req, res): Promise<Model.UpdateUserRes> => {
            const controller = new UserController(req.authToken, res);
            return controller.updateUser({
                ...req.body,
                id: req.params.id
            });
        },
    },
    {
        path: '/api/user/delete/:id',
        method: APIMethod.Delete,
        handler: (req, res): Promise<Model.DeleteUserRes> => {
            const controller = new UserController(req.authToken, res);
            return controller.deleteUser({ id: req.params.id });
        },
    }, {
        path: '/api/user/get/all',
        method: APIMethod.Get,
        handler: (req, res): Promise<Model.GetUsersRes> => {
            const controller = new UserController(req.authToken, res);
            return controller.getUsers({
                count: req.query.count !== 'null' ? Number(req.query.count) : null,
                page: Number(req.query.page) ?? 1,
                search: req.query.search !== 'null' ? String(req.query.search) : null,
                sortColumn: req.query.sortColumn ? String(req.query.sortColumn) as Model.SortColumnKey : Model.SortColumnKey.CreatedAt,
                sortDirection: req.query.sortDirection ? String(req.query.sortDirection) as SortDirection : SortDirection.Desc,
            });
        },
    },
    {
        path: '/api/user/get/:id',
        method: APIMethod.Get,
        handler: (req, res): Promise<Model.GetUserRes> => {
            const controller = new UserController(req.authToken, res);
            return controller.getUser({ id: req.params.id });
        },
    }
]