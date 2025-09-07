interface TasksEmptyStateProps {
  totalTasks: number;
  filteredCount: number;
  onClearFilters: () => void;
  onCreateTaskClick?: () => void; // ✅ Add this
}

export const TasksEmptyState = ({
  totalTasks,
  filteredCount,
  onClearFilters,
  onCreateTaskClick, // ✅ Destructure it
}: TasksEmptyStateProps) => {
  const noTasks = totalTasks === 0;
  const hasFilters = filteredCount !== totalTasks;

  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">📋</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {noTasks ? 'No tasks found' : 'No tasks match your filters'}
      </h3>
      <p className="text-[16px] text-[#5f6368] ">
        <button
          onClick={onCreateTaskClick}
          className="text-[#1a73e8] hover:underline font-medium"
        >
          Create your first task
        </button>{" "}
        to get started with link indexing.
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};
