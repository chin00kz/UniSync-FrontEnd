import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  X,
  Paperclip,
  ImageIcon,
  Trash2,
  Clock,
  ChevronRight,
  Inbox,
  User,
  Reply
} from 'lucide-react';

// initialSelectedId prop එක මෙතනට එකතු කළා
function SessionReview({ questions, onUpdate, initialSelectedId }) {
  const [activeId, setActiveId] = useState(initialSelectedId || null);
  const [reply, setReply] = useState('');
  const [replyImage, setReplyImage] = useState('');

  const current = questions.find(q => q._id === activeId);
  const pendingCount = questions.filter(q => q.status === 'Not Started').length;
  const repliedCount = questions.filter(q => q.status === 'Replied').length;
  const completedCount = questions.filter(q => q.status === 'Completed').length;

  const processFile = (file) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Max size 2MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setReplyImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submitUpdate = (status) => {
    onUpdate(activeId, status, reply, replyImage);
    setActiveId(null); 
    setReply(''); 
    setReplyImage('');
  };

  const getInitials = (name) => {
    if(!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Completed': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'Replied': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
      default: return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-linear-to-br from-slate-50 to-gray-50 min-h-screen">
      
      {/* Header Stats */}
      <div className="mb-8 text-left">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Reviews</h1>
        <p className="text-gray-500">Review and respond to student questions</p>
        <div className="flex gap-3 mt-4">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1">
            Pending: {pendingCount}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
            Replied: {repliedCount}
          </Badge>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
            Completed: {completedCount}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN - SESSION LIST */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-0 shadow-sm text-left">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Inbox className="h-5 w-5 text-gray-500" />
                Student Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y overflow-y-auto max-h-150">
                {questions.map(q => {
                  const statusStyle = getStatusStyle(q.status);
                  return (
                    <div
                      key={q._id}
                      onClick={() => { setActiveId(q._id); setReply(q.replyText || ''); }}
                      className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                        activeId === q._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
                          <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${q.studentName}`} alt={q.studentName} />
                          <AvatarFallback className="bg-gray-200 text-gray-700">
                            {getInitials(q.studentName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {q.studentName}
                            </p>
                            <Badge className={`${statusStyle.bg} ${statusStyle.text} border-0 text-xs`}>
                              {q.status || 'Not Started'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {q.questionText?.substring(0, 60)}...
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'No date'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                          activeId === q._id ? 'translate-x-1' : ''
                        }`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - REVIEW PANEL */}
        <div className="lg:col-span-7">
          {activeId && current ? (
            <Card className="border-0 shadow-sm overflow-hidden text-left">
              {/* Header with gradient */}
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white/20 shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${current.studentName}`} alt={current.studentName} />
                      <AvatarFallback className="bg-white/20 text-white">
                        {getInitials(current.studentName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{current.studentName}</h2>
                      <p className="text-blue-100 text-sm">Active Session</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveId(null)}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                
                {/* QUESTION SECTION */}
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Student's Question</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-800 leading-relaxed">{current.questionText}</p>
                    {current.questionImage && (
                      <div className="mt-4">
                        <img 
                          src={current.questionImage} 
                          alt="student attachment" 
                          className="rounded-lg max-h-64 object-cover border shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* REPLY SECTION */}
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <div className="bg-linear-to-r from-gray-50 to-gray-100 px-5 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-200 rounded-lg">
                        <Reply className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-semibold text-gray-800">Your Reply</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <Textarea 
                      value={reply} 
                      onChange={(e) => setReply(e.target.value)} 
                      placeholder="Write your answer here..."
                      className="min-h-30 resize-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    />
                    
                    <div 
                      onDragOver={(e) => e.preventDefault()} 
                      onDrop={(e) => { e.preventDefault(); processFile(e.dataTransfer.files[0]); }} 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-200 bg-gray-50"
                    >
                      {!replyImage ? (
                        <>
                          <div className="flex justify-center mb-2">
                            <div className="p-2 bg-gray-100 rounded-full">
                              <ImageIcon className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Drag & drop an image here</p>
                          <p className="text-xs text-gray-400 mb-3">or</p>
                          <div className="relative inline-block">
                            <input 
                              type="file" 
                              id="tutor-upload" 
                              accept="image/*" 
                              onChange={(e) => processFile(e.target.files[0])} 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Button variant="outline" size="sm" type="button" className="pointer-events-none bg-white">
                              <Paperclip className="h-3.5 w-3.5 mr-2" />
                              Browse Files
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            <img 
                              src={replyImage} 
                              alt="Reply preview" 
                              className="w-14 h-14 rounded-lg object-cover border border-blue-200 shadow-sm" 
                            />
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-800">Image attached</p>
                              <p className="text-xs text-gray-500">Ready to send</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setReplyImage("")}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button 
                    onClick={() => submitUpdate('Replied')} 
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply & Keep Pending
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => submitUpdate('Not Started')} 
                      variant="outline"
                      className="border-amber-500 text-amber-600 hover:bg-amber-50"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button 
                      onClick={() => submitUpdate('Completed')} 
                      className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md transition-all"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm h-full flex items-center justify-center min-h-100">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No session selected</p>
                <p className="text-sm text-gray-400 mt-1">Click on a student session to start reviewing</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default SessionReview;