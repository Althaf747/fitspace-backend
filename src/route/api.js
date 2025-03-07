import express from "express";
import userController from "../controller/user-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import {publicRouter} from "./public-api.js";
import venueController from "../controller/venue-controller.js";

const protectedRouter = new express.Router();
protectedRouter.use(authMiddleware);

// User Route
protectedRouter.get('/api/users/current', userController.get);
protectedRouter.delete('/api/users/logout', userController.logout);
protectedRouter.patch('/api/users/changePassword/:id', userController.changePassword);
protectedRouter.patch('/api/users/changeUsername/:id', userController.changeUsername);

// Venue Route
protectedRouter.post('/api/users/createVenue', venueController.createVenue);
protectedRouter.get('/api/venues/:id', venueController.get);
protectedRouter.patch('/api/venues/update/:id', venueController.update);

export {protectedRouter}