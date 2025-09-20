const express = require('express');
const router = express.Router();
const {getAllUsers,getAllUsersWithAllocatedHours} = require('./../controllers/usersController.js');
const asyncWrapper = require('./../utils/asyncWrapper.js');


router.route('/')
    .post(asyncWrapper(getAllUsersWithAllocatedHours))
    .get(asyncWrapper(getAllUsers))


module.exports = router;