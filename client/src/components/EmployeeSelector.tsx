import React from 'react';
import type { User } from '../types';

interface EmployeeSelectorProps {
  users: User[];
  selectedEmployee: string;
  onSelectEmployee: (employeeId: string) => void;
  loading?: boolean;
}

export const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  users,
  selectedEmployee,
  onSelectEmployee,
  loading
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">Select Employee</h2>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectEmployee('')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedEmployee === '' 
              ? 'bg-blue-100 text-blue-800 border border-blue-300' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All Employees
        </button>
        
        {users.map(user => (
          <button
            key={user._id}
            onClick={() => onSelectEmployee(user._id)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedEmployee === user._id
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {user.name}
          </button>
        ))}
      </div>
    </div>
  );
};