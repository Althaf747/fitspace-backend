import userService from "../service/user-service.js";
import {logger} from "../application/logging.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            data: result,
        });
    }catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            token: result,
        })
    }catch (error) {
        next(error);
    }
}

const get = async (req, res, next) => {
    try {
        const result = await userService.get(req);
        res.status(200).json({
            data: result,
        })
    }catch (error) {
        next(error);
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await userService.getAll(req);
        res.status(200).json({
            data: result,
        })
    }catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        res.status(200).json({
            message: "logout successfully",
        })
    }catch (error) {
        next(error);
    }
}

const changeUsername = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        console.log(req);
        const result = await userService.changeUsername(id, req);
        res.status(200).json({
            data: result,
            message: "OK"
        })
    } catch (e) {
        next(e);
    }
}

const changePassword = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result =  await userService.changePassword(id, req);
        res.status(200).json({
            data: result,
            message : "OK"
        })
    }catch (e){
        next(e);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const result = await userService.forgotPassword(req.body);
        res.status(200).json({
            data: result,
            message : "OTP has been sent"
        });
    }catch (e){
        next(e);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const result = await userService.resetPassword(req.body);
        res.status(200).json({
            data: result,
            message : "Reset Successfully"
        });
    }catch (e){
        next(e);
    }
}

const validateOtp = async (req, res, next) => {
    try{
        await userService.validateOtp(req)
        res.status(200).json({
            message: "OTP Is valid",
        })
    }catch (e){
        next(e);
    }
}

export default {register, login, get, getAll, logout, changeUsername, changePassword, forgotPassword, resetPassword, validateOtp};