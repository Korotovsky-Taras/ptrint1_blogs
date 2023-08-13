import {withMongoLogger} from "../utils/withMongoLogger";
import {
    User,
    UserCreateModel,
    UserEncodedPassword,
    UserListViewModel,
    UserMongoModel,
    UserPaginationRepositoryModel,
    UserReplaceConfirmationData,
    UserViewModel,
    UserWithConfirmedViewModel
} from "../types";
import {authConfirmationCollection, usersCollection} from "../db";
import {UsersDto} from "../dto/users.dto";
import {withMongoQueryFilterPagination} from "./utils";
import crypto from "node:crypto";
import {
    AuthConfirmation,
    AuthConfirmationMongoModel,
    AuthLoginModel,
    AuthMeViewModel,
    AuthRefreshToken,
    AuthTokens
} from "../types/login";
import {Filter, ObjectId} from "mongodb";
import {AuthDto} from "../dto/auth.dto";
import {randomUUID} from "crypto";
import {createAccessToken, createExpiredRefreshToken, createRefreshToken} from "../utils/tokenAdapter";


export const usersRepository = {
    async getAll(query: UserPaginationRepositoryModel): Promise<UserListViewModel> {
        return withMongoLogger<UserListViewModel>(async () => {

            let filter: Filter<User> = {};

            const searchLoginTermFilter: Filter<User> | null = query.searchLoginTerm !== null ? {login: {$regex: query.searchLoginTerm, $options: "i" }} : null;
            const searchEmailTermFilter: Filter<User> | null = query.searchEmailTerm !== null ? {email: {$regex: query.searchEmailTerm, $options: "i" }} : null;

            if (searchLoginTermFilter && searchEmailTermFilter) {
                filter = {$or: [searchEmailTermFilter, searchLoginTermFilter]}
            } else if (searchLoginTermFilter) {
                filter = searchLoginTermFilter
            } else if (searchEmailTermFilter) {
                filter = searchEmailTermFilter
            }

            return withMongoQueryFilterPagination<User, UserViewModel>(usersCollection, UsersDto.allUsers, filter, query);
        });
    },
    async createUser(model: UserCreateModel): Promise<UserViewModel | null> {
        return withMongoLogger<UserViewModel | null>(async () => {

            const userExist: UserMongoModel | null = await usersCollection.findOne({$or: [{email: model.email}, {login: model.login}]});

            if (userExist) {
                return null;
            }

            const password: UserEncodedPassword = usersRepository._hashPassword(model.password);

            const newUser: User = {
                email: model.email,
                login: model.login,
                password,
                createdAt: (new Date()).toISOString(),
                confirmed: true
            }

            const user = await usersCollection.insertOne(newUser)

            return UsersDto.user({
                _id: user.insertedId,
                ...newUser,
            })
        })
    },
    async createUserWithConfirmationCode(model: UserCreateModel): Promise<UserWithConfirmedViewModel | null> {
        return withMongoLogger<UserWithConfirmedViewModel | null>(async () => {

            const userExist: UserMongoModel | null = await usersCollection.findOne({$or: [{email: model.email}, {login: model.login}]});

            if (userExist) {
                return null;
            }

            const password: UserEncodedPassword = usersRepository._hashPassword(model.password);

            const newUser: User = {
                email: model.email,
                login: model.login,
                password,
                createdAt: (new Date()).toISOString(),
                confirmed: false
            }

            const user = await usersCollection.insertOne(newUser);

            const confirmation: AuthConfirmation = usersRepository._createEmailConfirmation(user.insertedId.toString());
            await authConfirmationCollection.insertOne(confirmation);

            return UsersDto.userWithConfirmation({
                _id: user.insertedId,
                ...newUser,
            }, confirmation.code)
        })
    },
    async deleteUserById(userId: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await usersCollection.deleteOne({_id: new ObjectId(userId)});
            return result.deletedCount === 1;
        });
    },
    async loginUser(model: AuthLoginModel): Promise<AuthTokens | null> {
        return withMongoLogger<AuthTokens | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({$or: [{email: model.loginOrEmail}, {login: model.loginOrEmail}]})
            if (user && user.confirmed) {
                const isVerified = usersRepository._verifyPassword(model.password, user.password.salt, user.password.hash);
                if (isVerified) {
                    const userId = user._id.toString();
                    return usersRepository.refreshTokens(userId);
                }
            }
            return null;
        });
    },
    async logoutUser(userId: string): Promise<AuthRefreshToken | null> {
        return withMongoLogger<AuthRefreshToken | null>(async () => {
            const user: UserMongoModel | null =  await usersCollection.findOne({_id: new ObjectId(userId)});
            if (user && user.confirmed) {
                return createExpiredRefreshToken(userId);
            }
            return null;
        });
    },
    async refreshTokens(userId: string): Promise<AuthTokens | null> {
        return withMongoLogger<AuthTokens | null>(async () => {
            const user: UserMongoModel | null =  await usersCollection.findOne({_id: new ObjectId(userId)});
            if (user && user.confirmed) {
                return {
                    accessToken: createAccessToken(userId),
                    refreshToken: createRefreshToken(userId),
                };
            }
            return null;
        });
    },
    async getUserWithConfirmationByEmail(email: string): Promise<UserWithConfirmedViewModel | null> {
        return withMongoLogger<UserWithConfirmedViewModel | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({ email })
            if (user) {
                const userId = user._id.toString();
                const authConfirmation: AuthConfirmationMongoModel | null = await authConfirmationCollection.findOne({ userId })
                if (authConfirmation) {
                    return UsersDto.userWithConfirmation(user, authConfirmation.code)
                }
            }
            return null;
        });
    },
    async isConfirmationCodeValid(code: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const authConfirmation: AuthConfirmationMongoModel | null = await authConfirmationCollection.findOne({ code })
            if (authConfirmation) {
                const user: UserMongoModel | null = await usersCollection.findOne({ _id: new ObjectId(authConfirmation.userId) })
                return user != null && !user.confirmed
            }
            return false;
        });
    },
    async getUserByLogin(login: string): Promise<UserViewModel | null> {
        return withMongoLogger<UserViewModel | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({ login })
            if (user) {
                return UsersDto.user(user)
            }
            return null;
        });
    },
    async getAuthUserById(userId: string): Promise<AuthMeViewModel | null> {
        return withMongoLogger<AuthMeViewModel | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({_id: new ObjectId(userId)})
            if (user) {
                return AuthDto.user(user)
            }
            return null;
        });
    },
    async verifyUserWithConfirmationCode(code: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const authConfirmation: AuthConfirmationMongoModel | null = await authConfirmationCollection.findOne({ code })
            if (authConfirmation) {
                const user : UserMongoModel | null = await usersCollection.findOne({_id: new ObjectId(authConfirmation.userId)});
                if (user && !user.confirmed) {
                    const isVerified = usersRepository._verifyExpiredDate(authConfirmation);
                    if (isVerified) {
                        await usersCollection.updateOne(user, {$set: { confirmed: true }})
                        return true;
                    }
                }
            }
            return false;
        });
    },
    async createUserReplaceConfirmationCode(email: string): Promise<UserReplaceConfirmationData | null> {
        return withMongoLogger<UserReplaceConfirmationData | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({ email });
            if (user && !user.confirmed) {
                const userId = user._id.toString();
                const confirmation: AuthConfirmation = usersRepository._createEmailConfirmation(userId);
                await authConfirmationCollection.updateOne({ userId }, {$set: {
                        code: confirmation.code,
                        expiredIn: confirmation.expiredIn,
                    }})
                return {
                    email,
                    code: confirmation.code,
                }
            }
            return null;
        });
    },
    async clear(): Promise<void> {
        return withMongoLogger<void>(async () => {
            await usersCollection.deleteMany({});
        })
    },
    _hashPassword(password: string) : UserEncodedPassword {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = usersRepository._createPasswordHash(password, salt);
        return { salt, hash };
    },
    _verifyPassword(password: string, salt: string, hash: string): boolean {
        const newHash = usersRepository._createPasswordHash(password, salt);
        return newHash === hash;
    },
    _createPasswordHash(password: string, salt: string): string {
        return crypto.pbkdf2Sync(password, salt, 100, 24, 'sha512').toString('hex');
    },
    _createEmailConfirmation(userId: string): AuthConfirmation  {
        let expiredDate: Date = new Date();
        expiredDate.setTime(expiredDate.getTime() + 3 * 1000 * 60);
        return {
            userId,
            expiredIn: expiredDate.toISOString(),
            code: randomUUID(),
        }
    },
    _verifyExpiredDate(session: {expiredIn: string}): boolean  {
        const expTime = new Date(session.expiredIn).getTime();
        const currentTime = new Date().getTime();
        return currentTime < expTime;
    },
}