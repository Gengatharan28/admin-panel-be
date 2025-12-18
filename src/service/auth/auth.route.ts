import { Request, Response } from "express";
import { type Route, APIMethod } from "../../middleware/route.js";
import { AuthController } from "./auth.controller.js";
import { GetAuthRes, LoginRes, RegisterRes } from "./auth.model.js";


export const AuthRoutes: Route[] = [
    {
        path: '/api/auth/register',
        method: APIMethod.Post,
        handler: (req): Promise<RegisterRes> => {
            const controller = new AuthController();
            return controller.register(req.body);
        }
    },
    {
        path: '/api/auth/login',
        method: APIMethod.Post,
        handler: (req): Promise<LoginRes> => {
            const controller = new AuthController();
            return controller.login(req.body);
        },
    },
    {
        path: '/api/auth/get/:id',
        method: APIMethod.Get,
        handler: (req, res): Promise<GetAuthRes> => {
            const controller = new AuthController(req.authToken, res);
            return controller.getAuth({ id: req.params.id });
        },
    }
]