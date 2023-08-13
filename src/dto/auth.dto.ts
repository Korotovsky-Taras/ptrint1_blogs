import {UserMongoModel} from "../types";
import {AuthMeViewModel, AuthUserPass} from "../types/login";

export const AuthDto = {
    toAuthUserPass({_id}: UserMongoModel): AuthUserPass {
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