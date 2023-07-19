import {IAuthService} from "../types";
import {AuthLoginModel} from "../types/login";

class AuthService implements IAuthService {

    async login(model: AuthLoginModel): Promise<null> {
        return Promise.resolve(null);
    }

}

export const authService = new AuthService();