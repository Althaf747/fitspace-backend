import joi from 'joi';

const createValidation = joi.object({
    price : joi.number().required(),
    type : joi.string().max(100).required(),
})

export {createValidation}

