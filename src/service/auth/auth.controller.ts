import * as yup from "yup";
import { AuthToken } from "../../common/index.model.js";
import { GetAuthReq, GetAuthRes, LoginReq, LoginRes, RegisterReq, RegisterRes } from "./auth.model.js";
import { createUser, getUserByEmail, getUserById } from "../../repository/user.js";
import { UserModel } from "../../entities/User.js";
import { AdminModel } from "../../entities/Admin.js";
import { createAdmin, getAdminByEmail, getAdminById } from "../../repository/admin.js";
import { compare, hash } from "../../common/bcrypt.js";
import { generateUUID } from "../../utils/uuid.js";
import { getJWTToken } from "../../utils/jwtToken.js";
import { checkPermission } from "../../utils/permission.js";
import { Response } from "express";
import { GetDBUser } from "../user/user.model.js";


export class AuthController {

    constructor(
        private authToken?: AuthToken,
        private res?: Response
    ) { }

    public register = async (req: RegisterReq): Promise<RegisterRes> => {
        await this.validateRegisterReq(req);
        let userExists: UserModel | AdminModel | null = null;
        if (req.roleId === 1) {
            userExists = await getAdminByEmail(req.email);
        } else {
            userExists = await getUserByEmail(req.email);
        }
        if (userExists) throw Error('User already exists');

        req.password = await hash(req.password);
        const user = this.getRegUserInstance(req);
        if (req.roleId === 1) await createAdmin(user);
        else await createUser(user);
        return { isRegistered: true };

    };

    private getRegUserInstance = (req: RegisterReq): UserModel => {
        const id = generateUUID();
        const user: UserModel = {
            id,
            first_name: req.firstName,
            last_name: req.lastName,
            email: req.email,
            password: req.password,
            created_by: id
        } as UserModel
        return user;
    };

    private validateRegisterReq = async (req: RegisterReq): Promise<void> => {
        const schema: yup.Schema<RegisterReq> = yup.object().shape({
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
            roleId: yup.number()
                .positive()
                .integer()
                .required()
        });
        await schema.validate(req);
    };

    public login = async (req: LoginReq): Promise<LoginRes> => {
        await this.validateLoginReq(req);
        let user: UserModel | AdminModel | null = await getUserByEmail(req.email);
        let roleId = 2;
        if (!user) {
            user = await getAdminByEmail(req.email);
            roleId = 1;
        };
        if (!user) throw Error('User not found');
        await this.checkPasswordIsValid(user.password, req.password);

        const payload = this.getTokenPayload(user as UserModel, roleId);
        const token = getJWTToken(payload);
        const response = {
            isLoggedIn: true,
            roleId,
            userId: user.id,
            authorization: token
        };
        return response;
    };

    private getTokenPayload = (user: UserModel, roleId: number): AuthToken => {
        const payload: AuthToken = {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            roleId,
        };
        return payload;
    };

    private checkPasswordIsValid = async (hashPassword: string, reqPassword: string): Promise<void> => {
        const isMatch = await compare(reqPassword, hashPassword);
        if (!isMatch) throw Error('Incorrect password. Please try again.');
    };

    private validateLoginReq = async (req: LoginReq): Promise<void> => {
        const schema: yup.Schema<LoginReq> = yup.object().shape({
            email: yup.string()
                .required(),
            password: yup.string()
                .required()
        });
        await schema.validate(req);
    };

    public getAuth = async (req: GetAuthReq): Promise<GetAuthRes> => {
        if (this.authToken && this.res) {
            checkPermission(this.authToken.roleId, "R", "user", this.res);
        }
        await this.validateGetUserReq(req);
        let userExists = await getUserById(req.id);
        if (!userExists) userExists = await getAdminById(req.id) as GetDBUser | null;
        if (!userExists) throw Error('User not found');
        const user = this.getUserInstance(userExists);
        return user;
    };

    private getUserInstance = (user: GetDBUser): GetAuthRes => {
        const res: GetAuthRes = {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            roles: user?.userRoles?.map(userRole => userRole.role),
            createdAt: user.created_at,
        };
        return res;
    }

    private validateGetUserReq = async (req: GetAuthReq): Promise<void> => {
        const schema: yup.Schema<GetAuthReq> = yup.object().shape({
            id: yup.string()
                .required(),
        });
        await schema.validate(req);
    };
}