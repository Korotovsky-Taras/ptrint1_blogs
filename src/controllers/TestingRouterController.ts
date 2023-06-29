import {NextFunction, Request, Response} from "express";
import {blogsRepository, postsRepository} from "../repositories";
import {ITestingRouterController, Status} from "../types";


export class TestingRouterController implements ITestingRouterController {
    clearAll(req: Request, res: Response, next: NextFunction) {
        blogsRepository.clear();
        postsRepository.clear();
        return res.sendStatus(Status.NO_CONTENT);
    }
}