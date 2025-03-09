import joi from "joi";

const createValidation = joi.object({
    comment: joi.string().max(255),
    rating : joi.number().min(0).required(),
})

const updateValidation = joi.object({
    comment: joi.string().max(255),
    rating : joi.number().min(0),
})

export { createValidation, updateValidation }