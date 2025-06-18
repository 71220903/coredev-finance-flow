
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  Github,
  Shield,
  User,
  FileText,
  Calendar
} from 'lucide-react';

interface VerificationTimelineProps {
  verificationHistory: VerificationEvent[];
  onRetryVerification?: (type: string) => void;
}

interface VerificationEvent {
  id: string;
  type: 'github' | 'identity' | 'profile' | 'achievement';
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'failed' | 'expired';
  timestamp: number;
  evidence?: string;
  expiresAt?: number;
  trustScoreImpact: number;
}

const VerificationTimeline = ({ 
  verificationHistory, 
  onRetryVerification 
}: VerificationTimelineProps) => {

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
      case 'expired':
        return <Badge className="bg-orange-100 text-orange-700">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'identity':
        return <User className="h-4 w-4" />;
      case 'profile':
        return <FileText className="h-4 w-4" />;
      case 'achievement':
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const isExpiringSoon = (event: VerificationEvent) => {
    if (!event.expiresAt || event.status !== 'completed') return false;
    const daysUntilExpiry = (event.expiresAt - Date.now()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 30;
  };

  const sortedEvents = [...verificationHistory].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Verification Timeline</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No verification events yet</p>
              <p className="text-sm">Complete verifications to build your trust score</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
              
              {sortedEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start space-x-4 pb-6">
                  {/* Timeline node */}
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-slate-200 rounded-full">
                    {getStatusIcon(event.status)}
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-grow min-w-0">
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(event.type)}
                            <h4 className="font-medium text-slate-900">{event.title}</h4>
                            {getStatusBadge(event.status)}
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>{new Date(event.timestamp).toLocaleDateString()}</span>
                            {event.trustScoreImpact > 0 && (
                              <span className="text-green-600">
                                +{event.trustScoreImpact} trust score
                              </span>
                            )}
                          </div>
                          
                          {event.evidence && (
                            <div className="mt-2">
                              <a 
                                href={event.evidence} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                View Evidence →
                              </a>
                            </div>
                          )}
                          
                          {event.expiresAt && event.status === 'completed' && (
                            <div className="mt-2">
                              <p className={`text-xs ${
                                isExpiringSoon(event) ? 'text-orange-600' : 'text-slate-500'
                              }`}>
                                {isExpiringSoon(event) ? '⚠️ ' : ''}
                                Expires: {new Date(event.expiresAt).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Action buttons */}
                        <div className="ml-4 flex-shrink-0">
                          {(event.status === 'failed' || event.status === 'expired') && onRetryVerification && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRetryVerification(event.type)}
                              className="text-xs"
                            >
                              Retry
                            </Button>
                          )}
                          
                          {isExpiringSoon(event) && onRetryVerification && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRetryVerification(event.type)}
                              className="text-xs ml-2"
                            >
                              Renew
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationTimeline;
