const Joi = require('joi');

const userScheme = Joi.object({
    id: Joi.number().integer().required(),
    firstName: Joi.string().min(1).required(),
    secondName: Joi.string().min(1).required(),
    age: Joi.number().integer().min(0).max(150).required(),
    city: Joi.string().min(1),
});
const idScheme =Joi.object({
    id: Joi.number().integer().required(),
});

module.exports = {
    userScheme,      
    idScheme
};