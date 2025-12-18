import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export interface AdminModel {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date | null;
}

const Admin = sequelize.define("Admin", {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.CITEXT,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.CITEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.CITEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
  }
}, {
  tableName: "admin",
  schema: "public",
  timestamps: false,
});


export default Admin;


