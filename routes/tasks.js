const router = require('express').Router();
const { validate } = require('express-validation');
const { isAuth } = require('../middlewares/authentication');
const { createTask, updateTask, sortedTasks, deleteTask } = require('../validations/tasks');

const TASKS_CONTROLLER = require('../controllers/tasks');

/**
 * Tasks routes
 */
router.get('/', isAuth(), TASKS_CONTROLLER.getTasks);
router.post('/', isAuth(), validate(createTask, { context: true }), TASKS_CONTROLLER.createTask);
router.post('/sort', isAuth(), validate(sortedTasks, { context: true }), TASKS_CONTROLLER.sortedTasks);
router.patch('/:id', isAuth(), validate(updateTask, { context: true }), TASKS_CONTROLLER.updateTask);
router.delete('/:id', isAuth(), validate(deleteTask, { context: true }), TASKS_CONTROLLER.deleteTask);

module.exports = router;