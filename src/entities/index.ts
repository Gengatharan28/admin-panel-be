import User from './User.js';
import Role from './Role.js';
import UserRole from './UserRole.js';
import Admin from './Admin.js';

export const initAssociations = () => {

    User.hasMany(UserRole, {
        foreignKey: 'user_id',
        as: 'userRoles',
    });

    UserRole.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
    });

    Role.hasMany(UserRole, {
        foreignKey: 'role_id',
        as: 'roleUsers',
    });

    UserRole.belongsTo(Role, {
        foreignKey: 'role_id',
        as: 'role',
    });

    User.belongsTo(Admin, { foreignKey: 'created_by' });
    Role.belongsTo(Admin, { foreignKey: 'created_by' });
};

export {
    User,
    Role,
    UserRole,
    Admin
};
