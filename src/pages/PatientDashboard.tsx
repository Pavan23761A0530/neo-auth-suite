import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, User, LogOut, Bell, Heart, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AppointmentBooking from '@/components/AppointmentBooking';
import PatientHistory from '@/components/PatientHistory';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen animated-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-neon-primary" />
              <div>
                <div className="text-xl font-bold text-neon-primary">Med Track</div>
                <div className="text-xs text-muted-foreground">Patient Portal</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">Welcome, {user?.name}</div>
                <div className="text-xs text-muted-foreground">Patient ID: {user?.id}</div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-border/50 text-foreground hover:bg-muted/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="glass mb-8 p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Medical History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      Upcoming Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400 mb-2">2</div>
                    <p className="text-sm text-muted-foreground">Next: Feb 15, 2024</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <FileText className="w-5 h-5 text-green-400" />
                      Medical Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400 mb-2">12</div>
                    <p className="text-sm text-muted-foreground">Total records</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Bell className="w-5 h-5 text-yellow-400" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">3</div>
                    <p className="text-sm text-muted-foreground">New messages</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg glass">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Appointment Scheduled</p>
                          <p className="text-xs text-muted-foreground">Dr. Sarah Johnson - Feb 15, 9:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg glass">
                        <FileText className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Test Results Available</p>
                          <p className="text-xs text-muted-foreground">Blood work - Feb 10</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Health Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Blood Pressure</span>
                        <span className="text-sm font-medium text-foreground">120/80 mmHg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Heart Rate</span>
                        <span className="text-sm font-medium text-foreground">72 bpm</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Weight</span>
                        <span className="text-sm font-medium text-foreground">70 kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Last Checkup</span>
                        <span className="text-sm font-medium text-foreground">Jan 15, 2024</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentBooking />
            </TabsContent>

            <TabsContent value="history">
              <PatientHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;