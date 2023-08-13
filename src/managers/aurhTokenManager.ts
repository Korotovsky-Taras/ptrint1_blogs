import {Request, Response} from "express";

class AuthTokenManager {
    constructor(protected refreshTokenName: string = 'refreshToken') {}
    applyRefreshToken(res: Response, refreshToken: string) {
        res.cookie(this.refreshTokenName, refreshToken, {httpOnly: true, secure: true})
    }
    getRefreshToken(req: Request): string | null {
        const cookies = req.cookies;
        return cookies && cookies.hasOwnProperty(this.refreshTokenName) ? cookies[this.refreshTokenName] : null
    }
}

export const authTokenManager = new AuthTokenManager();