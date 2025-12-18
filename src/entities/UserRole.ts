import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import User from "./User.js";
import Role from "./Role.js";
import Admin from "./Admin.js";


export interface UserRoleModel {
  user_id: string;
  role_id: number;
  created_at: Date;
  created_by: string;
  updated_at: Date | null;
  updated_by: string | null;
}

const UserRole = sequelize.define("UserRole", {
  user_id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: User,
      key: "id"
    },
    primaryKey: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: "id"
    },
    primaryKey: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Admin,
      key: "id"
    }
  },
  updated_at: {
    type: DataTypes.DATE,
  },
  updated_by: {
    type: DataTypes.UUID,
    references: {
      model: Admin,
      key: "id"
    }
  }
}, {
  tableName: "user_role",
  schema: "public",
  timestamps: false,
});

export default UserRole;