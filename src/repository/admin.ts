import { Model } from 'sequelize';
import Admin, { AdminModel } from '../entities/Admin.js';


export const getAdminByEmail = async (email: string): Promise<AdminModel | null> => {
    return await Admin.findOne({ where: { email } }) as unknown as AdminModel;
};

export const createAdmin = async (user: AdminModel) => {
    return await Admin.create({ ...user });
};

export const getAdminById = async (id: string): Promise<AdminModel | null> => {
    return await Admin.findOne({ where: { id } }) as unknown as AdminModel;
};

