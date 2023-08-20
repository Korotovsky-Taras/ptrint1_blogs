import {User} from "./users";
import {WithId} from "mongodb";

export type AuthLoginReqModel = {
    loginOrEmail: string,
    password: string,
}

export type AuthLoginRepoModel = Pick<AuthLoginReqModel, 'loginOrEmail' | 'password' > & { userAgent: string, ip: string }

export type AuthRefreshTokenRepoModel = {
    userId: string,
    userAgent: string,
    ip: string,
}

export type AuthLogoutRepoModel = {
    userId: string,
    userAgent: string,
}

export type AuthDeleteAllSessionsRepoModel = {
    userId: string,
    userAgent: string,
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

export type AuthAccessTokenPass = {
    token: string,
}

export type AuthRefreshTokenPass = {
    token: string,
    uuid: string,
    deviceId: string,
    expiredIn: string,
}

export type AuthAccessTokenPayload = {
    userId: string,
    expiredIn: string
}

export type AuthTokenParts = {
    head: string,
    body: string
    signature: string
}

export type AuthRefreshTokenPayload = {
    userId: string,
    uuid: string,
    deviceId: string,
    expiredIn: string
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
    ip: string,
    userAgent: string,
    lastActiveDate: string,
    deviceId: string,
}

export type AuthSessionMongoModel = WithId<AuthSession>;

export type AuthSessionValidationModel = Pick<AuthSession, "uuid">;

export type AuthSessionViewModel = Pick<AuthSession, "ip" | "lastActiveDate" | "deviceId"> & {title: string};

export type AuthSessionDataModel = Pick<AuthSession, "uuid" | "userId" | "deviceId">;

export type AuthConfirmationMongoModel = WithId<AuthConfirmation>;