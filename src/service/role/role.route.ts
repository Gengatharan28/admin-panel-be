import { SortDirection } from "../../common/index.model.js";
import { type Route, APIMethod } from "../../middleware/route.js";
import { RoleController } from "./role.controller.js";
import * as Model from "./role.model.js";


export const RoleRoutes: Route[] = [
    {
        path: '/api/role/add',
        method: APIMethod.Post,
        handler: (req, res): Promise<Model.AddRoleRes> => {
            const controller = new RoleController(req.authToken, res);
            return controller.addRole(req.body);
        }
    },
    {
        path: '/api/role/update/:id',
        method: APIMethod.Put,
        handler: (req, res): Promise<Model.UpdateRoleRes> => {
            const controller = new RoleController(req.authToken, res);
            return controller.updateRole({
                ...req.body,
                id: req.params.id
            });
        },
    },
    {
        path: '/api/role/delete/:id',
        method: APIMethod.Delete,
        handler: (req, res): Promise<Model.DeleteRoleRes> => {
            const controller = new RoleController(req.authToken, res);
            return controller.deleteRole({ id: Number(req.params.id) });
        },
    }, {
        path: '/api/role/get/all',
        method: APIMethod.Get,
        handler: (req, res): Promise<Model.GetAllRoleRes> => {
            const controller = new RoleController(req.authToken, res);
            return controller.getAllRole({
                count: req.query.count != 'null' ? Number(req.query.count) ?? null : null,
                page: Number(req.query.page) ?? 1,
                search: req.query.search !== 'null' ? String(req.query.search) : null,
                sortColumn: req.query.sortColumn ? String(req.query.sortColumn) as Model.RoleSortColumnKey : Model.RoleSortColumnKey.CreatedAt,
                sortDirection: req.query.sortDirection ? String(req.query.sortDirection) as SortDirection : SortDirection.Desc,
            });
        },
    },
    {
        path: '/api/roles',
        method: APIMethod.Get,
        handler: (req, res): Promise<Model.GetRolesRes> => {
            const controller = new RoleController(req.authToken, res);
            return controller.getRoles();
        },
    }
]