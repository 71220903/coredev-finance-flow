
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, CheckCircle, XCircle, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WhitelistUser {
  id: string;
  address: string;
  githubHandle: string;
  trustScore: number;
  status: "pending" | "approved" | "rejected";
  requestedDate: string;
  reviewedBy?: string;
  reason?: string;
}

interface UserManagementProps {
  users: WhitelistUser[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string, reason: string) => void;
  onRevokeUser: (address: string) => void;
  onAddUser: (address: string) => void;
  loading: boolean;
}

export const UserManagement = ({ 
  users, 
  onApproveUser, 
  onRejectUser, 
  onRevokeUser, 
  onAddUser, 
  loading 
}: UserManagementProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newUserAddress, setNewUserAddress] = useState("");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.githubHandle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      case "pending": return <div className="h-4 w-4 bg-yellow-400 rounded-full animate-pulse" />;
      default: return null;
    }
  };

  const handleAddUser = () => {
    if (newUserAddress.trim()) {
      onAddUser(newUserAddress);
      setNewUserAddress("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Role Management</CardTitle>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by address or GitHub handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="0x... wallet address"
            value={newUserAddress}
            onChange={(e) => setNewUserAddress(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleAddUser} 
            disabled={!newUserAddress.trim() || loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Grant Developer Role
          </Button>
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 border rounded-lg transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="font-medium">{user.address}</div>
                    <Badge className={getStatusColor(user.status)}>
                      {getStatusIcon(user.status)}
                      <span className="ml-1">{user.status}</span>
                    </Badge>
                    <div className="text-sm text-slate-600">Trust: {user.trustScore}</div>
                  </div>
                  
                  <div className="text-sm text-slate-600 mb-1">
                    GitHub: {user.githubHandle} • Applied: {user.requestedDate}
                  </div>
                  
                  {user.reason && (
                    <div className="text-sm text-slate-500">
                      Reason: {user.reason}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {user.status === "pending" ? (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => onApproveUser(user.id)}
                        disabled={loading}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onRejectUser(user.id, "Rejected by admin review")}
                        disabled={loading}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  ) : user.status === "approved" && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => onRevokeUser(user.address)}
                      disabled={loading}
                    >
                      <Ban className="h-3 w-3 mr-1" />
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
