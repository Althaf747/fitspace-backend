import express from "express";
import userController from "../controller/user-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import venueController from "../controller/venue-controller.js";
import fieldController from "../controller/field-controller.js";
import upload from "../middleware/upload-middleware.js";
import reviewController from "../controller/review-controller.js";
import bookingController from "../controller/booking-controller.js";

const protectedRouter = new express.Router();
protectedRouter.use(authMiddleware);

// User Route
protectedRouter.get('/api/users/current', userController.get);
protectedRouter.delete('/api/users/logout', userController.logout);
protectedRouter.patch('/api/users/changePassword/:id', userController.changePassword);
protectedRouter.patch('/api/users/changeUsername/:id', userController.changeUsername);

// Venue Route
protectedRouter.post('/api/venues/createVenue', venueController.createVenue);
protectedRouter.get('/api/venues/:id', venueController.get);
protectedRouter.get('/api/venues', venueController.getAllVenues);
protectedRouter.patch('/api/venues/update/:id', venueController.update);
protectedRouter.delete('/api/venues/delete/:id', venueController.deleteVenue);

// Field Route
protectedRouter.post('/api/:venue_id/fields/create',upload.array("files") ,fieldController.create);
protectedRouter.get('/api/venues/fields/:id',fieldController.get);
protectedRouter.get('/api/:venue_id/fields',fieldController.getAll);
protectedRouter.patch('/api/:venue_id/fields/:field_id/update', upload.array("files"), fieldController.updateField);
protectedRouter.delete('/api/:venue_id/fields/:field_id/delete',fieldController.deleteField);

// Review Route
protectedRouter.post('/api/:venue_id/fields/:field_id/addReview',reviewController.create)
protectedRouter.get('/api/:field_id/reviews', reviewController.getReviewsByfield_id);
protectedRouter.get('/api/reviews', reviewController.getAllReviews);
protectedRouter.patch('/api/reviews/:reviewId/update', reviewController.update);
protectedRouter.delete('/api/reviews/:reviewId/delete',reviewController.deleteReview);

// Booking Route
protectedRouter.post('/api/:venue_id/bookings/create',bookingController.create);
protectedRouter.get('/api/user/bookings/all', bookingController.getAll);
protectedRouter.patch('/api/bookings/:bookingId/update', bookingController.update);
protectedRouter.delete('/api/bookings/:bookingId/delete', bookingController.deleteBooking);

export {protectedRouter}