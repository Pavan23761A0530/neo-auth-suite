import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, Appointment } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      // Mock data - replace with actual API call
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patient_id: 'patient1',
          doctor_id: user?.id || '',
          date: '2024-02-15',
          time: '09:00',
          status: 'scheduled',
          notes: 'Annual checkup requested'
        },
        {
          id: '2',
          patient_id: 'patient2',
          doctor_id: user?.id || '',
          date: '2024-02-15',
          time: '10:00',
          status: 'scheduled',
          notes: 'Follow-up for hypertension'
        },
        {
          id: '3',
          patient_id: 'patient3',
          doctor_id: user?.id || '',
          date: '2024-02-14',
          time: '14:00',
          status: 'completed',
          notes: 'Consultation for headaches'
        }
      ];
      setAppointments(mockAppointments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'completed' | 'cancelled') => {
    try {
      await apiService.updateAppointment(id, { status });
      
      toast({
        title: "Success",
        description: `Appointment ${status} successfully!`,
        variant: "default"
      });
      
      fetchAppointments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPatientName = (patientId: string) => {
    // Mock patient names - in real app, fetch from API
    const names: { [key: string]: string } = {
      'patient1': 'John Smith',
      'patient2': 'Sarah Wilson',
      'patient3': 'Michael Brown'
    };
    return names[patientId] || 'Unknown Patient';
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const pastAppointments = appointments.filter(apt => apt.status !== 'scheduled');

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading appointments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Calendar className="w-6 h-6 text-primary" />
        My Appointments
      </h2>

      {/* Upcoming Appointments */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Appointments</h3>
        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming appointments</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      {getPatientName(appointment.patient_id)}
                    </CardTitle>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {appointment.time}
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <p className="text-muted-foreground mb-4">{appointment.notes}</p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                      size="sm"
                      className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="border-border/50">
                          <Phone className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass border-border/50">
                        <DialogHeader>
                          <DialogTitle>Contact Patient</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Contact information and communication options for {getPatientName(appointment.patient_id)}
                          </p>
                          <p className="text-foreground">Email: patient@example.com</p>
                          <p className="text-foreground">Phone: +1 (555) 123-4567</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Past Appointments */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Past Appointments</h3>
        <div className="space-y-4">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id} className="glass-card opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {getPatientName(appointment.patient_id)}
                  </CardTitle>
                  {getStatusBadge(appointment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {appointment.time}
                  </div>
                </div>
                
                {appointment.notes && (
                  <p className="text-muted-foreground">{appointment.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;