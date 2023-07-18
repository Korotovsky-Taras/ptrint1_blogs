import express, {Express} from "express";
import errorHandling from "./middlewares/error-handling";
import env from "dotenv";
import {blogRoutes, logsRoutes, postsRoutes, testingRoutes} from "./routes";
import {connectRouter} from "./utils/routerConnect";

export const app: Express = express();

if (process.env.NODE_ENV != 'production') {
    env.config({ path: `.env.development` });
} else {
    env.config();
}

app.use(express.json())

connectRouter(logsRoutes)
connectRouter(blogRoutes)
connectRouter(postsRoutes)
connectRouter(testingRoutes)

app.use(errorHandling);

