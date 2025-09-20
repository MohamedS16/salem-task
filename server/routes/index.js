const express = require('express');
const router = express.Router();
const tasksRoutes = require('./tasksRoutes');
const usersRoutes = require('./usersRoutes');

router.use('/v1/tasks', tasksRoutes);
router.use('/v1/users', usersRoutes);


module.exports = router;