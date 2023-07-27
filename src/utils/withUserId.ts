import {WithUserId} from "../types";

function isObject<T>(value: unknown): value is T {
    return typeof value === 'object' && value !== null;
}

export const withUserId = (obj: WithUserId): WithUserId | null => {
    if (isObject(obj) && Object.hasOwn(obj, "userId")) {
        return obj;
    }
    return null;
}