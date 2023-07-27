import express, {Express} from "express";
import errorHandling from "./middlewares/error-handling";
import {authRoutes, blogRoutes, commentsRoutes, logsRoutes, postsRoutes, testingRoutes, usersRoutes} from "./routes";
import {connectRouter} from "./utils/routerConnect";

export const app: Express = express();

app.use(express.json())

connectRouter(authRoutes)
connectRouter(usersRoutes)
connectRouter(logsRoutes)
connectRouter(blogRoutes)
connectRouter(postsRoutes)
connectRouter(testingRoutes)
connectRouter(commentsRoutes)

app.use(errorHandling);

