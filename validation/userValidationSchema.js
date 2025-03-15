const Joi = require('joi');

// Define Joi validation schema for user registration
const userValidationSchema = Joi.object({
    googleId: Joi.string().optional(), // Optional for Google users
    email: Joi.string().email().required(),
    password: Joi.when("googleId", {
        is: Joi.exist(),
        then: Joi.string().optional(),
        otherwise: Joi.string()
            .min(6)
            .max(20)
            .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$%^&*])"))
            .message("Password must contain at least one uppercase letter and one special character.")
            .required(),
    }),
    role: Joi.string().valid("admin", "player", "organizer", "coach").default("player"),
    name: Joi.string().min(3).max(50).optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    dob: Joi.date().optional(),
    gender: Joi.string().valid("male", "female", "other").optional(),
    profileImage: Joi.string().uri().optional(),
});

module.exports = userValidationSchema;
