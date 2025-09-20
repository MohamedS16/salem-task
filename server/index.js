const connectDB = require('./config/db');
const createApp = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const app = createApp();

const startServer = async () => {
    try {
        await connectDB();
        
        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
        
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();