import React, { useState } from 'react';
import { useTasks, useUsers, useDailySummary, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useApi';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { EmployeeSelector } from '../components/EmployeeSelector';
import { UsersAllocationReport } from '../components/UsersAllocationReport';
import { Header } from '../components/Header';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import type { Task, CreateTaskData, User } from '../types/index';

export const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: tasks = [], isLoading: tasksLoading, refetch: refetchTasks } = useTasks();
  
  const today = new Date().toISOString().split('T')[0];
  const { data: dailySummary } = useDailySummary(selectedEmployee, today);

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const selectedEmployeeData = users.find((user: User) => user._id === selectedEmployee);

  const filteredTasks = selectedEmployee 
    ? tasks.filter((task: Task) => task.employeeId === selectedEmployee)
    : tasks;

  const employeeCount = React.useMemo(() => {
    const uniqueEmployeeIds = new Set(tasks.map((task: Task) => task.employeeId));
    return uniqueEmployeeIds.size;
  }, [tasks]);

  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      await createTaskMutation.mutateAsync(taskData);
      setIsFormOpen(false);
      refetchTasks();
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateTask = async (taskData: CreateTaskData) => {
    if (editingTask) {
      try {
        await updateTaskMutation.mutateAsync({
          taskId: editingTask._id,
          ...taskData
        });
        setEditingTask(null);
        setIsFormOpen(false);
        refetchTasks();
      } catch (error) {
        throw error;
      }
    }
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTaskMutation.mutateAsync({ taskId: taskToDelete._id });
        refetchTasks();
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = editingTask ? handleUpdateTask : handleCreateTask;

  const calculatedSummary = React.useMemo(() => {
    if (dailySummary && selectedEmployee) {
      return dailySummary;
    }
    
    const employeeTasks = selectedEmployee 
      ? tasks.filter((task: Task) => task.employeeId === selectedEmployee)
      : tasks;
    
    const totalHours = employeeTasks.reduce((total: number, task: Task) => {
      const start = new Date(task.from);
      const end = new Date(task.to);
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
    
    const totalAvailableHours = selectedEmployee ? 8 : employeeCount * 8;
    
    return {
      totalAllocatedHours: totalHours,
      remainingHours: Math.max(0, totalAvailableHours - totalHours),
      taskCount: employeeTasks.length,
      totalAvailableHours,
      employeeCount
    };
  }, [dailySummary, tasks, selectedEmployee, employeeCount]);

  if (usersLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'allocation':
        return <UsersAllocationReport />;
      
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Task Management Dashboard</h1>
                <p className="text-gray-600">Manage and track employee tasks efficiently</p>
              </div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                + Create New Task
              </button>
            </div>

            <EmployeeSelector
              users={users}
              selectedEmployee={selectedEmployee}
              onSelectEmployee={setSelectedEmployee}
              loading={usersLoading}
            />



            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedEmployee 
                    ? `Tasks for ${selectedEmployeeData?.name || 'Selected Employee'}`
                    : 'All Tasks'
                  }
                </h2>
                
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                </span>
              </div>

              <TaskList
                tasks={filteredTasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteClick}
                loading={tasksLoading}
              />
            </div>

            <TaskForm
              open={isFormOpen}
              onOpenChange={(open) => {
                setIsFormOpen(open);
                if (!open) setEditingTask(null);
              }}
              onSubmit={handleFormSubmit}
              users={users}
              editTask={editingTask}
              dailySummary={selectedEmployee ? calculatedSummary : undefined}
              loading={createTaskMutation.isPending || updateTaskMutation.isPending}
            />

            <DeleteConfirmationModal
              open={isDeleteModalOpen}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
              task={taskToDelete}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="container mx-auto px-6 py-8">
        {renderCurrentView()}
      </div>
    </div>
  );
};