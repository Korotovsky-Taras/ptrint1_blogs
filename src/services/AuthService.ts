import {IAuthService, UserReplaceConfirmationData, UserWithConfirmedViewModel} from "../types";
import {
    AuthLoginModel,
    AuthMeViewModel,
    AuthRegisterConfirmationModel,
    AuthRegisterModel,
    AuthResendingEmailModel,
    AuthServiceResultModel,
    AuthTokens
} from "../types/login";
import {usersRepository} from "../repositories/users-repository";
import {authMailManager} from "../managers/authMailManager";
import {userService} from "./UsersService";


class AuthService implements IAuthService {

    async login(model: AuthLoginModel): Promise<AuthTokens | null> {
        return usersRepository.loginUser(model);
    }

    async logout(userId: string): Promise<boolean> {
        return usersRepository.logoutUser(userId);
    }

    async refreshTokens(userId: string): Promise<AuthTokens | null> {
        return usersRepository.refreshTokens(userId);
    }

    async registerUser(model: AuthRegisterModel): Promise<AuthServiceResultModel> {
        const user: UserWithConfirmedViewModel | null = await userService.createUserWithVerification(model);

        if (user && !user.confirmed) {
            await authMailManager.sendRegistrationMail(user.email, user.confirmationCode);
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