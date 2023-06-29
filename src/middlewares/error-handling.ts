import {ApiError} from "../utils/ApiError";
import {NextFunction, Request, Response} from "express";

const ErrorHandling = (err: Error, req: Request, res: Response, next: NextFunction) =>  {
    if (err instanceof ApiError) {
        if (err.errors) {
            return res.status(err.status).json(err.errors)
        }
        return res.status(err.status).send();
    }
    return res.status(500).json({ message: "Unhandled error" });
};

export default ErrorHandling;