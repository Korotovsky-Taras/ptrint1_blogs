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

export type AuthUserPass = {
    userId: string
}

export type AuthTokens = {
    accessToken: Readonly<string>,
    refreshToken: Readonly<string>,
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
    expiredIn: string,
    uuid: string,
}

export type AuthConfirmationMongoModel = WithId<AuthConfirmation>;