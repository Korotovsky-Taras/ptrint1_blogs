import {withMongoLogger} from "../utils/withMongoLogger";
import {
    User,
    UserCreateModel,
    UserEmailConfirmation,
    UserEncodedPassword,
    UserListViewModel,
    UserMongoModel,
    UserNotConfirmedViewModel,
    UserPaginationRepositoryModel,
    UserReplaceConfirmationData,
    UserViewModel
} from "../types";
import {usersCollection} from "../db";
import {UsersDto} from "../dto/users.dto";
import {withMongoQueryFilterPagination} from "./utils";
import crypto from "node:crypto";
import {AuthLoginModel, AuthMeViewModel, AuthTokenPass} from "../types/login";
import {Filter, ObjectId} from "mongodb";
import {AuthDto} from "../dto/auth.dto";
import {randomUUID} from "crypto";


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
                emailConfirmation: null
            }

            const user = await usersCollection.insertOne(newUser)

            return UsersDto.user({
                _id: user.insertedId,
                ...newUser,
            })
        })
    },
    async createUserWithConfirmationCode(model: UserCreateModel): Promise<UserNotConfirmedViewModel | null> {
        return withMongoLogger<UserNotConfirmedViewModel | null>(async () => {

            const userExist: UserMongoModel | null = await usersCollection.findOne({$or: [{email: model.email}, {login: model.login}]});

            if (userExist) {
                return null;
            }

            const password: UserEncodedPassword = usersRepository._hashPassword(model.password);
            const confirmation: UserEmailConfirmation = usersRepository._createEmailConfirmation();

            const newUser: User = {
                email: model.email,
                login: model.login,
                password,
                createdAt: (new Date()).toISOString(),
                emailConfirmation: {
                    code: confirmation.code,
                    expiresIn: confirmation.expiresIn,
                    confirmed: confirmation.confirmed,
                }
            }

            const user = await usersCollection.insertOne(newUser)

            return UsersDto.userNotConfirmed({
                _id: user.insertedId,
                ...newUser,
            })
        })
    },
    async deleteUserById(userId: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await usersCollection.deleteOne({_id: new ObjectId(userId)});
            return result.deletedCount === 1;
        });
    },
    async checkUserAuth(model: AuthLoginModel): Promise<AuthTokenPass | null> {
        return withMongoLogger<AuthTokenPass | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({$or: [{email: model.loginOrEmail}, {login: model.loginOrEmail}]})
            if (user) {
                const isVerified = usersRepository._verifyPassword(model.password, user.password.salt, user.password.hash);
                if (isVerified) {
                    return AuthDto.toAuthTokenPath(user)
                }
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
            const user: UserMongoModel | null = await usersCollection.findOne({"emailConfirmation.code": code})
            if (user && user.emailConfirmation) {
                const isVerified = usersRepository._verifyConfirmationCode(user.emailConfirmation);
                if (isVerified) {
                    await usersCollection.updateOne(user, {$set: { emailConfirmation: null }})
                    return true;
                }
            }
            return false;
        });
    },
    async createUserReplaceConfirmationCode(email: string): Promise<UserReplaceConfirmationData | null> {
        return withMongoLogger<UserReplaceConfirmationData | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({ email });
            if (user && user.emailConfirmation) {
                const confirmation: UserEmailConfirmation = usersRepository._createEmailConfirmation();
                await usersCollection.updateOne(user, {$set: {
                        "emailConfirmation.code": confirmation.code,
                        "emailConfirmation.expiresIn": confirmation.expiresIn,
                        "emailConfirmation.confirmed": confirmation.confirmed,
                    }})
                return {
                    email: user.email,
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
    _verifyConfirmationCode(confirmation: UserEmailConfirmation): boolean {
        const expTime = new Date(confirmation.expiresIn).getTime();
        const currentTime = new Date().getTime();
        return !confirmation.confirmed && expTime < currentTime;
    },
    _createEmailConfirmation(): UserEmailConfirmation  {
        let expiredDate: Date = new Date();
        expiredDate.setTime(expiredDate.getTime() + 3 * 1000 * 60);
        return {
            expiresIn: expiredDate.toISOString(),
            code: randomUUID(),
            confirmed: false
        }
    },
}