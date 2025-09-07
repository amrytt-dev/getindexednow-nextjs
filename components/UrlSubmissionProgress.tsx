import React from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useUrlProgress } from '../contexts/UrlProgressContext';

const UrlSubmissionProgress: React.FC = () => {
  const { progress, isVisible } = useUrlProgress();

  if (!isVisible || !progress) {
    return null;
  }

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <Card className="w-80 shadow-lg border-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <h3 className="font-semibold text-sm">
                URL Validation Progress
              </h3>
            </div>
            <Badge className={`text-xs ${getStatusColor()}`}>
              {progress.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progress</span>
              <span>{progress.processed} / {progress.total} URLs</span>
            </div>
            
            <Progress 
              value={progress.percentage} 
              className="h-2"
            />
            
            <div className="text-xs text-gray-600">
              {progress.message || `Processing URLs... ${progress.percentage}%`}
            </div>

            {progress.error && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                Error: {progress.error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UrlSubmissionProgress; 