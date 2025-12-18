import * as yup from "yup";
import { AuthToken, SortDirection } from "../../common/index.model.js";
import * as Model from "./role.model.js";
import * as Repo from "../../repository/index.js";
import { checkPermission } from "../../utils/permission.js";
import { RoleModel } from "../../entities/Role.js";
import { Response } from "express";
import { getPaginationRes } from "../../utils/common.js";
import moment from "moment";


export class RoleController {
    constructor(
        private authToken: AuthToken,
        private res: Response
    ) { }

    public addRole = async (req: Model.AddRoleReq): Promise<Model.AddRoleRes> => {
        checkPermission(this.authToken.roleId, "C", "role", this.res);
        await this.validateAddRoleReq(req);
        const userExists = await Repo.getRoleByName(req.name);
        if (userExists) throw Error('Role already exists');

        const user = this.getRoleInstance(req);
        await Repo.addRole(user);
        return { isAdded: true };

    };

    private getRoleInstance = (req: Model.AddRoleReq): RoleModel => {
        const role: RoleModel = {
            name: req.name,
            is_active: req.isActive,
            created_by: this.authToken.id,
        } as RoleModel;
        return role;
    };

    private validateAddRoleReq = async (req: Model.AddRoleReq): Promise<void> => {
        const schema: yup.Schema<Model.AddRoleReq> = yup.object().shape({
            name: yup.string()
                .required(),
            isActive: yup.boolean()
                .required(),
        });
        await schema.validate(req);
    };

    public updateRole = async (req: Model.UpdateRoleReq): Promise<Model.UpdateRoleRes> => {
        checkPermission(this.authToken.roleId, "U", "role", this.res);
        await this.validateUpdateRoleReq(req);
        const userExists = await Repo.getRoleById(req.id);
        if (!userExists) throw Error('User not found');
        const user = this.getUpdateUserInstance(req);
        await Repo.updateRoleById(user);
        return { isUpdated: true };
    };

    private getUpdateUserInstance = (req: Model.UpdateRoleReq): RoleModel => {
        const user: RoleModel = {
            id: req.id,
            name: req.name,
            is_active: req.isActive,
            updated_by: this.authToken.id,
            updated_at: new Date(),
        } as RoleModel;
        return user;
    };

    private validateUpdateRoleReq = async (req: Model.UpdateRoleReq): Promise<void> => {
        const schema: yup.Schema<Model.UpdateRoleReq> = yup.object().shape({
            id: yup.number()
                .required(),
            name: yup.string()
                .required(),
            isActive: yup.boolean()
                .required(),
        });
        await schema.validate(req);
    };

    public deleteRole = async (req: Model.DeleteRoleReq): Promise<Model.DeleteRoleRes> => {
        checkPermission(this.authToken.roleId, "D", "role", this.res);
        await this.validateGetRoleReq(req);
        const isDeleted = await Repo.deleteRoleById(req.id);
        if (!isDeleted) throw Error('User not found');

        return { isDeleted: true };
    };

    private validateGetRoleReq = async (req: Model.DeleteRoleReq): Promise<void> => {
        const schema: yup.Schema<Model.DeleteRoleReq> = yup.object().shape({
            id: yup.number()
                .required(),
        });
        await schema.validate(req);
    };

    public getAllRole = async (req: Model.GetAllRoleReq): Promise<Model.GetAllRoleRes> => {
        checkPermission(this.authToken.roleId, "R", "role", this.res);
        await this.validateGetRolesReq(req);
        const { rows, count } = await Repo.getRoleLists(req);
        const roles = this.getUsersInstance(rows);
        const pagination = getPaginationRes(req.count, count);
        return { roles, ...pagination };
    };

    private getUsersInstance = (lists: RoleModel[]): Model.GetRole[] => {
        return lists.map(list => {
            const res: Model.GetRole = {
                id: list.id,
                name: list.name,
                isActive: list.is_active,
                createdAt: moment(list.created_at).format("YYYY-MM-DD HH:mm A"),
                isRoot: list.is_root
            }
            return res;
        });
    };

    private validateGetRolesReq = async (req: Model.GetAllRoleReq): Promise<void> => {
        const schema: yup.Schema<Model.GetAllRoleReq> = yup.object().shape({
            page: yup.number()
                .required()
                .positive()
                .integer(),
            count: yup.number()
                .notRequired()
                .positive()
                .integer()
                .nullable()
                .defined(),
            search: yup.string()
                .notRequired()
                .nullable()
                .defined(),
            sortColumn: yup.string()
                .required()
                .oneOf([
                    Model.RoleSortColumnKey.CreatedAt,
                    Model.RoleSortColumnKey.IsActive,
                    Model.RoleSortColumnKey.Name
                ]),
            sortDirection: yup.string()
                .required()
                .oneOf([
                    SortDirection.Asc,
                    SortDirection.Desc
                ]),
        });
        await schema.validate(req);
    };

    public getRoles = async (): Promise<Model.GetRolesRes> => {
        const roleLists = await Repo.getRoles();
        const roles = this.getUsersInstance(roleLists);
        return { roles };
    };
}