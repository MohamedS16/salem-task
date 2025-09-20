import React, { useState } from 'react';
import type { UserWithAllocation } from '../types';
import { useUsersWithAllocation } from '../hooks/useApi';

export const UsersAllocationReport: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: users = [], isLoading, error } = useUsersWithAllocation(selectedDate);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-red-500 text-center">
          Failed to load users allocation data
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Users Allocation Report</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-sm font-medium text-gray-700">Employee</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">Tasks Count</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">Hours Allocated</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">Hours Remaining</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: UserWithAllocation) => {
              const remainingHours = Math.max(0, 8 - (user.totalAllocatedHours || 0));
              
              return (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.taskCount || 0}</td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                    {(user.totalAllocatedHours || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    <span className={remainingHours === 0 ? 'text-red-600' : 'text-green-600'}>
                      {remainingHours.toFixed(2)}
                    </span>
                  </td>
                  
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No allocation data available for selected date
        </div>
      )}
    </div>
  );
};