import {User} from "./users";
import {WithId} from "mongodb";

export type AuthLoginModel = {
    loginOrEmail: string,
    password: string,
}

export type AuthLogoutModel = {
    userId: string
}

export type AuthRegisterModel = Pick<User, 'login' | 'email' > & { password: string }

export type AuthRegisterConfirmationModel = {
    code: string
}

export type AuthResendingEmailModel = {
    email: string
}

export type AuthServiceResultModel = {
    success: boolean
}

export type AuthTokenPass = {
    token: string,
    uuid: string
}

export type AuthVerifiedTokenPass = {
    userId: string,
    uuid: string
}

export type AuthAccessToken = Readonly<string>;
export type AuthRefreshToken = Readonly<string>;

export type AuthTokens = {
    accessToken: AuthAccessToken,
    refreshToken: AuthRefreshToken,
}

export type AuthMeViewModel = {
    email: string,
    login: string,
    userId: string
}

export type AuthConfirmation = {
    userId: string,
    expiredIn: string,
    code: string,
}

export type AuthSession = {
    userId: string,
    uuid: string,
}

export type AuthConfirmationMongoModel = WithId<AuthConfirmation>;