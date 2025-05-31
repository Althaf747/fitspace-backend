import Joi from "joi";

const createValidation = Joi.object({
    name: Joi.string().max(100).required(),
    phone_number: Joi.string().max(100).required(),
    street: Joi.string().max(100).required(),
    district: Joi.string().max(100).required(),
    city_or_regency: Joi.string().max(100).required(),
    province: Joi.string().max(100).required(),
    postal_code: Joi.string().max(100).required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
})

const updateValidation = Joi.object({
    name: Joi.string().max(100),
    phone_number: Joi.string().max(100),
    street: Joi.string().max(100),
    district: Joi.string().max(100),
    city_or_regency: Joi.string().max(100),
    province: Joi.string().max(100),
    postal_code: Joi.string().max(100),
    latitude: Joi.number(),
    longitude: Joi.number(),
    rating : Joi.number().min(0),
})
export { createValidation,updateValidation }