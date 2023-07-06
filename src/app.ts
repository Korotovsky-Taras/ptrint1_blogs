import express from "express";
import errorHandling from "./middlewares/error-handling";
import env from "dotenv";
import {blogRoutes, logsRoutes, postsRoutes, testingRoutes} from "./routes";
import {connectRouter} from "./utils/routerConnect";

export const app = express();

env.config({ path: `.env.${process.env.NODE_ENV}` });

app.use(express.json())

connectRouter(logsRoutes)
connectRouter(blogRoutes)
connectRouter(postsRoutes)
connectRouter(testingRoutes)

app.use(errorHandling);

