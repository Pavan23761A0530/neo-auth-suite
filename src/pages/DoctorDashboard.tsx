import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, FileText, LogOut, Activity, Stethoscope, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import DoctorAppointments from '@/components/DoctorAppointments';

const DoctorDashboard = () => {
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
              <Stethoscope className="w-8 h-8 text-neon-primary" />
              <div>
                <div className="text-xl font-bold text-neon-primary">Med Track</div>
                <div className="text-xs text-muted-foreground">Doctor Portal</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">Dr. {user?.name}</div>
                <div className="text-xs text-muted-foreground">Medical Professional</div>
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
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Patients
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      Today's Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400 mb-2">8</div>
                    <p className="text-sm text-muted-foreground">2 completed, 6 pending</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Users className="w-5 h-5 text-green-400" />
                      Total Patients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400 mb-2">142</div>
                    <p className="text-sm text-muted-foreground">Active patients</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      Avg Consultation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">25m</div>
                    <p className="text-sm text-muted-foreground">Per appointment</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <FileText className="w-5 h-5 text-purple-400" />
                      Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-400 mb-2">23</div>
                    <p className="text-sm text-muted-foreground">Pending review</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Today's Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg glass">
                        <div>
                          <p className="text-sm font-medium text-foreground">John Smith</p>
                          <p className="text-xs text-muted-foreground">Annual Checkup</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-400">9:00 AM</p>
                          <p className="text-xs text-muted-foreground">30 min</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg glass">
                        <div>
                          <p className="text-sm font-medium text-foreground">Sarah Wilson</p>
                          <p className="text-xs text-muted-foreground">Follow-up</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-400">10:00 AM</p>
                          <p className="text-xs text-muted-foreground">20 min</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg glass">
                        <div>
                          <p className="text-sm font-medium text-foreground">Michael Brown</p>
                          <p className="text-xs text-muted-foreground">Consultation</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-400">11:00 AM</p>
                          <p className="text-xs text-muted-foreground">45 min</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg glass">
                        <FileText className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Medical Report Updated</p>
                          <p className="text-xs text-muted-foreground">Patient: Sarah Wilson - 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg glass">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-foreground">New Appointment Booked</p>
                          <p className="text-xs text-muted-foreground">Patient: John Doe - Feb 20, 2:00 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg glass">
                        <Users className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Patient Message Received</p>
                          <p className="text-xs text-muted-foreground">From: Emma Davis - 30 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="appointments">
              <DoctorAppointments />
            </TabsContent>

            <TabsContent value="patients" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Users className="w-6 h-6 text-primary" />
                    Patient Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg glass">
                      <div>
                        <p className="font-medium text-foreground">John Smith</p>
                        <p className="text-sm text-muted-foreground">Last visit: Feb 10, 2024</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-border/50">
                        View Records
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg glass">
                      <div>
                        <p className="font-medium text-foreground">Sarah Wilson</p>
                        <p className="text-sm text-muted-foreground">Last visit: Feb 8, 2024</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-border/50">
                        View Records
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg glass">
                      <div>
                        <p className="font-medium text-foreground">Michael Brown</p>
                        <p className="text-sm text-muted-foreground">Last visit: Feb 5, 2024</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-border/50">
                        View Records
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;