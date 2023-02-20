require('moment-timezone');
const moment = require('moment');
const APIError = require('../utils/APIError');

const { excludeFields } = require('../helpers/excludeFields');
const { TASKS } = require('../config/dbConnection');
const { TIMEZONE, STATUS } = require('../utils/enums');
const { removeFields } = require('../helpers/removeFields');
const { paginate } = require('../helpers/pagination');


/**
 * @description Get all available tasks for the login user.
 * @author Bhautik Kevadiya
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Tasks lists
 */
exports.getTasks = async (req, res, next) => {
    try {
        const { user } = req;
        const { pageNum, size } = req.query;

        const condition = { user: user._id, isDeleted: false };
        let { data, pageNumber, pageSize, totalRecords, totalPages } = await paginate(TASKS, condition, pageNum, size);

        // let allTasks = await TASKS.find({ user: user._id, isDeleted: false }).sort('sequence').populate("user", "name").lean();
        if (!data.length) return res.sendJson(200, "No tasks were found");

        data.forEach(task => task.date = moment.tz(task.date, 'YYYY-MM-DD hh:mm:ss', true, TIMEZONE.INDIA).format('DD MMM, YYYY hh:mm A'));
        data = removeFields(data);
        return res.sendJson(200, "Tasks list", data, totalPages, totalRecords);
    } catch (error) {
        next(error);
    }
}

/**
 * @description Creates new task
 * @author Bhautik Kevadiya
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Created new task
 */
exports.createTask = async (req, res, next) => {
    try {
        const { task, date } = req.body;
        const { user } = req;

        const taskPayload = {
            task,
            date,
            status: STATUS.INCOMPLETE,
            user: user._id
        }
        const lastSequence = await TASKS.find({ isDeleted: false }).sort({ 'sequence': 'desc' }).limit(1);
        taskPayload.sequence = lastSequence.length ? lastSequence[0].sequence + 1 : 1;

        let newTask = await (await TASKS.create(taskPayload)).populate("user", "name");
        newTask = newTask.toObject();

        return res.sendJson(200, `${task} is created`, removeFields(newTask));
    } catch (error) {
        next(error);
    }
}

/**
 * @description Update task for a belonging user
 * @author Bhautik Kevadiya
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Updated task object
 */
exports.updateTask = async (req, res, next) => {
    try {
        let { status = null, task = null, date = new Date() } = req.body;
        const { id } = req.params;
        const { user } = req;

        const isTaskBelongsToUser = await TASKS.findOne({ _id: id, user: user._id, isDeleted: false });
        if (!isTaskBelongsToUser) throw new APIError({ status: 404, message: "Task not found" });

        if (!status) status = isTaskBelongsToUser.status;
        if (!task) task = isTaskBelongsToUser.task;
        if (!date) date = isTaskBelongsToUser.date;

        await isTaskBelongsToUser.updateOne({ status, task, date });
        const result = await TASKS.findOne({ _id: id }, { ...excludeFields() }).populate("user", "name").lean();
        result.date = moment.tz(result.date, 'YYYY-MM-DD hh:mm:ss', true, TIMEZONE.INDIA).format('DD MMM, YYYY hh:mm A');

        return res.sendJson(200, `${task} is updated successfully`, removeFields(result));
    } catch (error) {
        next(error);
    }
}

/**
 * @description Sorted tasks list 
 * @author Bhautik Kevadiya
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Sorted tasks list
 */
exports.sortedTasks = async (req, res, next) => {
    try {
        const { tasks = [] } = req.body;
        const { user } = req;

        let allTasks = await TASKS.find({ user: user._id, isDeleted: false }).lean();
        if (!allTasks.length) throw new APIError({ status: 404, message: "No tasks found" });

        if (tasks.length !== allTasks.length) throw new APIError({ status: 422, data: "Tasks IDs are missing or not added properly" });

        allTasks.forEach(task => {
            tasks.forEach(taskInner => {
                if (taskInner.id === task._id.toString()) task.sequence = taskInner.sequence
            });
        });
        await Promise.all(allTasks.map(async task => await TASKS.findOneAndUpdate({ _id: task._id }, { $set: { sequence: task.sequence } })));

        return res.sendJson(200, "updated", removeFields(allTasks));
    } catch (error) {
        next(error);
    }
}

/**
 * @description Delete a given task
 * @author Bhautik Kevadiya
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns Delete respective given task
 */
exports.deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { user } = req;

        const isTaskBelongsToUser = await TASKS.findOne({ _id: id, user: user._id, isDeleted: false });
        if (!isTaskBelongsToUser) throw new APIError({ status: 404, message: "Task not found" });

        await isTaskBelongsToUser.updateOne({ isDeleted: true });

        const allTasks = await TASKS.find({ user: user._id, isDeleted: false }).sort({ 'sequence': 'desc' });
        for (let i = 0; i < allTasks.length; i++) {
            allTasks[i].order = i + 1;
            await allTasks[i].save();
        }
        return res.sendJson(200, `${isTaskBelongsToUser.task} is deleted successfully`);
    } catch (error) {
        next(error);
    }
}
