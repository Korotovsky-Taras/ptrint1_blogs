import {IUsersService, UserCreateModel, UserViewModel} from "../types";
import {usersRepository} from "../repositories/users-repository";

class UsersService implements IUsersService {

    async createUser(model: UserCreateModel): Promise<UserViewModel | null> {
        return usersRepository.createUser(model);
    }

    async deleteUser(userId: string): Promise<boolean> {
        return usersRepository.deleteUserById(userId);
    }

}

export const userService = new UsersService();