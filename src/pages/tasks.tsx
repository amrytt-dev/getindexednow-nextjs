import { AuthWrapper } from "@/components/AuthWrapper";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useEffect, useState } from "react";
import TasksList from "@/components/TasksList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, CheckCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitTaskForm } from "@/components/SubmitTaskForm";
import { useRouter } from "next/router";

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("indexer");
  const router = useRouter();
  const selectedTaskId =
    typeof router.query.taskId === "string" ? router.query.taskId : null;
  const [showCreateTask, setShowCreateTask] = useState(false);

  useEffect(() => {
    const typeParam =
      typeof router.query.type === "string" ? router.query.type : null;
    if (typeParam === "checker" || typeParam === "indexer") {
      setActiveTab(typeParam);
    } else {
      setActiveTab("indexer");
    }
  }, [router.query.type]);

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-[#f8f9fa]">
        <DashboardHeader />
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-[32px] font-normal text-[#202124] mb-2 ">
              Tasks Dashboard
            </h1>
            <p className="text-[16px] text-[#5f6368] max-w-2xl">
              Track and manage your indexing and checking tasks with real-time
              updates
            </p>
          </div>

          <Card className="border-0 rounded-xl shadow-sm bg-white overflow-hidden">
            <CardContent className="p-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-[#dadce0]">
                  <TabsList className="h-10 p-1 bg-[#f1f3f4] rounded-full">
                    <TabsTrigger
                      value="indexer"
                      className="rounded-full px-5 py-1.5 text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#4285f4] data-[state=active]:shadow-sm transition-all"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Indexer Tasks
                    </TabsTrigger>
                    <TabsTrigger
                      value="checker"
                      className="rounded-full px-5 py-1.5 text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:text-[#34a853] data-[state=active]:shadow-sm transition-all"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Checker Tasks
                    </TabsTrigger>
                  </TabsList>

                  <Dialog
                    open={showCreateTask}
                    onOpenChange={setShowCreateTask}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setShowCreateTask(true)}
                        className="bg-[#4285f4] hover:bg-[#3b78e7] text-white rounded-full h-10 px-6 font-medium text-[14px] flex items-center gap-2 shadow-sm"
                      >
                        <Plus className="h-4 w-4" />
                        Create task
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-0">
                      <DialogHeader className="p-3 border-b border-[#dadce0]">
                        <DialogTitle className="text-[22px] font-normal text-[#202124] ">
                          Create a new task
                        </DialogTitle>
                      </DialogHeader>
                      <div className="p-6 pt-0">
                        <SubmitTaskForm
                          onTaskSubmitted={() => setShowCreateTask(false)}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <TabsContent
                  value="indexer"
                  className="mt-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <TasksList
                    taskType="indexer"
                    selectedTaskId={selectedTaskId}
                    onCreateTask={() => setShowCreateTask(true)}
                  />
                </TabsContent>
                <TabsContent
                  value="checker"
                  className="mt-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <TasksList
                    taskType="checker"
                    selectedTaskId={selectedTaskId}
                    onCreateTask={() => setShowCreateTask(true)}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthWrapper>
  );
}
