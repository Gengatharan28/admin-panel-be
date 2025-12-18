import { Op, Order, WhereOptions } from 'sequelize';
import { ISort } from '../common/index.model.js';
import Role, { RoleModel } from '../entities/Role.js';
import { GetAllRoleReq, RoleSortColumnKey } from '../service/role/role.model.js';
import { getPagination } from '../utils/common.js';
import { sequelize } from '../database.js';
import User from '../entities/User.js';
import UserRole from '../entities/UserRole.js';



export const getRoleByName = async (name: string) => {
    return await Role.findOne({ where: { name } });
};

export const addRole = async (role: RoleModel) => {
    return await Role.create({ ...role });
};

export const getRoleById = async (id: number) => {
    return await Role.findOne({
        where: { id },
    });
};

export const updateRoleById = async (role: RoleModel) => {
    return await Role.update(
        role, { where: { id: role.id } }
    );
};

export const deleteRoleById = async (id: number) => {
    const transaction = await sequelize.transaction();

    try {
        await UserRole.destroy({ where: { role_id: id }, transaction });
        await Role.destroy({ where: { id }, transaction });

        await transaction.commit();
        return true;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

export const getRoleLists = async (req: GetAllRoleReq): Promise<{
    rows: RoleModel[],
    count: number,
}> => {
    const where = getWhere(req);
    const { limit, offset } = getPagination(req.count, req.page);
    const order = getOrder({ column: req.sortColumn, direction: req.sortDirection });

    return await Role.findAndCountAll({
        where,
        ...(limit && { limit }),
        ...(offset && { offset }),
        order,
        attributes: ["id", "name", "is_active", "created_at", "is_root"]

    }) as unknown as { rows: RoleModel[], count: number };
};

const getOrder = (sort: ISort): Order => {

    switch (sort.column) {
        case RoleSortColumnKey.CreatedAt:
            return [['created_at', sort.direction]];
        case RoleSortColumnKey.Name:
            return [['name', sort.direction]];
        default:
            return [['is_active', sort.direction]];
    }

};

const getWhere = <T>(req: GetAllRoleReq): WhereOptions => {

    const where: WhereOptions = {}
    if (!req.search) return where;

    const searchValue = `%${req.search}%`;
    where.name = {
        [Op.iLike]: searchValue
    };

    return where;
};

export const getRoles = async (): Promise<RoleModel[]> => {
    return await Role.findAll({
        where: { is_active: true },
        attributes: ["id", "name", "is_active", "created_at", "is_root"]

    }) as unknown as RoleModel[];
};