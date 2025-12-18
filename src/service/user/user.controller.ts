import * as yup from "yup";
import { AuthToken, SortDirection } from "../../common/index.model.js";
import * as Model from "./user.model.js";
import * as Repo from "../../repository/index.js";
import { UserModel } from "../../entities/User.js";
import { generateUUID } from "../../utils/uuid.js";
import { checkPermission } from "../../utils/permission.js";
import { getPaginationRes } from "../../utils/common.js";
import { UserRoleModel } from "../../entities/UserRole.js";
import { Response } from "express";
import { hash } from "../../common/bcrypt.js";
import moment from "moment";
import { socket } from "../../utils/socket.js";


export class UserController {
    constructor(
        private authToken: AuthToken,
        private res: Response
    ) { }

    public createUser = async (req: Model.CreateUserReq): Promise<Model.CreateUserRes> => {
        checkPermission(this.authToken.roleId, "C", "user", this.res);
        await this.validateCreateUserReq(req);
        const userExists = await Repo.getUserByEmail(req.email);
        if (userExists) throw Error('User already exists');

        req.password = await hash(req.password);
        const newUser = this.getCreateUserInstance(req);
        await Repo.createUser(newUser);
        const user = await Repo.getUserById(newUser.id) as unknown as Model.GetDBUser;

        socket().to("admins").emit("user-created", this.getUserInstance(user));
        return { isCreated: true };

    };

    private getCreateUserInstance = (req: Model.CreateUserReq): UserModel => {
        const user: UserModel = {
            id: generateUUID(),
            first_name: req.firstName,
            last_name: req.lastName,
            email: req.email,
            password: req.password,
            created_by: this.authToken.id,
        } as UserModel;
        return user;
    };

    private validateCreateUserReq = async (req: Model.CreateUserReq): Promise<void> => {
        const schema: yup.Schema<Model.CreateUserReq> = yup.object().shape({
            email: yup.string()
                .required(),
            firstName: yup.string()
                .required(),
            lastName: yup.string()
                .notRequired()
                .nullable()
                .defined(),
            password: yup.string()
                .required(),
        });
        await schema.validate(req);
    };

    public getUser = async (req: Model.GetUserReq): Promise<Model.GetUserRes> => {
        checkPermission(this.authToken.roleId, "R", "user", this.res);
        await this.validateGetUserReq(req);
        let userExists = await Repo.getUserById(req.id);
        if (!userExists) throw Error('User not found');
        const user = this.getUserInstance(userExists);
        return user;
    };

    private getUserInstance = (user: Model.GetDBUser): Model.GetUserRes => {
        const res: Model.GetUserRes = {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            roles: user?.userRoles?.map(userRole => userRole.role),
            createdAt: moment(user.created_at).format('YYYY-MM-DD HH:mm A'),
            isOnline: user.is_online,
        };
        return res;
    }

    private validateGetUserReq = async (req: Model.GetUserReq): Promise<void> => {
        const schema: yup.Schema<Model.GetUserReq> = yup.object().shape({
            id: yup.string()
                .required(),
        });
        await schema.validate(req);
    };

    public updateUser = async (req: Model.UpdateUserReq): Promise<Model.UpdateUserRes> => {
        checkPermission(this.authToken.roleId, "U", "user", this.res);
        await this.validateUpdateUserReq(req);
        const userExists = await Repo.getUserById(req.id);
        if (!userExists) throw Error('User not found');
        const user = this.getUpdateUserInstance(req);
        const userRoles = this.getAssignUserRoleInstance(req);
        await Repo.updateUserWithUserRolesById(user, userRoles);
        const userDetail = await Repo.getUserById(userExists.id) as unknown as Model.GetDBUser;

        socket().to("admins").emit("user-updated", this.getUserInstance(userDetail));
        return { isUpdated: true };
    };

    private getAssignUserRoleInstance = (req: Model.AssignUserRoleReq): UserRoleModel[] => {
        return req.roleIds.map(roleId => {
            const userRole: UserRoleModel = {
                user_id: req.id,
                role_id: roleId,
                created_by: this.authToken.id
            } as UserRoleModel;

            return userRole;
        });
    };

    private getUpdateUserInstance = (req: Model.UpdateUserReq): UserModel => {
        const user: UserModel = {
            id: req.id,
            first_name: req.firstName,
            last_name: req.lastName,
            email: req.email,
        } as UserModel;
        return user;
    };

    private validateUpdateUserReq = async (req: Model.UpdateUserReq): Promise<void> => {
        const schema: yup.Schema<Model.UpdateUserReq> = yup.object().shape({
            id: yup.string()
                .required(),
            email: yup.string()
                .required(),
            firstName: yup.string()
                .required(),
            lastName: yup.string()
                .notRequired()
                .nullable()
                .defined(),
            roleIds: yup.array()
                .of(yup.number()
                    .positive()
                    .integer()
                    .required())
                .required(),
        });
        await schema.validate(req);
    };

    public deleteUser = async (req: Model.DeleteUserReq): Promise<Model.DeleteUserRes> => {
        checkPermission(this.authToken.roleId, "D", "user", this.res);
        await this.validateGetUserReq(req);
        const isDeleted = await Repo.deleteUserWithUserRoleById(req.id);
        if (!isDeleted) throw Error('User not found');

        return { isDeleted: true };
    };

    public getUsers = async (req: Model.GetUsersReq): Promise<Model.GetUsersRes> => {
        checkPermission(this.authToken.roleId, "R", "user", this.res);
        await this.validateGetUsersReq(req);
        const userId = this.authToken.roleId === 2 ? this.authToken.id : undefined;
        const { count, rows } = await Repo.getUserLists(req,userId);
        const paginationRes = getPaginationRes(req.count, count);
        const users = this.getUsersInstance(rows);
        return { users, ...paginationRes };
    };

    private getUsersInstance = (lists: Model.GetDBUser[]): Model.GetUserRes[] => {
        return lists.map(list => {
            const res = {
                id: list.id,
                firstName: list.first_name,
                lastName: list.last_name,
                email: list.email,
                createdAt: moment(list.created_at).format('YYYY-MM-DD HH:mm A'),
                roles: list.userRoles.map(userRole => userRole.role),
                isOnline: list.is_online,
            }
            return res;
        });
    };

    private validateGetUsersReq = async (req: Model.GetUsersReq): Promise<void> => {
        const schema: yup.Schema<Model.GetUsersReq> = yup.object().shape({
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
                    Model.SortColumnKey.CreatedAt,
                    Model.SortColumnKey.Email,
                    Model.SortColumnKey.Name
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
}