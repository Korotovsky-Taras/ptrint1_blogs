import {IAuthService, UserReplaceConfirmationData, UserWithConfirmedViewModel} from "../types";
import {
    AuthLoginRepoModel,
    AuthLogoutRepoModel,
    AuthMeViewModel,
    AuthRefreshToken,
    AuthRefreshTokenRepoModel,
    AuthRegisterConfirmationModel,
    AuthRegisterModel,
    AuthResendingEmailModel,
    AuthServiceResultModel,
    AuthTokens
} from "../types/login";
import {usersRepository} from "../repositories/users-repository";
import {mailSender} from "../managers/mailSender";
import {userService} from "./UsersService";


class AuthService implements IAuthService {

    async login(model: AuthLoginRepoModel): Promise<AuthTokens | null> {
        return usersRepository.loginUser(model);
    }

    async logout(model: AuthLogoutRepoModel): Promise<AuthRefreshToken | null> {
        return usersRepository.logoutUser(model);
    }

    async refreshTokens(model: AuthRefreshTokenRepoModel): Promise<AuthTokens | null> {
        return usersRepository.refreshTokens(model);
    }

    async registerUser(model: AuthRegisterModel): Promise<AuthServiceResultModel> {
        const user: UserWithConfirmedViewModel | null = await userService.createUserWithVerification(model);

        if (user && !user.confirmed) {
            await mailSender.sendRegistrationMail(user.email, user.confirmationCode);
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
            await mailSender.sendRegistrationMail(data.email, data.code);
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