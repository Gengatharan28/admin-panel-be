import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import Admin from "./Admin.js";
import UserRole from "./UserRole.js";


export interface RoleModel {
  id: number;
  name: string;
  is_active: boolean;
  created_at: Date;
  is_root: boolean;
  created_by: string;
  updated_at: Date | null;
  updated_by: string | null;
}


const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.CITEXT,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  is_root: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
      key: "id",
    }
  },
  updated_at: {
    type: DataTypes.DATE,
  },
  updated_by: {
    type: DataTypes.UUID,
    references: {
      model: Admin,
      key: "id",
    }
  }
}, {
  tableName: "role",
  schema: "public",
  timestamps: false,
});


export default Role;