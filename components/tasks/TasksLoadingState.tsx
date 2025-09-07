
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const TasksLoadingState = () => {
  return (
    <div className="space-y-4">
      {/* Table Skeleton */}
      <div className="overflow-x-auto rounded-lg border border-[#dadce0] bg-white shadow-sm">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-[#f8f9fa] text-[#5f6368] border-b border-[#dadce0]">
              <TableHead className="font-medium text-[#202124] w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead className="font-medium text-[#202124]">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="font-medium text-[#202124]">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="font-medium text-[#202124]">
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead className="font-medium text-[#202124]">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="font-medium text-[#202124]">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="font-medium text-[#202124]">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="font-medium text-[#202124] w-32">
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index} className="border-b border-[#dadce0]">
                <TableCell className="w-12">
                  <Skeleton className="h-6 w-6 rounded" />
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </TableCell>
                <TableCell className="w-32">
                  <div className="space-y-1">
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </TableCell>
                <TableCell className="w-32">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Skeleton */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};
