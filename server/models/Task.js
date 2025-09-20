const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    description : {type : String, required : true },
    employeeId : {type : mongoose.Schema.Types.ObjectId, required : true },
    from : {type : Date, required : true },
    to : {type : Date, required : true }
})

const taskModel = mongoose.model('Task',TaskSchema);

module.exports = taskModel;