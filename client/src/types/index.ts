export interface User {
  _id: string;
  name: string;
  email?: string;
  department?: string;
  position?: string;
}

export interface Task {
  _id: string;
  description: string;
  employeeId: string;
  from: string;
  to: string;
  userDetails?: User;
}

export interface CreateTaskData {
  employeeId: string;
  description: string;
  from: string;
  to: string;
}

export interface UpdateTaskData extends CreateTaskData {
  taskId: string;
}

export interface UserWithAllocation extends User {
  totalAllocatedHours: number;
  taskCount: number;
}

export interface DailySummary {
  totalAllocatedHours: number;
  remainingHours: number;
  taskCount: number;
}