import Joi from "joi";

const registerUserValidation = Joi.object({
    email: Joi.string().max(100).required(),
    password: Joi.string().min(8).max(100).required(),
    confirm_password: Joi.string().min(8).max(100).required(),
    first_name : Joi.string().min(4).max(100).required(),
    last_name : Joi.string().min(4).max(100)
});

const loginValidation = Joi.object({
    email: Joi.string().max(100).required(),
    password: Joi.string().min(8).max(100).required(),
})

const emailValidation = Joi.object({
    email: Joi.string().max(100).required(),
})

export {
    registerUserValidation, loginValidation, emailValidation
}