import express from "express";
import userController from "../controller/user-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import venueController from "../controller/venue-controller.js";
import fieldController from "../controller/field-controller.js";
import upload from "../middleware/upload-middleware.js";

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
protectedRouter.get('/api/venues', venueController.getAllVenues);
protectedRouter.patch('/api/venues/update/:id', venueController.update);
protectedRouter.delete('/api/venues/delete/:id', venueController.deleteVenue);


// Field Route
protectedRouter.post('/api/:venueId/fields/create',upload.array("files") ,fieldController.create);
protectedRouter.get('/api/venues/fields/:id',fieldController.get);
protectedRouter.get('/api/:venueId/fields',fieldController.getAll);
protectedRouter.patch('/api/:venueId/fields/:fieldId/update', upload.array("files"), fieldController.updateField);
protectedRouter.delete('/api/:venueId/fields/:fieldId/delete',fieldController.deleteField);

export {protectedRouter}