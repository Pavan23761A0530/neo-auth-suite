import { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Appointment {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: string;
  created_at: string;
  patient_name?: string;
}

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'doctor') {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('healthcare_token');
      const response = await fetch('http://localhost:5000/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load appointments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    setUpdatingStatus(appointmentId);
    try {
      const token = localStorage.getItem('healthcare_token');
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Appointment ${status} successfully`
        });
        loadAppointments(); // Reload to get updated data
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update appointment');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update appointment',
        variant: 'destructive'
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    }
  };

  if (user?.role !== 'doctor') {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">This page is only accessible to doctors.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">My Appointments</h2>
        <button
          onClick={loadAppointments}
          disabled={loading}
          className="btn-neon flex items-center"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading appointments...</p>
        </div>
      ) : appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.appointment_id} className="glass-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Appointment #{appointment.appointment_id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Patient ID: {appointment.patient_id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.appointment_time}</span>
                    </div>
                  </div>

                  {appointment.reason && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Reason for Visit:</span>
                      </div>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {appointment.reason}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Status:</span>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(appointment.status)} flex items-center`}>
                      {getStatusIcon(appointment.status)}
                      <span className="ml-1 capitalize">{appointment.status}</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  {appointment.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => updateAppointmentStatus(appointment.appointment_id, 'completed')}
                        disabled={updatingStatus === appointment.appointment_id}
                        className="px-3 py-1 text-xs bg-green-500/20 text-green-500 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                      >
                        {updatingStatus === appointment.appointment_id ? 'Updating...' : 'Mark Complete'}
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(appointment.appointment_id, 'cancelled')}
                        disabled={updatingStatus === appointment.appointment_id}
                        className="px-3 py-1 text-xs bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      >
                        {updatingStatus === appointment.appointment_id ? 'Updating...' : 'Cancel'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No appointments found</p>
          <p className="text-sm text-muted-foreground mt-2">You don't have any appointments scheduled yet.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments; 