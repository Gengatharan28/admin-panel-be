import { col, fn, literal, Op, Order, where, WhereOptions } from 'sequelize';
import User, { UserModel } from '../entities/User.js';
import UserRole, { UserRoleModel } from '../entities/UserRole.js';
import Role from '../entities/Role.js';
import { GetDBUser, GetUsersReq, SortColumnKey } from '../service/user/user.model.js';
import { getPagination } from '../utils/common.js';
import { ISort } from '../common/index.model.js';
import { sequelize } from '../database.js';



export const getUserByEmail = async (email: string): Promise<UserModel | null> => {
    return await User.findOne({ where: { email } }) as unknown as UserModel;
};

export const createUser = async (user: UserModel) => {
    return await User.create({ ...user });
};

export const getUserById = async (id: string): Promise<GetDBUser | null> => {
    return await User.findOne({
        where: { id },
        include: [{
            model: UserRole, as: 'userRoles', include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
            attributes: ['user_id', 'role_id']
        }]
    }) as unknown as GetDBUser;
};

export const updateUserWithUserRolesById = async (user: UserModel, userRoles: UserRoleModel[]): Promise<boolean> => {
    const transaction = await sequelize.transaction();
    try {

        await User.update(user, { where: { id: user.id }, transaction });
        await UserRole.destroy({ where: { user_id: user.id }, transaction });
        await UserRole.bulkCreate(userRoles as any, { transaction });

        await transaction.commit();
        return true;

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

export const deleteUserWithUserRoleById = async (id: string): Promise<boolean> => {
    const transaction = await sequelize.transaction();
    try {
        await UserRole.destroy({ where: { user_id: id }, transaction });
        await User.destroy({ where: { id }, transaction });

        await transaction.commit();
        return true;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

export const getUserLists = async (req: GetUsersReq, id: string | undefined): Promise<{
    rows: GetDBUser[];
    count: number;
}> => {
    const where = getWhere(req, id);
    const { limit, offset } = getPagination(req.count, req.page);
    const order = getOrder({ column: req.sortColumn, direction: req.sortDirection });

    return User.findAndCountAll({
        distinct: true,
        where,
        ...(limit && { limit }),
        ...(offset && { offset }),
        order,
        attributes: ["id", "first_name", "last_name", "email", "created_at", "is_online"],
        include: [{
            model: UserRole,
            as: 'userRoles',
            attributes: ['user_id', 'role_id'],
            include: [{
                model: Role,
                as: "role",
                attributes: ["id", "name"]
            }],
        }]

    }) as unknown as { rows: GetDBUser[]; count: number; };
};

const getOrder = (sort: ISort): Order => {

    switch (sort.column) {
        case SortColumnKey.CreatedAt:
            return [['created_at', sort.direction]];
        case SortColumnKey.Name:
            return [['email', sort.direction]];
        default:
            return [[literal("concat(first_name, ' ', last_name)"), sort.direction]];
    }

};

const getWhere = (req: GetUsersReq, id: string | undefined): WhereOptions => {
    let whereCondition: WhereOptions = {};

    if (id) {
        whereCondition.id = { [Op.ne]: id };
    }
    if (req.search) {
        const searchValue = `%${req.search}%`;
        whereCondition = {
            ...whereCondition,
            [Op.or]: [
                { email: { [Op.iLike]: searchValue } },
                where(
                    fn(
                        "concat",
                        col("first_name"),
                        " ",
                        col("last_name")
                    ),
                    {
                        [Op.iLike]: searchValue
                    }
                ),
            ],
        };
    }


    return whereCondition;
};

export const updateUserById = async (user: UserModel) => {
    return await User.update({ ...user }, { where: { id: user.id } });
};