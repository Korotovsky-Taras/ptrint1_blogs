import {IAuthService} from "../types";
import {AuthLoginModel, AuthMeViewModel, AuthToken, AuthTokenPass} from "../types/login";
import {usersRepository} from "../repositories/users-repository";
import {createAuthToken} from "../utils/authToken";

class AuthService implements IAuthService {

    async login(model: AuthLoginModel): Promise<AuthToken | null> {
        const tokenPath: AuthTokenPass | null = await usersRepository.checkUserAuth(model);
        if (tokenPath) {
            createAuthToken(tokenPath.userId);
        }
        return null;
    }

    async getAuthUserById(userId: string): Promise<AuthMeViewModel | null> {
        return usersRepository.getAuthUserById(userId);
    }

}

export const authService = new AuthService();