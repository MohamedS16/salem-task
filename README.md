Salem Ventures TaskFlow Manager
A full-stack task management application for tracking employee daily tasks and allocations.

Prerequisites:

Node.js (v21 or higher)
MongoDB
Nodemon (install globally: npm install -g nodemon)

Project Structure
  repo/
  ├── client/          # React frontend
  └── server/          # Node.js/Express backend

Setup Instructions
1. Backend Setup
  # Navigate to server directory
  cd server
  
  # Install dependencies
  npm install
  
  # Create a .env file in server directory with(or remove .example from the example file i left it to help):
  MONGODB_URI=mongodb://localhost:27017/taskmanager
  PORT=5000
  
  # Start the backend server
  nodemon start index.js

2. Frontend Setup
  # Navigate to client directory
  cd client
  
  # Install dependencies
  npm install
  
  # Start the frontend development server
  npm run dev

3. Database Setup
  Make sure MongoDB is running on your system
  Create users manually (as it was Not Required in the task) in MongoDB with this schema:
  {
    name: { type: String, required: true }
  }

Usage: 
Access the application: Open http://localhost:5173 in your browser
Create tasks: Use the "Create New Task" button to add tasks
View allocations: Switch between individual employee views and team overview
Manage tasks: Edit or delete tasks using the action buttons

API Endpoints
GET /api/v1/tasks - Get all tasks with user details
POST /api/v1/tasks - Create a new task
PATCH /api/v1/tasks - Update a task
DELETE /api/v1/tasks - Delete a task
GET /api/v1/users - Get all users
POST /api/v1/users - Get users with allocation data

Technologies Used
Frontend: React, TypeScript, Tailwind CSS, React Query
Backend: Node.js, Express, MongoDB, Mongoose
Development: Vite, Nodemon
