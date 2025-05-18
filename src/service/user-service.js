import {validate} from "../validation/validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt";
import 'dotenv/config'
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {emailValidation, loginValidation, registerUserValidation} from "../validation/user-validation.js";

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
            firstName : user.firstName,
            lastName : user.lastName,
        },
        select: {
            id : true,
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
        throw new ResponseError(401, "Email or password is incorrect");
    }

    if (!await bcrypt.compare(request.password, user.password)) {
        throw new ResponseError(401, "Password does not match");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY );

    return token;
}

const get = async (req) => {
    const user = await prismaClient.user.findUnique({ where: { id: req.user.id }, select: {
            id : true,
            email: true,
            firstName: true,
            lastName: true,
        } });

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
          firstName : req.body.firstName,
          lastName : req.body.lastName,
        },select : {
            id :true,
            email: true,
            firstName : true,
            lastName : true,
        }
    })
}

const changePassword = async (id, req) => {
    const user = await prismaClient.user.findUnique({ where: { id: id } });
    if (!user) {
        throw new ResponseError(403, "User does not exist");
    }

    if (req.body.password !== req.body.confirmPassword) {
        throw new ResponseError(403, "Password does not match");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    return prismaClient.user.update({
        where: {
            id: id,
        },data : {
            password: hashedPassword,
        },select : {
            email: true,
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
            otpExpiredAt: otpExpire,
        }
    });

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: '"Listify" <process.end.EMAIL>',
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP for resetting the password is ${otp}. It is valid for 1 minutes.`,
        html: `<p>Your OTP for resetting the password is <b>${otp}</b>. It is valid for 1 minutes.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new ResponseError(500, "Failed to send OTP email");
    }

}

const validateOtp = async (request) => {
    const otp = request.body.otp;
    const user = await prismaClient.user.findUnique({
        where:{
            otp : otp
        }
    })

    if(!user) {
        throw new ResponseError(403, "Otp Incorrect");
    }
}

const resetPassword = async (request) => {
    const newPassword = request.newPassword
    const confirmPassword = request.confirmPassword
    const email = request.email;

    if (!newPassword || !confirmPassword || !email) {
        throw new ResponseError(400, "Invalid input");
    }

    if (newPassword !== confirmPassword) {
        throw new ResponseError(400, "Passwords do not match");
    }


    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return  prismaClient.user.update({
            where: {
                email: email,
            },
            data: {
                password: hashedPassword
            },select : {
                id : true,
                username: true,
            }
        });
    } catch (error) {
        throw new ResponseError(500, "Failed to reset password");
    }
}


export default { register, login, get, changePassword, changeUsername , forgotPassword, validateOtp, resetPassword};
