import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface DowngradeInfoCardProps {
  toPlanName: string;
  effectiveDate: string | Date;
}

export const DowngradeInfoCard = ({ toPlanName, effectiveDate }: DowngradeInfoCardProps) => {
  return (
    <Card className="mb-6 border border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/10 shadow-google-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--warning))]/15 ring-1 ring-[hsl(var(--warning))]/30">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-foreground">Plan Downgrade Scheduled</span>
              <Badge variant="outline" className="border-[hsl(var(--warning))]/50 text-[hsl(var(--warning))]">Scheduled</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Your plan will be downgraded to <span className="font-semibold text-foreground">{toPlanName}</span> on <span className="font-semibold text-foreground">{new Date(effectiveDate).toLocaleDateString()}</span>.
              You will keep your current plan and credits until then. From the next billing cycle, your new plan and credits will apply.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};