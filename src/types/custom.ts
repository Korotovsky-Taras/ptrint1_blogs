import {NextFunction, Request, Response} from "express";

export enum RouterMethod {
    POST= "post",
    PUT="put",
    DELETE="delete",
    GET="get"
}

export enum Status {
    OK=200,
    CREATED=201,
    NO_CONTENT=204,
    BAD_REQUEST=400,
    UNATHORIZED=401,
    NOT_FOUND=404,
    DB_ERROR=409,
    UNHANDLED=500,
}

export type ParamIdModel = {
    id: string
}

export type FieldError = {
    message: string;
    field: string
}

export type ErrorsMessage = {
    errorsMessages: FieldError[]
}

export type RouteMiddleware = (req: Request, res: Response,  next: NextFunction) => void

export interface Route<T> {
    route: string,
    method: RouterMethod;
    controller: T;
    action: keyof T;
    middlewares?: RouteMiddleware[]
}