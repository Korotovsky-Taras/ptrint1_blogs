import {IUsersRouterController, RequestWithQuery, Status, UserListViewModel, UserPaginationQueryModel} from "../types";
import {NextFunction, Request, Response} from "express";
import {usersRepository} from "../repositories/users-repository";
import {UsersDto} from "../dto/users.dto";


class UsersRouterController implements IUsersRouterController {
    async getAll(req: RequestWithQuery<UserPaginationQueryModel>, res: Response<UserListViewModel>) {
        const users: UserListViewModel = await usersRepository.getAll(UsersDto.toRepoQuery(req.query))
        return res.status(Status.OK).send(users);
    }
    async createUser(req: Request, res: Response, next: NextFunction) {
        return res;
    }
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        return res;
    }
}

export const usersRouterController = new UsersRouterController();