import {UserMongoModel} from "../types";
import {AuthMeViewModel, AuthTokenPass} from "../types/login";

export const AuthDto = {
    toAuthTokenPath({_id}: UserMongoModel): AuthTokenPass {
        return {
            userId: _id.toString(),
        }
    },
    user({_id, email, login}: UserMongoModel): AuthMeViewModel {
        return {
            email: email,
            login: login,
            userId: _id.toString(),
        }
    },
}