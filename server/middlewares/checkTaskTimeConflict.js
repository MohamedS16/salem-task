const Task = require('./../models/Task');
const throwNormalError = require('./../utils/throwNormalError');
const { validationResult } = require('express-validator');

const checkTimeConflict = async (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) throw validationErrors;
        
        const { employeeId, from, to, taskId } = req.body;
        const taskFrom = new Date(from);
        const taskTo = new Date(to);
        
        const taskDurationHours = (taskTo - taskFrom) / (1000 * 60 * 60);
        if (taskDurationHours > 8) {
            throw throwNormalError(['Task duration cannot exceed 8 hours']);
        }
        
        const queryCondition = {
            employeeId,
            $or: [
                { from: { $lte: taskTo }, to: { $gte: taskFrom } }, 
                { from: { $gte: taskFrom }, to: { $lte: taskTo } } 
            ]
        };
        
        if (taskId) {
            const checkTaskExist = await Task.findById(taskId);
            if(!checkTaskExist)throw throwNormalError(['Task Not Found']);
            queryCondition._id = { $ne: taskId };
        }
        
        const conflictingTasks = await Task.find(queryCondition);
        
        if (conflictingTasks.length > 0) {
            throw throwNormalError(['Employee already has tasks scheduled during this time']);
        }
        
        const startOfDay = new Date(taskFrom);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(taskFrom);
        endOfDay.setHours(23, 59, 59, 999);
        
        const dailyTasksQuery = {
            employeeId,
            from: { $gte: startOfDay, $lte: endOfDay }
        };
        
        if (taskId) {
            dailyTasksQuery._id = { $ne: taskId };
        }
        
        const dailyTasks = await Task.find(dailyTasksQuery);
        
        let totalDailyDuration = taskDurationHours; 
        
        dailyTasks.forEach(task => {
            const taskStart = new Date(task.from);
            const taskEnd = new Date(task.to);
            const duration = (taskEnd - taskStart) / (1000 * 60 * 60);
            totalDailyDuration += duration;
        });
        
        if (totalDailyDuration > 8) {
            throw throwNormalError([`Total daily task duration cannot exceed 8 hours. Current daily total would be ${totalDailyDuration.toFixed(2)} hours`]);
        }
        
        next();

};

module.exports = checkTimeConflict;