import joi  from "joi";

const createValidation = joi.object({
    type: joi.string().required(),
    date: joi.date().required(),
    timeSlot: joi.string().required(),
})

const updateValidation = joi.object({
    status : joi.string().required(),
})

export {
    createValidation, updateValidation
}