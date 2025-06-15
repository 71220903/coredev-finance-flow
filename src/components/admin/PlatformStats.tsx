
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, Shield, Bell } from "lucide-react";

interface PlatformStatsProps {
  totalUsers: number;
  activeLoans: number;
  totalVolume: number;
  successRate: number;
  unreadCount: number;
}

export const PlatformStats = ({ 
  totalUsers, 
  activeLoans, 
  totalVolume, 
  successRate, 
  unreadCount 
}: PlatformStatsProps) => {
  const stats = [
    { icon: Users, label: "Total Users", value: totalUsers.toLocaleString(), color: "text-blue-600" },
    { icon: TrendingUp, label: "Active Loans", value: activeLoans.toString(), color: "text-green-600" },
    { icon: DollarSign, label: "Total Volume", value: `$${(totalVolume / 1000).toFixed(0)}K`, color: "text-purple-600" },
    { icon: Shield, label: "Success Rate", value: `${successRate}%`, color: "text-yellow-600" },
    { icon: Bell, label: "Notifications", value: unreadCount.toString(), color: "text-red-600" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-sm text-slate-600">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
