import express from 'express';
import {protectedRouter} from "../route/api.js";
import {publicRouter} from "../route/public-api.js";
import {errorMiddleware} from "../middleware/error-middleware.js";

export const web = express();
web.use(express.json());
web.use(publicRouter)
web.use(protectedRouter)
web.use(errorMiddleware)