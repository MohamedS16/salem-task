const express = require('express');
const router = express.Router();
const {addNewTask,deleteTask,getAllTasks,updateTask} = require('./../controllers/tasksController');
const asyncWrapper = require('./../utils/asyncWrapper.js');
const taskValidation = require('./../middlewares/validation/taskValidation.js');
const checkTimeConflict = require('./../middlewares/checkTaskTimeConflict.js');


router.route('/')
    .post(taskValidation(),checkTimeConflict,asyncWrapper(addNewTask))
    .delete(asyncWrapper(deleteTask))
    .get(asyncWrapper(getAllTasks))
    .patch(taskValidation(),checkTimeConflict,asyncWrapper(updateTask))


module.exports = router;