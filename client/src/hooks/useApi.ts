import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }

  const data = await response.json();
  return data;
};

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiRequest('/tasks'),
    select: (data) => data.data || [],
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskData: any) => 
      apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskData: any) => 
      apiRequest('/tasks', {
        method: 'PATCH',
        body: JSON.stringify(taskData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskData: any) => 
      apiRequest('/tasks', {
        method: 'DELETE',
        body: JSON.stringify(taskData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiRequest('/users'),
    select: (data) => data.data || [],
  });
};

export const useUsersWithAllocation = (date?: string) => {
  return useQuery({
    queryKey: ['users-with-allocation', date],
    queryFn: () => 
      apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({ date: date || new Date().toISOString().split('T')[0] }),
      }),
    select: (data) => data.data || [],
  });
};

export const useDailySummary = (employeeId: string, date: string) => {
  return useQuery({
    queryKey: ['daily-summary', employeeId, date],
    queryFn: async () => {
      const response = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({ date }),
      });
      
      const users = response.data || [];
      const user = users.find((u: any) => u._id === employeeId);
      
      if (!user) {
        return {
          totalAllocatedHours: 0,
          remainingHours: 8,
          taskCount: 0
        };
      }
      
      return {
        totalAllocatedHours: user.totalAllocatedHours || 0,
        remainingHours: Math.max(0, 8 - (user.totalAllocatedHours || 0)),
        taskCount: user.taskCount || 0
      };
    },
    enabled: !!employeeId,
  });
};