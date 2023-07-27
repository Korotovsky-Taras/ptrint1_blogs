import {IAuthService} from "../types";
import {AuthLoginModel, AuthMeViewModel} from "../types/login";
import {usersRepository} from "../repositories/users-repository";

class AuthService implements IAuthService {

    async login(model: AuthLoginModel): Promise<boolean> {
        return usersRepository.checkUserAuth(model);
    }

    async getAuthUserById(userId: string): Promise<AuthMeViewModel | null> {
        return usersRepository.getAuthUserById(userId);
    }

}

export const authService = new AuthService();