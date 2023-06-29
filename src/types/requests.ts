import {Request} from "express";

export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsBody<P, B> = Request<P, {}, B>;
export type RequestWithBody<T> = Request<{},{},T>;