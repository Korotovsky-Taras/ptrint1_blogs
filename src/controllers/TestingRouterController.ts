import {Request, Response} from "express";
import {blogsRepository, postsRepository} from "../repositories";
import {ITestingRouterController, Status} from "../types";


class TestingRouterController implements ITestingRouterController {
    async clearAll(req: Request, res: Response) {
        await blogsRepository.clear();
        await postsRepository.clear();
        return res.sendStatus(Status.NO_CONTENT);
    }
}

export const testingRouterController = new TestingRouterController();