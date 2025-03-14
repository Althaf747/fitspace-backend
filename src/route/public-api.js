import express from 'express';
import userController from '../controller/user-controller.js'

const publicRouter = new express.Router();

publicRouter.post('/api/users/register', userController.register);
publicRouter.post('/api/users/login', userController.login);
publicRouter.post('/api/users/forgot-password', userController.forgotPassword);
publicRouter.post('/api/users/validate-otp', userController.validateOtp);
publicRouter.post('/api/users/reset-password', userController.resetPassword);

export {publicRouter};