import userService from './userService/user-service.js';
import e from "express";

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
            data: result,
        })
    }catch (error) {
        next(error);
    }
}

const get = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await userService.get(id);
        res.status(200).json({
            data: result,
        })
    }catch (error) {
        next(error);
    }
}

export default {register, login, get};