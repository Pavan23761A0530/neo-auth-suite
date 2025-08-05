import { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Doctor {
  id: string;
  name: string;
  email: string;
}

interface AppointmentBookingProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AppointmentBooking = ({ isOpen, onClose, onSuccess }: AppointmentBookingProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user?.role === 'patient') {
      loadDoctors();
    }
  }, [isOpen, user]);

  const loadDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const token = localStorage.getItem('healthcare_token');
      const response = await fetch('http://localhost:5000/api/users/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load doctors',
        variant: 'destructive'
      });
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('healthcare_token');
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctor_id: selectedDoctor,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          reason: reason
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Appointment booked successfully!'
        });
        onSuccess();
        onClose();
        // Reset form
        setSelectedDoctor('');
        setAppointmentDate('');
        setAppointmentTime('');
        setReason('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book appointment');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to book appointment',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="glass-card w-full max-w-md mx-4 animate-slide-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Book Appointment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center">
              <User className="w-4 h-4 mr-2" />
              Select Doctor *
            </label>
            {loadingDoctors ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading doctors...</span>
              </div>
            ) : (
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="input-futuristic w-full"
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Appointment Date *
            </label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input-futuristic w-full"
              required
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Appointment Time *
            </label>
            <select
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="input-futuristic w-full"
              required
            >
              <option value="">Choose time</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Reason for Visit
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your symptoms or reason for the appointment..."
              className="input-futuristic w-full h-24 resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-neon w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                Booking Appointment...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Book Appointment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBooking; 