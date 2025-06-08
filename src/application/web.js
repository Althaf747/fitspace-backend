import express from 'express';
import cors from 'cors';
import path from 'path';
import {protectedRouter} from "../route/api.js";
import {publicRouter} from "../route/public-api.js";
import {errorMiddleware} from "../middleware/error-middleware.js";
import {fileURLToPath} from "url";
import {logger} from "./logging.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = __dirname.replace('src\\application', 'src');

logger.info(`Updated DIR: ${dir}`);

export const web = express();
web.use(express.static(dir));
web.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
}));

web.use(express.json());
web.use(publicRouter)
web.use(protectedRouter)
web.use(errorMiddleware)