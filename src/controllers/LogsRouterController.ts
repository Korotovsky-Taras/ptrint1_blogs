import {Request, Response} from "express";
import {ILogsRouterController, Log, Status} from "../types";
import {logsRepository} from "../repositories/logs-repository";


export class LogsRouterController implements ILogsRouterController {
    async getAll(req: Request, res: Response<Log[]>) {
        const logs: Log[] = await logsRepository.getAll();
        return res.status(Status.OK).send(logs);
    }
    async deleteAll(req: Request, res: Response) {
        await logsRepository.deleteAll();
        return res.sendStatus(Status.NO_CONTENT);
    }
}