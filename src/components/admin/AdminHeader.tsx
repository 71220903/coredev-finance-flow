
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Play, Pause } from "lucide-react";

interface AdminHeaderProps {
  isPaused: boolean;
  onTogglePause: () => void;
  loading: boolean;
}

export const AdminHeader = ({ isPaused, onTogglePause, loading }: AdminHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <span>Advanced Admin Panel</span>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={isPaused ? "destructive" : "default"}>
            {isPaused ? "PAUSED" : "ACTIVE"}
          </Badge>
          <Button
            variant={isPaused ? "default" : "destructive"}
            size="sm"
            onClick={onTogglePause}
            disabled={loading}
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume Platform
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Platform
              </>
            )}
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
  );
};
