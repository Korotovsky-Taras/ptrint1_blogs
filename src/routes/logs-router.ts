import {Route, RouterMethod} from "../types";
import {LogsRouterController} from "../controllers/LogsRouterController";

export const logsRouterController = new LogsRouterController();

export const logsRoute: Route<LogsRouterController> = {
    route: "/logs",
    method: RouterMethod.GET,
    controller: logsRouterController,
    action: 'getAll',
}

export const clearLogsRoute: Route<LogsRouterController> = {
    route: "/logs",
    method: RouterMethod.DELETE,
    controller: logsRouterController,
    action: 'deleteAll',
}

export const logsRoutes: Route<LogsRouterController>[] = [
    logsRoute,
    clearLogsRoute,
];





