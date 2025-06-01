import express from 'express';
import {protectedRouter} from "../route/api.js";
import {publicRouter} from "../route/public-api.js";
import {errorMiddleware} from "../middleware/error-middleware.js";
import cors from 'cors';

export const web = express();
// const cors = require('cors');

web.use(express.json());
web.use(cors({
  origin: 'http://localhost:5173', 
  methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
  allowedHeaders: 'Content-Type,Authorization', 
}));
web.use(publicRouter)
web.use(protectedRouter)
web.use(errorMiddleware)