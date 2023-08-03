import {User} from "./users";
import {WithId} from "mongodb";

export type AuthLoginModel = {
    loginOrEmail: string,
    password: string,
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
    userId: string
}

export type AuthToken = {
    token: string
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

export type AuthConfirmationMongoModel = WithId<AuthConfirmation>;