import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { User, Settings, CreditCard, History } from "lucide-react";

import { UserSettingProfile } from "@/components/pages/UserSettingProfile";
import { UserSettingAccount } from "@/components/pages/UserSettingAccount";
import UserSettingPlans from "@/components/pages/UserSettingPlans";
import { UserSettingSubscriptionHistory } from "@/components/pages/UserSettingSubscriptionHistory";

export const UserSetting = () => {
  const router = useRouter();

  // Extract the last segment of the URL path
  const pathTab = router.asPath.split("?")[0].split("/").pop();
  const validTabs = ["profile", "account", "plans", "subscription-history"];

  // Initialize activeTab based on URL
  const [activeTab, setActiveTab] = useState(
    validTabs.includes(pathTab!) ? pathTab! : "profile"
  );

  useEffect(() => {
    // Update activeTab if user navigates directly or via browser back/forward
    if (validTabs.includes(pathTab!)) {
      setActiveTab(pathTab!);
    }
  }, [router.asPath]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/user/setting/${value}`);
  };

  return (
    <div className="bg-[#f8f9fa]">
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
        {/* Hero Section - Google-style heading */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-normal text-[#202124] mb-2">
            Settings
          </h1>
          <p className="text-[14px] sm:text-[16px] text-[#5f6368] max-w-2xl">
            Manage your account preferences, profile, and subscription details
          </p>
        </div>

        {/* Settings Container - Google Material Card Style */}
        <Card className="border-0 rounded-xl shadow-sm bg-white">
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              {/* Header with Tabs */}
              <div
                id="settings-tabs"
                className="flex flex-col gap-4 p-4 sm:p-6 border-b border-[#dadce0]"
                data-tabs-section="true"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Scrollable Tabs Container */}
                  <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
                    <TabsList className="h-10 p-1 bg-[#f1f3f4] rounded-full flex flex-row w-max min-w-full sm:min-w-0">
                      <TabsTrigger
                        value="profile"
                        className="rounded-full px-4 sm:px-5 py-1.5 text-[13px] sm:text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#4285f4] data-[state=active]:shadow-sm transition-all flex items-center justify-center whitespace-nowrap flex-shrink-0"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span>Profile</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="account"
                        className="rounded-full px-4 sm:px-5 py-1.5 text-[13px] sm:text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#4285f4] data-[state=active]:shadow-sm transition-all flex items-center justify-center whitespace-nowrap flex-shrink-0"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        <span>Account</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="plans"
                        className="rounded-full px-4 sm:px-5 py-1.5 text-[13px] sm:text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#4285f4] data-[state=active]:shadow-sm transition-all flex items-center justify-center whitespace-nowrap flex-shrink-0"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>Plans</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="subscription-history"
                        className="rounded-full px-4 sm:px-5 py-1.5 text-[13px] sm:text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#4285f4] data-[state=active]:shadow-sm transition-all flex items-center justify-center whitespace-nowrap flex-shrink-0"
                      >
                        <History className="h-4 w-4 mr-2" />
                        <span>History</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <TabsContent
                value="profile"
                className="mt-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <UserSettingProfile />
              </TabsContent>
              <TabsContent
                value="account"
                className="mt-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <UserSettingAccount />
              </TabsContent>
              <TabsContent
                value="plans"
                className="mt-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <UserSettingPlans />
              </TabsContent>
              <TabsContent
                value="subscription-history"
                className="mt-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <UserSettingSubscriptionHistory />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
