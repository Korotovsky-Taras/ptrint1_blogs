import {IAuthService} from "../types";
import {AuthLoginModel} from "../types/login";
import {usersRepository} from "../repositories/users-repository";

class AuthService implements IAuthService {

    async login(model: AuthLoginModel): Promise<boolean> {
        return usersRepository.checkUserAuth(model);
    }

}

export const authService = new AuthService();