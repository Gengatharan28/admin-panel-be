import type { NextFunction, Request, Response, Router } from "express";
import { handleBodyRequestParsing } from "./common.js";


export enum APIMethod {
    Post = "post",
    Put = "put",
    Get = "get",
    Delete = "delete",
}

export interface Route {
    path: string;
    method: APIMethod;
    handler: (req: Request, res: Response) => Promise<unknown> | unknown;
}

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown;

type Wrapper = (router: Router) => void;

export const middleware = [handleBodyRequestParsing];

export const applyMiddleware = (middlewareWrappers: Wrapper[], router: Router): void => {
    for (const wrapper of middlewareWrappers) {
        wrapper(router);
    }
};

export const getAPIResponse = <T>(isSuccess: boolean, data?: T, error?: string) => {
    return {
        isSuccess,
        data,
        error
    };
}

export const getErrorRes = (err: Error): string => {
    return err.message;
}

const getRouter = (route: Route): Handler[] => {
    return [
        (req, res, next): void => next(),
        async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>> | undefined> => {
            try {
                const data = await route.handler(req, res);
                if (!res.isSent) {
                    const status = 200;
                    const response = getAPIResponse(true, data);
                    return res.status(status).send(response);
                }
            } catch (err) {
                if (!res.isSent) {
                    const errorMsg = getErrorRes(err as Error);
                    const status = 400;
                    const response = getAPIResponse(false, undefined, errorMsg);
                    return res.status(status).send(response);
                }

            } finally {
                console.log('API Finished')
            }
        },
    ];
};

export const applyRoutes = (routes: Route[], router: Router) => {
    for (const route of routes) {
        const handler = getRouter(route);
        switch (route.method) {
            case 'post': {
                router.post(route.path, handler);
                break;
            }
            case 'put': {
                router.put(route.path, handler);
                break;
            }
            case 'get': {
                router.get(route.path, handler);
                break;
            }
            case 'delete': {
                router.delete(route.path, handler);
                break;
            }
        }
    }
}