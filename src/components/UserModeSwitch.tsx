
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import { useUserRole } from '@/contexts/UserRoleContext';
import { DollarSign, TrendingUp } from 'lucide-react';

export const UserModeSwitch = () => {
  const { userMode, setUserMode, isAdmin } = useUserRole();

  if (isAdmin) {
    return (
      <Badge variant="secondary" className="flex items-center space-x-1">
        <span>Admin</span>
      </Badge>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <TrendingUp className="h-4 w-4 text-green-600" />
        <span className="text-sm">Lender</span>
      </div>
      <Toggle
        pressed={userMode === 'borrower'}
        onPressedChange={(pressed) => setUserMode(pressed ? 'borrower' : 'lender')}
        className="data-[state=on]:bg-blue-600 data-[state=on]:text-white"
      >
        <div className="flex items-center space-x-1">
          <DollarSign className="h-4 w-4" />
          <span className="text-sm">Borrower</span>
        </div>
      </Toggle>
    </div>
  );
};
