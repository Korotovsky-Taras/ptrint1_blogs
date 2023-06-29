import {TestingRouterController} from "../controllers/TestingRouterController";
import {ITestingRouterController, Route, RouterMethod} from "../types";

const testingRouterController = new TestingRouterController();

const testingRoute: Route<ITestingRouterController> = {
    route: "/testing/all-data",
    method: RouterMethod.DELETE,
    controller: testingRouterController,
    action: 'clearAll'
}

export const testingRoutes: Route<ITestingRouterController>[] = [
    testingRoute
] ;