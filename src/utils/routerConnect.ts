import {NextFunction, Request, Response} from "express";
import {app} from "../app";
import {Route} from "../types";

export const connectRouter = (routes: Route<any>[]) => {
    routes.forEach(router => {
        (app as any)[router.method](router.route,
            router.middlewares ? [...router.middlewares] : [],
            (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
                try {
                    router.controller[router.action](req, res, next);
                } catch (err) {
                    next(err)
                }
            })
    })
}
