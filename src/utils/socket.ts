import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { updateUserById } from "../repository/user.js";
import { UserModel } from "../entities/User.js";
import { validateJWTToken } from "./jwtToken.js";
import { UserController } from "../service/user/user.controller.js";
import { AuthToken, SortDirection } from "../common/index.model.js";
import { response } from "express";
import { SortColumnKey } from "../service/user/user.model.js";

let io: Server;
let payload: AuthToken;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Unauthorized"));

        try {
            socket.data.user = validateJWTToken(token);
            payload = socket.data.user;
            next();
        } catch {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket: Socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join-admin-room", () => {
            socket.join("admins");
            console.log("Admin joined admins room");
        });

        socket.on("user-online", async (userId: string) => {
            await updateUserIsOnline(userId, true);

            io.to("admins").emit("user-status", { id: userId, isOnline: true });
        });

        socket.on("user-offline", async (userId: string) => {
            await updateUserIsOnline(userId, false);

            io.to("admins").emit("user-status", { id: userId, isOnline: false });
        })

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
};

export const socket = (): Server => {
    if (!io) throw new Error("Socket not initialized");
    return io;
};


const updateUserIsOnline = async (id: string, isOnline: boolean) => {
    const user: UserModel = {
        id,
        is_online: isOnline,
    } as unknown as UserModel;
    await updateUserById(user);
};