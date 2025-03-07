import userService from "../service/user-service.js";

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
            authorization: result,
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

export default {register, login, get, logout, changeUsername, changePassword};