import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PendingTask {
  id: string;
  title: string;
  type: 'indexer' | 'checker';
  urls: string[];
  createdAt: string;
  status: 'creating';
}

interface PendingTasksContextType {
  pendingTasks: PendingTask[];
  addPendingTask: (task: Omit<PendingTask, 'id' | 'createdAt' | 'status'>) => string;
  removePendingTask: (id: string) => void;
  clearPendingTasks: () => void;
}

const PendingTasksContext = createContext<PendingTasksContextType | undefined>(undefined);

export const PendingTasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);

  const addPendingTask = (task: Omit<PendingTask, 'id' | 'createdAt' | 'status'>) => {
    const id = `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPendingTask: PendingTask = {
      ...task,
      id,
      createdAt: new Date().toISOString(),
      status: 'creating'
    };
    
    setPendingTasks(prev => [newPendingTask, ...prev]);
    return id;
  };

  const removePendingTask = (id: string) => {
    setPendingTasks(prev => prev.filter(task => task.id !== id));
  };

  const clearPendingTasks = () => {
    setPendingTasks([]);
  };

  const value: PendingTasksContextType = {
    pendingTasks,
    addPendingTask,
    removePendingTask,
    clearPendingTasks,
  };

  return (
    <PendingTasksContext.Provider value={value}>
      {children}
    </PendingTasksContext.Provider>
  );
};

export function usePendingTasks(): PendingTasksContextType {
  const context = useContext(PendingTasksContext);
  if (context === undefined) {
    throw new Error('usePendingTasks must be used within a PendingTasksProvider');
  }
  return context;
}
