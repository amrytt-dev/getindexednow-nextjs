import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  CreditCard,
  Package,
  HelpCircle,
  Receipt,
  LayoutDashboard,
  Menu,
  X,
  ExternalLink,
  LogOut,
  BarChart3,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft,
  Shield,
  FileText,
} from "lucide-react";
import Link from "next/link";

const adminTabs = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Users },
  {
    label: "Active Subscriptions",
    path: "/admin/subscriptions",
    icon: CreditCard,
  },
  { label: "Plans", path: "/admin/plans", icon: Package },
  {
    label: "Blog Management",
    path: "/admin/blog",
    icon: FileText,
    submenu: [
      { label: "Posts", path: "/admin/blog/posts" },
      { label: "Categories", path: "/admin/blog/categories" },
      { label: "Tags", path: "/admin/blog/tags" },
    ],
  },
  { label: "FAQs", path: "/admin/faqs", icon: HelpCircle },
  { label: "Payment History", path: "/admin/payments", icon: Receipt },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
    submenu: [
      { label: "Task Status Overview", path: "/admin/reports/task-status" },
      { label: "API Logs", path: "/admin/reports/api-logs" },
    ],
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: PanelLeft,
    submenu: [
      { label: "Email Templates", path: "/admin/settings/email-templates" },
      { label: "SEO", path: "/admin/settings/seo" },
    ],
  },
  { label: "SpeedyIndex", path: "/admin/speedyindex", icon: Shield },
  { label: "VIP Task Management", path: "/admin/vip-tasks", icon: BarChart3 },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { user, logout } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const toggleSubmenu = (menuLabel: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuLabel)) {
      newExpanded.delete(menuLabel);
    } else {
      newExpanded.add(menuLabel);
    }
    setExpandedMenus(newExpanded);
  };

  const isSubmenuExpanded = (menuLabel: string) => expandedMenus.has(menuLabel);
  const isSubmenuActive = (menuPath: string) => {
    const tab = adminTabs.find((t) => t.path === menuPath);
    if (tab?.submenu) {
      return false;
    }
    return router.pathname === menuPath;
  };

  // Auto-expand submenu when on a submenu page
  useEffect(() => {
    const currentTab = adminTabs.find(
      (tab) =>
        tab.submenu &&
        tab.submenu.some((subItem) => router.pathname === subItem.path)
    );

    if (currentTab && !expandedMenus.has(currentTab.label)) {
      setExpandedMenus((prev) => new Set([...prev, currentTab.label]));
    }
  }, [router.pathname, expandedMenus]);

  // Filter tabs for editor role: allow only Blog Management
  const visibleTabs = user?.isAdmin
    ? adminTabs
    : adminTabs.filter((t) => t.label === "Blog Management");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white border-r border-gray-200 shadow-sm fixed left-0 top-0 h-full transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Logo and Toggle */}
          <div className="h-14 flex items-center px-6 border-b-2 border-gray-200">
            <div className="flex items-center justify-between w-full">
              <img src="/logo.svg" alt="GetIndexedNow Logo" className="w-48" />
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100 ml-auto"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3">
            <ul className="space-y-1">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const hasSubmenu = tab.submenu && tab.submenu.length > 0;
                const isActive = hasSubmenu
                  ? isSubmenuActive(tab.path)
                  : router.pathname === tab.path;
                const isExpanded = hasSubmenu
                  ? isSubmenuExpanded(tab.label)
                  : false;

                return (
                  <li key={tab.path}>
                    <button
                      onClick={() => {
                        if (hasSubmenu) {
                          toggleSubmenu(tab.label);
                        } else {
                          router.push(tab.path);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors text-sm ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 admin-nav-hover"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      {hasSubmenu &&
                        (isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        ))}
                    </button>

                    {/* Submenu */}
                    {hasSubmenu && isExpanded && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {tab.submenu.map((subItem) => {
                          const isSubActive = router.pathname === subItem.path;
                          return (
                            <li key={subItem.path}>
                              <button
                                onClick={() => router.push(subItem.path)}
                                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left transition-colors text-sm ${
                                  isSubActive
                                    ? "bg-blue-500 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 admin-nav-hover"
                                }`}
                              >
                                <span className="font-medium">
                                  {subItem.label}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Section */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left transition-colors text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Top Bar - Only spans content area */}
        <div className="sticky top-0 h-14 flex items-center bg-white border-b-2 border-gray-200 px-6 z-30 transition-colors duration-300">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-700 hover:text-gray-900 transition-colors p-1 rounded hover:bg-gray-100"
                  title="Expand Sidebar"
                >
                  <PanelLeftOpen className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email || "Admin User"}
              </span>
              <button
                onClick={() => window.open("/dashboard", "_blank")}
                className="text-gray-700 hover:text-gray-900 transition-colors p-1.5 rounded hover:bg-gray-100"
                title="Main Site"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
