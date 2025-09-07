import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface CancelInfoCardProps {
  effectiveDate: string | Date;
}

export const CancelInfoCard = ({ effectiveDate }: CancelInfoCardProps) => {
  return (
    <Card className="mb-6 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/10 shadow-google-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--destructive))]/15 ring-1 ring-[hsl(var(--destructive))]/30">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--destructive))]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-foreground">Subscription Cancellation Scheduled</span>
              <Badge variant="outline" className="border-[hsl(var(--destructive))]/50 text-[hsl(var(--destructive))]">Scheduled</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Your subscription is set to cancel on <span className="font-semibold text-foreground">{new Date(effectiveDate).toLocaleDateString()}</span>. You can still upgrade to a higher plan before then. If you’d like to switch to a lower plan, please resume your subscription first.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
