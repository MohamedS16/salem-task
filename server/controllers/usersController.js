const User = require('./../models/User');
const responseHandler = require('./../middlewares/responseHandler');

const getAllUsers = async(req,res)=>{
    const users = await User.find();

    responseHandler(res,{ status : 200, message : "success", data : users});
}

const getAllUsersWithAllocatedHours = async (req,res) => {
        const date = await req?.body?.date

        const targetDate = date ? new Date(date) : new Date();
        
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const result = await User.aggregate([
            {
                $lookup: {
                    from: 'tasks',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$employeeId', '$$userId'] },
                                        { $gte: ['$from', startOfDay] },
                                        { $lte: ['$from', endOfDay] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'dailyTasks'
                }
            },{
                $project: {
                    name: 1,
                    dailyTasks: 1,
                    taskCount: { $size: '$dailyTasks' },
                    totalAllocatedHours: {
                        $sum: {
                            $map: {
                                input: '$dailyTasks',
                                as: 'task',
                                in: {
                                    $divide: [
                                        { $subtract: ['$$task.to', '$$task.from'] },
                                        1000 * 60 * 60 
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $sort: { totalAllocatedHours: -1 }
            }
            
        ]);

        responseHandler(res,{ status : 200, message : "success", data : result});
};



module.exports = {
    getAllUsers,
    getAllUsersWithAllocatedHours
}