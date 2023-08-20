import {UserMongoModel} from "../types";
import {
    AuthMeViewModel,
    AuthSessionDataModel,
    AuthSessionMongoModel,
    AuthSessionValidationModel,
    AuthSessionViewModel
} from "../types/login";

export const AuthDto = {
    user({_id, email, login}: UserMongoModel): AuthMeViewModel {
        return {
            email: email,
            login: login,
            userId: _id.toString(),
        }
    },
    validationSession({uuid}: AuthSessionMongoModel): AuthSessionValidationModel {
        return {
            uuid,
        }
    },
    viewSession({deviceId, lastActiveDate, ip, userAgent}: AuthSessionMongoModel): AuthSessionViewModel {
        return {
            ip,
            deviceId,
            lastActiveDate,
            title: userAgent,
        }
    },
    dataSession({deviceId, userId, uuid}: AuthSessionMongoModel): AuthSessionDataModel {
        return {
            uuid,
            userId,
            deviceId,
        }
    },
    sessions(sessions: AuthSessionMongoModel[]): AuthSessionViewModel[] {
        return sessions.map(session => {
            return AuthDto.viewSession(session)
        })
    },
}