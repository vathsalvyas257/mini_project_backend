const Joi = require("joi");
const mongoose = require("mongoose");

const tournamentValidationSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    sportType: Joi.string().valid("kabaddi", "hockey", "cricket").required(),
    description: Joi.string().max(500).required(),
    startDate: Joi.date().greater("now").required() , // Ensure start date is in the future
    status: Joi.string().valid("Upcoming", "Ongoing", "Completed").default("Upcoming"),
    image: Joi.string().optional(), // Changed from `uri()` to allow file paths
    registeredTeams: Joi.array().items(
        Joi.object({
            team: Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            }, "MongoDB ObjectId validation").optional(),
            status: Joi.string().valid("Pending", "Accepted", "Rejected").default("Pending"),
            registeredAt: Joi.date().default(() => new Date()),
        })
    ).optional(),
    createdBy: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }, "MongoDB ObjectId validation").optional(),
});

module.exports = tournamentValidationSchema ; // Fix export structure
