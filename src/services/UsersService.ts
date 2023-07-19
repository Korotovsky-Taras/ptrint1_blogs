import {IUsersService, UserCreateModel, UserViewModel} from "../types";

class UsersService implements IUsersService {

    async createUser(model: UserCreateModel): Promise<UserViewModel | null> {
        return Promise.resolve(null);
    }

    async  deleteUser(blogId: string): Promise<boolean> {
        return Promise.resolve(false);
    }

}

export const userService = new UsersService();