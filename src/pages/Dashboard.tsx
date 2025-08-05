import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Stethoscope, 
  UserCheck, 
  FileText, 
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('healthcare_token');
      
      // Load appointments
      const appointmentsResponse = await fetch('http://localhost:5000/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData.appointments || []);
      }

      // Load doctors (for patients)
      if (user?.role === 'patient') {
        const doctorsResponse = await fetch('http://localhost:5000/api/users/doctors', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (doctorsResponse.ok) {
          const doctorsData = await doctorsResponse.json();
          setDoctors(doctorsData.doctors || []);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen animated-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-neon-primary">
              Healthcare Platform
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Welcome, {user.name} ({user.role})
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all duration-300 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="pt-24 pb-8 px-6">
        <div className="container mx-auto">
          {/* Welcome Section */}
          <div className="glass-card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-glow mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-muted-foreground">
                  {user.role === 'doctor' ? 'Manage your patients and appointments' : 'Book appointments and view your medical records'}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {user.role === 'doctor' ? (
                  <Stethoscope className="w-8 h-8 text-primary" />
                ) : (
                  <UserCheck className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Appointments Section */}
            <div className="lg:col-span-2">
              <div className="glass-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Appointments</h2>
                  {user.role === 'patient' && (
                    <button className="btn-neon flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Book Appointment
                    </button>
                  )}
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading appointments...</p>
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment: any) => (
                      <div key={appointment.appointment_id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{appointment.appointment_date} at {appointment.appointment_time}</p>
                            <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {appointment.status === 'scheduled' && (
                            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-500 rounded-full flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Scheduled
                            </span>
                          )}
                          {appointment.status === 'completed' && (
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </span>
                          )}
                          {appointment.status === 'cancelled' && (
                            <span className="px-2 py-1 text-xs bg-red-500/20 text-red-500 rounded-full flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No appointments found</p>
                    {user.role === 'patient' && (
                      <p className="text-sm text-muted-foreground mt-2">Book your first appointment to get started</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="glass-card">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {user.role === 'patient' ? (
                    <>
                      <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Plus className="w-5 h-5 text-primary" />
                          <span>Book New Appointment</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <span>View Medical Records</span>
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-primary" />
                          <span>View Patients</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <span>Create Medical Record</span>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Available Doctors (for patients) */}
              {user.role === 'patient' && doctors.length > 0 && (
                <div className="glass-card">
                  <h3 className="text-xl font-semibold mb-4">Available Doctors</h3>
                  <div className="space-y-3">
                    {doctors.slice(0, 3).map((doctor: any) => (
                      <div key={doctor.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Stethoscope className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doctor.name}</p>
                          <p className="text-xs text-muted-foreground">{doctor.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="glass-card">
                <h3 className="text-xl font-semibold mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Appointments</span>
                    <span className="font-semibold">{appointments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Upcoming</span>
                    <span className="font-semibold text-blue-500">
                      {appointments.filter((a: any) => a.status === 'scheduled').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-semibold text-green-500">
                      {appointments.filter((a: any) => a.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 