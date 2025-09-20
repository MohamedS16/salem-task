const {body} = require('express-validator');
const User = require('./../../models/User');

const taskValidation = ()=>{
    return [
        body('employeeId').notEmpty().withMessage('Please Choose an Employee').custom(async(value)=>{
            const userExists = await User.findById(value);
            if(!userExists)throw new Error('User Not Found');
            return true;
        }),
        body('from').isISO8601().withMessage('Valid start time is required'),
        body('to').isISO8601().withMessage('Valid end time is required').custom(async (value, { req }) => {
            if (new Date(value) <= new Date(req.body.from)) {
            throw new Error('End time must be after start time');
            }
        
            
            return true;
        })
    ]
}

module.exports = taskValidation;