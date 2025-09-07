import { SubmitTaskForm } from '@/components/SubmitTaskForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Zap, Clock } from 'lucide-react';

interface MainContentProps {
  onTaskSubmitted: () => void;
  userCreditsData?: any;
}

export const MainContent = ({ onTaskSubmitted, userCreditsData }: MainContentProps) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md">  
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-gray-100 ">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 ">
              <Lightbulb className="h-6 w-6 text-blue-600 " />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900 ">Submit New Task</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Create and submit indexing or checking tasks for your URLs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Queue Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-200 ">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-purple-100 ">
                <Zap className="h-5 w-5 text-purple-600 " />
              </div>
              <div>
                <h4 className="font-semibold text-purple-700 ">VIP Queue</h4>
                <p className="text-sm text-gray-600 ">
                  Your link is visited by Googlebot within <strong>5 minutes</strong>
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-blue-100 ">
                <Clock className="h-5 w-5 text-blue-600 " />
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 ">Standard Queue</h4>
                <p className="text-sm text-gray-600 ">
                  Crawler will take up to <strong>24 hours</strong> to visit your link
                </p>
              </div>
            </div>
          </div>

          <SubmitTaskForm onTaskSubmitted={onTaskSubmitted} />
        </CardContent>
      </Card>
    </div>
  );
};
