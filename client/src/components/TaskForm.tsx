import React, { useState, useEffect } from 'react';
import type { CreateTaskData, Task, User } from '../types/index';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTaskData) => Promise<void>;
  users: User[];
  editTask?: Task | null;
  dailySummary?: {
    totalAllocatedHours: number;
    remainingHours: number;
  };
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  users,
  editTask,
  dailySummary,
  loading = false
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateTaskData>({
    employeeId: editTask?.employeeId || '',
    description: editTask?.description || '',
    from: editTask?.from ? new Date(editTask.from).toISOString().slice(0, 16) : '',
    to: editTask?.to ? new Date(editTask.to).toISOString().slice(0, 16) : '',
  });

  useEffect(() => {
    if (editTask) {
      setFormData({
        employeeId: editTask.employeeId,
        description: editTask.description,
        from: new Date(editTask.from).toISOString().slice(0, 16),
        to: new Date(editTask.to).toISOString().slice(0, 16),
      });
    }
  }, [editTask]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.employeeId) newErrors.employeeId = 'Employee is required';
    if (!formData.from) newErrors.from = 'Start time is required';
    if (!formData.to) newErrors.to = 'End time is required';
    
    if (formData.from && formData.to) {
      const fromTime = new Date(formData.from).getTime();
      const toTime = new Date(formData.to).getTime();
      
      if (toTime <= fromTime) {
        newErrors.to = 'End time must be after start time';
      }
      
      const durationHours = (toTime - fromTime) / (1000 * 60 * 60);
      if (durationHours > 8) {
        newErrors.to = 'Task duration cannot exceed 8 hours';
      }
      
      if (dailySummary && dailySummary.remainingHours < durationHours && !editTask) {
        newErrors.to = `Only ${dailySummary.remainingHours.toFixed(2)} hours remaining today`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      if (!editTask) {
        setFormData({
          employeeId: '',
          description: '',
          from: '',
          to: '',
        });
      }
    } catch (error) {
      setErrors({ submit: (error as Error).message });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {editTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        
        {dailySummary && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              Daily Summary: {dailySummary.totalAllocatedHours.toFixed(2)} hours allocated,{' '}
              {dailySummary.remainingHours.toFixed(2)} hours remaining
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee *</label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an employee</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task description"
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time *</label>
              <input
                type="datetime-local"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.from && <p className="text-red-500 text-sm mt-1">{errors.from}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Time *</label>
              <input
                type="datetime-local"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.to && <p className="text-red-500 text-sm mt-1">{errors.to}</p>}
            </div>
          </div>
          
          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editTask ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};