import {NextFunction, Request, Response} from "express";
import {app} from "../app";
import {Route} from "../types";

export const connectRouter = (routes: Route<any>[]) => {
    routes.forEach(router => {
        (app as any)[router.method](router.route,
            router.middlewares ? [...router.middlewares] : [],
            async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
                try {
                    const controllerResponse: Response = await router.controller[router.action](req, res, next);
                    // проверяем response на наличие заголовка ответа
                    if (!controllerResponse.headersSent) {
                        // здесь можно логировать те контроллеры которые не закрыли ответ
                        controllerResponse.end();
                    }
                } catch (err) {
                    next(err)
                }
            })
    })
}
