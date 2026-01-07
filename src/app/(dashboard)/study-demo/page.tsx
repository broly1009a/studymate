'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudyTimer from '@/components/dashboard/study-timer';
import StudyDashboard from '@/components/dashboard/study-dashboard';
import StudySessionDetail from '@/components/dashboard/study-session-detail';
import { 
  Timer, 
  Users, 
  Award, 
  TrendingUp,
  BookOpen,
  Target
} from 'lucide-react';

export default function StudySystemDemo() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTimer, setShowTimer] = useState(false);
  const [demoSessionId, setDemoSessionId] = useState(''); // Set a real session ID for testing

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Study System Demo</h1>
        <p className="text-muted-foreground">
          Test tất cả các tính năng của hệ thống Study Management
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">
            <TrendingUp className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="study-now">
            <Timer className="h-4 w-4 mr-2" />
            Study Now
          </TabsTrigger>
          <TabsTrigger value="group-study">
            <Users className="h-4 w-4 mr-2" />
            Group Study
          </TabsTrigger>
          <TabsTrigger value="guide">
            <BookOpen className="h-4 w-4 mr-2" />
            Guide
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Dashboard</CardTitle>
              <CardDescription>
                Tổng quan về streak, reputation, study time và progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudyDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Now Tab */}
        <TabsContent value="study-now" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Study Timer</CardTitle>
              <CardDescription>
                Học cá nhân với Pomodoro timer và tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showTimer ? (
                <div className="text-center py-12 space-y-4">
                  <Timer className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ready to study?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click để bắt đầu một phiên học mới với Pomodoro timer
                    </p>
                  </div>
                  <Button onClick={() => setShowTimer(true)} size="lg">
                    Start Study Session
                  </Button>
                </div>
              ) : (
                <StudyTimer
                  subjectId="demo_subject_id"
                  subjectName="Mathematics"
                  topic="Demo Topic - Calculus"
                  onComplete={() => {
                    setShowTimer(false);
                    setActiveTab('dashboard');
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Features Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                <div>
                  <strong>Pomodoro Timer:</strong> 25 phút focus, 5 phút break
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div>
                  <strong>Focus Score:</strong> Đánh giá mức độ tập trung của bạn
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                <div>
                  <strong>Auto Rewards:</strong> Tự động cập nhật streak và award points
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                <div>
                  <strong>Notes & Tags:</strong> Ghi chú và tag cho session
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Group Study Tab */}
        <TabsContent value="group-study" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Study Session</CardTitle>
              <CardDescription>
                Test join/leave group study session
              </CardDescription>
            </CardHeader>
            <CardContent>
              {demoSessionId ? (
                <StudySessionDetail sessionId={demoSessionId} />
              ) : (
                <div className="text-center py-12 space-y-4">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No session selected</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Để test tính năng này:
                    </p>
                    <ol className="text-sm text-left max-w-md mx-auto space-y-2">
                      <li>1. Tạo một study session qua API hoặc UI</li>
                      <li>2. Copy session ID</li>
                      <li>3. Paste vào input ở dưới</li>
                    </ol>
                  </div>
                  <div className="flex gap-2 justify-center items-center max-w-md mx-auto">
                    <input
                      type="text"
                      placeholder="Paste session ID here"
                      className="flex-1 px-3 py-2 border rounded-md"
                      onChange={(e) => setDemoSessionId(e.target.value)}
                    />
                    <Button onClick={() => setActiveTab('group-study')}>Load</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>Group Study Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                <div>
                  <strong>Create Session:</strong> Tạo phiên học nhóm với thời gian, môn học
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div>
                  <strong>Join/Leave:</strong> Tham gia hoặc rời khỏi session
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                <div>
                  <strong>Start/Complete:</strong> Creator có thể start và complete session
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                <div>
                  <strong>Rewards:</strong> +10 points cho participants, +20 cho creator
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Hướng dẫn sử dụng hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1 */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                  Personal Study (Học cá nhân)
                </h3>
                <div className="ml-8 space-y-2 text-sm text-muted-foreground">
                  <p>• Vào tab "Study Now"</p>
                  <p>• Click "Start Study Session"</p>
                  <p>• Học với Pomodoro timer (25min focus, 5min break)</p>
                  <p>• Complete session để nhận points và update streak</p>
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
                  Group Study (Học nhóm)
                </h3>
                <div className="ml-8 space-y-2 text-sm text-muted-foreground">
                  <p>• Tạo session: POST /api/study-sessions</p>
                  <p>• Browse sessions: GET /api/study-sessions</p>
                  <p>• Join session: POST /api/study-sessions/:id/join</p>
                  <p>• Creator start & complete session</p>
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">3</span>
                  Track Progress (Theo dõi tiến độ)
                </h3>
                <div className="ml-8 space-y-2 text-sm text-muted-foreground">
                  <p>• Dashboard hiển thị streak, reputation, study time</p>
                  <p>• Streak tăng khi học mỗi ngày liên tiếp</p>
                  <p>• Reputation tăng qua study activities</p>
                  <p>• Rank up: Novice → Beginner → ... → Legend</p>
                </div>
              </div>

              {/* Reputation Points */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Cách kiếm Reputation Points
                </h3>
                <div className="ml-8 space-y-1 text-sm">
                  <p>• Study 30min: <strong>+5 points</strong></p>
                  <p>• Study 1 hour: <strong>+15 points</strong></p>
                  <p>• Study 2+ hours: <strong>+30 points</strong></p>
                  <p>• High focus (80+): <strong>+10 points bonus</strong></p>
                  <p>• 3-day streak: <strong>+15 points</strong></p>
                  <p>• 7-day streak: <strong>+35 points</strong></p>
                  <p>• 30-day streak: <strong>+150 points</strong></p>
                  <p>• Create group session: <strong>+20 points</strong></p>
                  <p>• Join & complete session: <strong>+10 points</strong></p>
                </div>
              </div>

              {/* API Testing */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Test API Endpoints
                </h3>
                <div className="ml-8 space-y-2 text-sm">
                  <div className="p-3 bg-muted rounded-md font-mono text-xs">
                    GET /api/study-streak?userId=your_user_id
                  </div>
                  <div className="p-3 bg-muted rounded-md font-mono text-xs">
                    GET /api/reputation/stats?userId=your_user_id
                  </div>
                  <div className="p-3 bg-muted rounded-md font-mono text-xs">
                    POST /api/study-records/start
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentation Links */}
          <Card>
            <CardHeader>
              <CardTitle>📚 Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Xem chi tiết trong các files:</p>
              <ul className="space-y-1 ml-4">
                <li>• <code className="text-xs bg-muted px-2 py-1 rounded">STUDY_SYSTEM_DOCS.md</code> - Tài liệu chi tiết hệ thống</li>
                <li>• <code className="text-xs bg-muted px-2 py-1 rounded">API_REFERENCE.md</code> - Tất cả API endpoints</li>
                <li>• <code className="text-xs bg-muted px-2 py-1 rounded">USER_FLOW_GUIDE.md</code> - Hướng dẫn luồng sử dụng</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
