import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Activity,
  CreditCard,
  Info,
  Edit,
  Archive,
  Trash2,
  ArchiveRestore,
  UserCheck,
  Shield,
} from "lucide-react";
import { AddCreditsDialog } from "./AddCreditsDialog";
import { UserEditDialog } from "./UserEditDialog";
import { UserData, UserTotalCredits } from "@/types/admin";
import {
  useAdminUsers,
  useArchiveUser,
  useUnarchiveUser,
  useDeleteUser,
} from "@/hooks/useAdminUsers";

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [bonusCredits, setBonusCredits] = useState<Record<string, any[]>>({});
  const [loadingBonusCredits, setLoadingBonusCredits] = useState<
    Record<string, boolean>
  >({});

  // Use the existing hook for fetching users
  const { data, isLoading, error, refetch } = useAdminUsers({
    page: currentPage,
    pageSize,
    search: searchTerm,
    status: activeTab,
  });

  // Mutation hooks
  const archiveUserMutation = useArchiveUser();
  const unarchiveUserMutation = useUnarchiveUser();
  const deleteUserMutation = useDeleteUser();

  const users = data?.users || [];
  const totalUsers = data?.total || 0;
  const stats = data?.stats;
  const totalPages = Math.ceil(totalUsers / pageSize);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Debug selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      console.log("UserManagement - selectedUser updated:", selectedUser);
    }
  }, [selectedUser]);

  // Update selectedUser when users data changes
  useEffect(() => {
    if (selectedUser && users.length > 0) {
      const updatedUser = users.find((u) => u.user_id === selectedUser.user_id);
      if (
        updatedUser &&
        JSON.stringify(updatedUser) !== JSON.stringify(selectedUser)
      ) {
        console.log(
          "UserManagement - Updating selectedUser with fresh data:",
          updatedUser
        );
        setSelectedUser(updatedUser);
      }
    }
  }, [users, selectedUser]);

  const handleAddCredits = (user: UserData) => {
    setSelectedUser(user);
    setShowAddCredits(true);
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  const handleArchiveUser = async (user: UserData) => {
    try {
      await archiveUserMutation.mutateAsync(user.user_id);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleUnarchiveUser = async (user: UserData) => {
    try {
      await unarchiveUserMutation.mutateAsync(user.user_id);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    try {
      await deleteUserMutation.mutateAsync(user.user_id);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const fetchBonusCredits = async (userId: string) => {
    if (bonusCredits[userId] || loadingBonusCredits[userId]) return;

    setLoadingBonusCredits((prev) => ({ ...prev, [userId]: true }));

    try {
      const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(
        `${backendBaseUrl}/api/admin/users/${userId}/bonus-credits`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.code === 0) {
          setBonusCredits((prev) => ({
            ...prev,
            [userId]: result.result.bonusCredits || [],
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching bonus credits:", error);
    } finally {
      setLoadingBonusCredits((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getUserCredits = (userId: string) => {
    const user = users.find((u) => u.user_id === userId);
    if (!user) return null;

    return {
      user_id: userId,
      total_credits: user.total_credits || 0,
      subscription_credits: user.subscription_credits || 0,
      extra_credits: user.extra_credits || 0,
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRemainingDays = (user: UserData) => {
    if (user.subscription_status !== "active" || !user.current_period_end) {
      return null;
    }

    const endDate = new Date(user.current_period_end);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 ";
      case "inactive":
        return "bg-gray-100 text-gray-800 ";
      case "cancelled":
        return "bg-red-100 text-red-800 ";
      default:
        return "bg-gray-100 text-gray-800 ";
    }
  };

  const getUserStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 ";
      case "inactive":
        return "bg-red-100 text-red-800 ";
      default:
        return "bg-gray-100 text-gray-800 ";
    }
  };

  const getPlanDisplayName = (planName: string, status: string) => {
    if (!planName || planName === "No Plan" || status === "inactive") {
      return "No Plan";
    }
    return planName;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Error loading users
          </h3>
          <p className="text-muted-foreground mb-4">
            Failed to load users. Please try again.
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{stats?.activeUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Subscriptions</p>
                <p className="text-2xl font-bold">
                  {stats?.paidSubscriptions || 0} /{" "}
                  {stats?.freeSubscriptions || 0}
                </p>
                <p className="text-xs text-muted-foreground">Paid / Free</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-2xl font-bold">{stats?.newThisMonth || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Box */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="font-medium">{totalUsers} users</span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="active"
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="w-[400px] grid grid-cols-2">
              <TabsTrigger value="active" className="text-sm">
                <Users className="h-4 w-4 mr-2" />
                Active Users
              </TabsTrigger>
              <TabsTrigger value="inactive" className="text-sm">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-muted/50">
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Created</TableHead>
                      <TableHead className="font-semibold">
                        Subscription
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">
                        Days Remaining
                      </TableHead>
                      <TableHead className="font-semibold">Credits</TableHead>
                      <TableHead className="font-semibold">Usage</TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading
                      ? // Loading skeleton
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="animate-pulse">
                                <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                                <div className="h-3 bg-muted rounded w-24"></div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse h-4 bg-muted rounded w-16"></div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse h-6 bg-muted rounded w-16"></div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse h-4 bg-muted rounded w-12"></div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse h-4 bg-muted rounded w-16"></div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse h-6 bg-muted rounded w-16"></div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse h-4 bg-muted rounded w-12"></div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse space-y-1">
                                <div className="h-4 bg-muted rounded w-16"></div>
                                <div className="h-3 bg-muted rounded w-20"></div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse space-y-1">
                                <div className="h-3 bg-muted rounded w-12"></div>
                                <div className="h-3 bg-muted rounded w-14"></div>
                                <div className="h-3 bg-muted rounded w-10"></div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end space-x-2">
                                <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      : users.map((user) => {
                          const credits = getUserCredits(user.user_id);
                          const planName = getPlanDisplayName(
                            user.subscription_plan_name,
                            user.subscription_status
                          );
                          const remainingDays = getRemainingDays(user);
                          return (
                            <TableRow
                              key={user.user_id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium text-foreground">
                                    {user.firstName && user.lastName
                                      ? `${user.firstName} ${user.lastName}`
                                      : user.email}
                                  </span>
                                  {user.firstName && user.lastName && (
                                    <span className="text-sm text-muted-foreground">
                                      {user.email}
                                    </span>
                                  )}
                                  {user.contactNumber && (
                                    <span className="text-xs text-muted-foreground">
                                      {user.contactNumber}
                                    </span>
                                  )}
                                  {user.isAdmin && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Shield className="h-3 w-3 text-amber-500" />
                                      <span className="text-xs font-medium text-amber-600 ">
                                        Admin
                                      </span>
                                    </div>
                                  )}
                                  {user.isEditor && !user.isAdmin && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Shield className="h-3 w-3 text-blue-500" />
                                      <span className="text-xs font-medium text-blue-600 ">
                                        Editor
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDate(user.created_at)}
                              </TableCell>
                              <TableCell>
                                <span className="font-medium">{planName}</span>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${getUserStatusBadgeColor(
                                    user.status || "inactive"
                                  )} border-0`}
                                >
                                  {user.status || "inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {remainingDays !== null ? (
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <span
                                      className={`font-medium ${
                                        remainingDays <= 7
                                          ? "text-red-600"
                                          : remainingDays <= 30
                                          ? "text-yellow-600"
                                          : "text-green-600"
                                      }`}
                                    >
                                      {remainingDays} days
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    Total:{" "}
                                    {(user.total_credits || 0).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Plan:{" "}
                                    {(
                                      user.subscription_credits || 0
                                    ).toLocaleString()}{" "}
                                    |
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span
                                            className="cursor-help inline-flex items-center space-x-1"
                                            onMouseEnter={() =>
                                              fetchBonusCredits(user.user_id)
                                            }
                                          >
                                            <span>
                                              Extra:{" "}
                                              {(
                                                user.extra_credits || 0
                                              ).toLocaleString()}
                                            </span>
                                            {(user.extra_credits || 0) > 0 && (
                                              <Info className="h-3 w-3 text-blue-500" />
                                            )}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                          {loadingBonusCredits[user.user_id] ? (
                                            <div className="text-sm">
                                              Loading bonus credits...
                                            </div>
                                          ) : bonusCredits[user.user_id]
                                              ?.length > 0 ? (
                                            <div className="space-y-2">
                                              <div className="font-medium text-sm">
                                                Bonus Credits:
                                              </div>
                                              {bonusCredits[user.user_id].map(
                                                (credit, index) => (
                                                  <div
                                                    key={credit.id || index}
                                                    className="text-xs space-y-1"
                                                  >
                                                    <div className="font-medium">
                                                      +{credit.amount} credits
                                                    </div>
                                                    {credit.reason && (
                                                      <div className="text-muted-foreground">
                                                        Reason: {credit.reason}
                                                      </div>
                                                    )}
                                                    {credit.expiresAt && (
                                                      <div className="text-muted-foreground">
                                                        Expires:{" "}
                                                        {new Date(
                                                          credit.expiresAt
                                                        ).toLocaleDateString()}
                                                      </div>
                                                    )}
                                                    <div className="text-muted-foreground">
                                                      Added:{" "}
                                                      {new Date(
                                                        credit.createdAt
                                                      ).toLocaleDateString()}
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          ) : (
                                            <div className="text-sm">
                                              No bonus credits found
                                            </div>
                                          )}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="cursor-help">
                                        <div className="text-sm font-medium text-gray-900 ">
                                          {(
                                            (user.total_used || 0) +
                                            (user.held_credits || 0)
                                          ).toLocaleString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          Total Usage
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <div className="space-y-2">
                                        <div className="font-medium text-sm">
                                          Usage Breakdown:
                                        </div>
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">
                                              Used Credits:
                                            </span>
                                            <span className="font-medium text-green-600 ">
                                              {(
                                                user.total_used || 0
                                              ).toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">
                                              Held Credits:
                                            </span>
                                            <span className="font-medium text-amber-600 ">
                                              {(
                                                user.held_credits || 0
                                              ).toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="border-t pt-1 mt-1">
                                            <div className="flex justify-between text-xs font-medium">
                                              <span>Total Usage:</span>
                                              <span className="text-gray-900 ">
                                                {(
                                                  (user.total_used || 0) +
                                                  (user.held_credits || 0)
                                                ).toLocaleString()}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleAddCredits(user)}
                                    className="hover:bg-blue-50 hover:border-blue-200 "
                                    title="Add Credits"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleEditUser(user)}
                                    className="hover:bg-purple-50 hover:border-purple-200 "
                                    title="Edit User"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="hover:bg-red-50 hover:border-red-200 "
                                        title="Archive User"
                                      >
                                        <Archive className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Archive User
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to archive this
                                          user? The user will not be able to
                                          login until unarchived.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleArchiveUser(user)
                                          }
                                        >
                                          Archive
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="inactive">
              <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-muted/50">
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Created</TableHead>
                      <TableHead className="font-semibold">
                        Subscription
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">
                        Days Remaining
                      </TableHead>
                      <TableHead className="font-semibold">Credits</TableHead>
                      <TableHead className="font-semibold">Usage</TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading
                      ? // Loading skeleton
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="animate-pulse">
                                <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                                <div className="h-3 bg-muted rounded w-24"></div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse h-4 bg-muted rounded w-20"></div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse h-4 bg-muted rounded w-16"></div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse h-6 bg-muted rounded w-16"></div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse h-6 bg-muted rounded w-16"></div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse h-4 bg-muted rounded w-12"></div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse space-y-1">
                                <div className="h-4 bg-muted rounded w-16"></div>
                                <div className="h-3 bg-muted rounded w-20"></div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="animate-pulse space-y-1">
                                <div className="h-3 bg-muted rounded w-12"></div>
                                <div className="h-3 bg-muted rounded w-14"></div>
                                <div className="h-3 bg-muted rounded w-10"></div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end space-x-2">
                                <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      : users.map((user) => {
                          const credits = getUserCredits(user.user_id);
                          const planName = getPlanDisplayName(
                            user.subscription_plan_name,
                            user.subscription_status
                          );
                          const remainingDays = getRemainingDays(user);
                          return (
                            <TableRow
                              key={user.user_id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium text-foreground">
                                    {user.firstName && user.lastName
                                      ? `${user.firstName} ${user.lastName}`
                                      : user.email}
                                  </span>
                                  {user.firstName && user.lastName && (
                                    <span className="text-sm text-muted-foreground">
                                      {user.email}
                                    </span>
                                  )}
                                  {user.contactNumber && (
                                    <span className="text-xs text-muted-foreground">
                                      {user.contactNumber}
                                    </span>
                                  )}
                                  {user.isAdmin && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Shield className="h-3 w-3 text-amber-500" />
                                      <span className="text-xs font-medium text-amber-600 ">
                                        Admin
                                      </span>
                                    </div>
                                  )}
                                  {user.isEditor && !user.isAdmin && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Shield className="h-3 w-3 text-blue-500" />
                                      <span className="text-xs font-medium text-blue-600 ">
                                        Editor
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDate(user.created_at)}
                              </TableCell>
                              <TableCell>
                                <span className="font-medium">{planName}</span>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${getStatusBadgeColor(
                                    user.subscription_status || "inactive"
                                  )} border-0`}
                                >
                                  {user.subscription_status || "inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${getUserStatusBadgeColor(
                                    user.status || "inactive"
                                  )} border-0`}
                                >
                                  {user.status || "inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {remainingDays !== null ? (
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <span
                                      className={`font-medium ${
                                        remainingDays <= 7
                                          ? "text-red-600"
                                          : remainingDays <= 30
                                          ? "text-yellow-600"
                                          : "text-green-600"
                                      }`}
                                    >
                                      {remainingDays} days
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    Total:{" "}
                                    {(user.total_credits || 0).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Plan:{" "}
                                    {(
                                      user.subscription_credits || 0
                                    ).toLocaleString()}{" "}
                                    |
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span
                                            className="cursor-help inline-flex items-center space-x-1"
                                            onMouseEnter={() =>
                                              fetchBonusCredits(user.user_id)
                                            }
                                          >
                                            <span>
                                              Extra:{" "}
                                              {(
                                                user.extra_credits || 0
                                              ).toLocaleString()}
                                            </span>
                                            {(user.extra_credits || 0) > 0 && (
                                              <Info className="h-3 w-3 text-blue-500" />
                                            )}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                          {loadingBonusCredits[user.user_id] ? (
                                            <div className="text-sm">
                                              Loading bonus credits...
                                            </div>
                                          ) : bonusCredits[user.user_id]
                                              ?.length > 0 ? (
                                            <div className="space-y-2">
                                              <div className="font-medium text-sm">
                                                Bonus Credits:
                                              </div>
                                              {bonusCredits[user.user_id].map(
                                                (credit, index) => (
                                                  <div
                                                    key={credit.id || index}
                                                    className="text-xs space-y-1"
                                                  >
                                                    <div className="font-medium">
                                                      +{credit.amount} credits
                                                    </div>
                                                    {credit.reason && (
                                                      <div className="text-muted-foreground">
                                                        Reason: {credit.reason}
                                                      </div>
                                                    )}
                                                    {credit.expiresAt && (
                                                      <div className="text-muted-foreground">
                                                        Expires:{" "}
                                                        {new Date(
                                                          credit.expiresAt
                                                        ).toLocaleDateString()}
                                                      </div>
                                                    )}
                                                    <div className="text-muted-foreground">
                                                      Added:{" "}
                                                      {new Date(
                                                        credit.createdAt
                                                      ).toLocaleDateString()}
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          ) : (
                                            <div className="text-sm">
                                              No bonus credits found
                                            </div>
                                          )}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="cursor-help">
                                        <div className="text-sm font-medium text-gray-900 ">
                                          {(
                                            (user.total_used || 0) +
                                            (user.held_credits || 0)
                                          ).toLocaleString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          Total Usage
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <div className="space-y-2">
                                        <div className="font-medium text-sm">
                                          Usage Breakdown:
                                        </div>
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">
                                              Used Credits:
                                            </span>
                                            <span className="font-medium text-green-600 ">
                                              {(
                                                user.total_used || 0
                                              ).toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">
                                              Held Credits:
                                            </span>
                                            <span className="font-medium text-amber-600 ">
                                              {(
                                                user.held_credits || 0
                                              ).toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="border-t pt-1 mt-1">
                                            <div className="flex justify-between text-xs font-medium">
                                              <span>Total Usage:</span>
                                              <span className="text-gray-900 ">
                                                {(
                                                  (user.total_used || 0) +
                                                  (user.held_credits || 0)
                                                ).toLocaleString()}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleAddCredits(user)}
                                    className="hover:bg-blue-50 hover:border-blue-200 "
                                    title="Add Credits"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleEditUser(user)}
                                    className="hover:bg-purple-50 hover:border-purple-200 "
                                    title="Edit User"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="hover:bg-green-50 hover:border-green-200 "
                                        title="Unarchive User"
                                      >
                                        <ArchiveRestore className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Unarchive User
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to unarchive
                                          this user? The user will be able to
                                          login again.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleUnarchiveUser(user)
                                          }
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          Unarchive
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="hover:bg-red-50 hover:border-red-200 "
                                        title="Delete User"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete User
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to permanently
                                          delete this user? This action cannot
                                          be undone and will remove all user
                                          data.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteUser(user)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {!isLoading && users.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No users found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search term."
              : "No users available."}
          </p>
        </div>
      )}

      <AddCreditsDialog
        open={showAddCredits}
        onOpenChange={setShowAddCredits}
        user={selectedUser}
        onSuccess={() => {
          refetch();
          setShowAddCredits(false);
        }}
      />
      <UserEditDialog
        open={showEditUser}
        onOpenChange={setShowEditUser}
        user={selectedUser}
        onSuccess={() => {
          refetch();
          setShowEditUser(false);
        }}
      />
    </div>
  );
};
