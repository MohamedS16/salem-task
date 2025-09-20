const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const createApp = () => {
    const app = express();
    
    app.use(cors());
    app.use(express.json());
    app.use(morgan('tiny'));
    
    
    app.use('/api', routes);
    
    
    app.use('/', (req, res) => {
        res.status(404).json({
            success: false,
            message: `Route ${req.originalUrl} not found`,
            data: null
        });
    });
    
    
    app.use(errorHandler);
    
    return app;
};

module.exports = createApp;