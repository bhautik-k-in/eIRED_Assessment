const Joi = require('joi');
const { errorMessage } = require('../helpers/errorMessages');
const { STATUS } = require('../utils/enums');

/**
 * Create Task Validation
 */
exports.createTask = {
    body: Joi.object({
        task: Joi.string().required().min(4).max(60).messages(errorMessage('Task')),
        date: Joi.date().raw().greater(new Date()).messages(errorMessage("Date")),
    }).required()
}

/**
 * Update Task Validation
 */
exports.updateTask = {
    params: Joi.object({
        id: Joi.string().required().messages(errorMessage('ID'))
    }).required(),
    body: Joi.object({
        task: Joi.string().optional().min(4).max(60).messages(errorMessage('Task')),
        status: Joi.string().optional().valid(...Object.values(STATUS)).messages(errorMessage('Status')),
        date: Joi.date().raw().greater(new Date()).messages(errorMessage("Date")),
    }).required()
}

/**
 * Sorted Tasks Validation
 */
exports.sortedTasks = {
    body: Joi.object({
        tasks: Joi.array().items(
            Joi.object({
                id: Joi.string().required().messages(errorMessage('ID')),
                sequence: Joi.number().required().messages(errorMessage('Sequence'))
            })
        )
    })
}

/**
 * Delete Task Validation
 */
exports.deleteTask = {
    params: Joi.object({
        id: Joi.string().required().messages(errorMessage('ID'))
    }).required()
}