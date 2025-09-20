const Task = require('./../models/Task');
const responseHandler = require('./../middlewares/responseHandler');
const throwNormalError = require('./../utils/throwNormalError');

const addNewTask = async(req,res)=>{
    const newTaskData = await req.body;

    await Task.create(newTaskData);

    responseHandler(res,{ status : 201, message : "success", data : "Task Created Successfully"});
}
const getAllTasks = async(req,res)=>{
    const allTasks = await Task.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: {
          path: '$userDetails',
        }
      }
    ]);
    responseHandler(res,{ status : 200, message : "success", data : allTasks});

}
const deleteTask = async(req,res)=>{
    const {taskId} = req.body;
    const deleteTaskAction = await Task.deleteOne({_id : taskId})
    console.log(deleteTaskAction.deletedCount);
    if(deleteTaskAction.deletedCount == 0)throw(throwNormalError(['No Tasks Deleted']));

    responseHandler(res,{ status : 200, message : "success", data : "Task Deleted Successfully"});
}
const updateTask = async(req,res)=>{
    const newData = await req.body;
    
    const updatedTask = await Task.findByIdAndUpdate(
        newData.taskId,
        newData
    );

    if(updatedTask.updatedCount == 0)throw(throwNormalError(['No Tasks Updated']));

    responseHandler(res,{ status : 200, message : "success", data : "Task Updated Successfully"});
}

module.exports = {
    addNewTask,
    deleteTask,
    getAllTasks,
    updateTask
}