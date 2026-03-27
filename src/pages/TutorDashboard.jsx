import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  MailCheck,
  ArrowRight 
} from 'lucide-react';

// මෙතන onAction prop එක ඇතුළත් කළා
const TutorDashboard = ({ questions, onAction }) => {
  const stats = [
    { 
      label: "Total Requests", 
      value: questions.length, 
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Completed", 
      value: questions.filter(q => q.status === 'Completed').length, 
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    { 
      label: "Waiting", 
      value: questions.filter(q => q.status === 'Not Started').length, 
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    { 
      label: "Replied", 
      value: questions.filter(q => q.status === 'Replied').length, 
      icon: MailCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'Completed': { variant: 'default', className: 'bg-emerald-500 hover:bg-emerald-600' },
      'Replied': { variant: 'secondary', className: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
      'Not Started': { variant: 'outline', className: 'border-amber-200 text-amber-700 bg-amber-50' }
    };
    
    const config = variants[status] || variants['Not Started'];
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status ? status.toUpperCase() : 'NOT STARTED'}
      </Badge>
    );
  };

  const getActionText = (status) => {
    switch(status) {
      case 'Not Started':
        return { text: 'Review Request', icon: Clock, variant: 'default' };
      case 'Replied':
        return { text: 'View Reply', icon: MailCheck, variant: 'outline' };
      case 'Completed':
        return { text: 'View Details', icon: CheckCircle2, variant: 'secondary' };
      default:
        return { text: 'View', icon: ArrowRight, variant: 'ghost' };
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="space-y-2 text-left">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-500">
          Welcome back! Here's what's happening with UniSync today.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 text-left">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {stat.label === 'Total Requests' ? 'All time requests' : 
                   stat.label === 'Completed' ? 'Successfully completed' :
                   stat.label === 'Waiting' ? 'Pending review' : 'Responses sent'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Student Activity Table */}
      <Card className="shadow-lg text-left">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">
            Student Activity Tracker
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage student requests
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-left font-semibold text-gray-700 pl-12">
                    Student Name
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700 pr-12">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((q) => {
                  const action = getActionText(q.status);
                  const ActionIcon = action.icon;
                  
                  return (
                    <TableRow key={q._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium py-4 align-middle text-left pl-12">
                        {q.studentName}
                      </TableCell>
                      <TableCell className="py-4 align-middle text-center">
                        {getStatusBadge(q.status)}
                      </TableCell>
                      <TableCell className="py-4 align-middle text-right pr-12">
                        <Button 
                          variant={action.variant}
                          size="sm"
                          className="gap-2 whitespace-nowrap"
                          // මෙතන onAction prop එක පාවිච්චි කරලා ID එක pass කළා
                          onClick={() => onAction(q._id)}
                        >
                          {action.text}
                          <ActionIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {/* Empty State */}
          {questions.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No student requests yet</p>
              <p className="text-sm text-gray-400 mt-1">
                New requests will appear here when students reach out
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorDashboard;