import {IAuthService, UserNotConfirmedViewModel, UserReplaceConfirmationData} from "../types";
import {
    AuthLoginModel,
    AuthMeViewModel,
    AuthRegisterConfirmationModel,
    AuthRegisterModel,
    AuthResendingEmailModel,
    AuthServiceResultModel,
    AuthToken,
    AuthTokenPass
} from "../types/login";
import {usersRepository} from "../repositories/users-repository";
import {createAuthToken} from "../utils/authToken";
import {authMailManager} from "../managers/authMailManager";
import {userService} from "./UsersService";


class AuthService implements IAuthService {

    async login(model: AuthLoginModel): Promise<AuthToken | null> {
        const tokenPath: AuthTokenPass | null = await usersRepository.checkUserAuth(model);
        if (tokenPath) {
            return {
                token: createAuthToken(tokenPath.userId)
            };
        }
        return null;
    }

    async registerUser(model: AuthRegisterModel): Promise<AuthServiceResultModel> {
        const user: UserNotConfirmedViewModel | null = await userService.createUserWithVerification(model);

        if (user && user.emailConfirmation) {
            await authMailManager.sendRegistrationMail(user.email, user.emailConfirmation.code);
            return {
                success: true
            }
        }
        return {
            success: false
        }
    }

    async verifyConfirmationCode(model: AuthRegisterConfirmationModel): Promise<AuthServiceResultModel> {
        const success: boolean = await userService.verifyUserWithConfirmationCode(model.code);
        return { success }
    }

    async tryResendConfirmationCode(model: AuthResendingEmailModel): Promise<AuthServiceResultModel> {
        const data: UserReplaceConfirmationData | null = await usersRepository.createUserReplaceConfirmationCode(model.email);
        if (data) {
            await authMailManager.sendRegistrationMail(data.email, data.code);
            return {
                success: true
            }
        }
        return {
            success: false
        }
    }

    async getAuthUserById(userId: string): Promise<AuthMeViewModel | null> {
        return usersRepository.getAuthUserById(userId);
    }

}

export const authService = new AuthService();