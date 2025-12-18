import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import UserRole from "./UserRole.js";

export interface UserModel {
    id: string;
    first_name: string;
    last_name: string | null;
    email: string;
    password: string;
    created_at: Date;
    created_by: string;
    updated_at: Date | null;
    updated_by: string | null;
    is_online: boolean;
}

const User = sequelize.define("User", {
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
    created_by: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
    updated_by: {
        type: DataTypes.UUID,
    },
    is_online: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: "user",
    schema: "public",
    timestamps: false,
});

export default User;