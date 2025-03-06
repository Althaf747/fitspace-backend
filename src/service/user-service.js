import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import 'dotenv/config'
import jwt from "jsonwebtoken";

const register = async (req) => {
    const user = validate(registerUserValidation, req);

    const existingUser = await prismaClient.user.findUnique({ where: { email: user.email } });
    if (existingUser) {
        throw new ResponseError(400, "User already exists");
    }

    if (user.password !== user.confirmPassword) {
        throw new ResponseError(403, "Password does not match");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: {
            email: user.email,
            password: user.password,
        },
        select: {
            email: true,
        }
    });
}

const login = async (req) => {
    const request = validate(loginValidation, req);

    const user = await prismaClient.user.findUnique({
        where: {
            email: request.email,
        }
    });

    if (!user) {
        throw new ResponseError(403, "Email or password is incorrect");
    }

    if (!await bcrypt.compare(request.password, user.password)) {
        throw new ResponseError(403, "Password does not match");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;
}

const get = async (id) => {
    const user = await prismaClient.user.findUnique({ where: { id: id } });
    if (!user) {
        throw new ResponseError(403, "User does not exist");
    }
    return user;
}

const changeUsername = async (id, req) => {
    const user = await prismaClient.user.findUnique({ where: { id: id } });
    if (!user) {
        throw new ResponseError(403, "User does not exist");
    }

    return prismaClient.user.update({
        where: {
            id: id,
        },
        data :{
          firstName : req.firstName,
          lastName : req.lastName,
        }
    })
}

const changePassword = async (id, req) => {
    const user = await prismaClient.user.findUnique({ where: { id: id } });
    if (!user) {
        throw new ResponseError(403, "User does not exist");
    }

    if (req.password !== req.confirmPassword) {
        throw new ResponseError(403, "Password does not match");
    }

    const hashedPassword = await bcrypt.hash(req.password, 10);
    return prismaClient.user.update({
        where: {
            id: id,
        },data : {
            password: hashedPassword,
        }
    })
}

const forgotPassword = async (request) => {
    const {email} = validate(emailValidation, request);

    const user = await prismaClient.user.findUnique({
        where :{
            email : email
        },
        select:{
            id : true,
            email: true,
        }
    })

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpire = new Date();
    otpExpire.setMinutes(otpExpire.getMinutes() + 1);

    await prismaClient.user.update({
        where: {
            email: email,
        },
        data: {
            otp: otp,
            // otpExpire: otpExpire,
        }
    });


export default { register, login, get, changePassword, changeUsername };
