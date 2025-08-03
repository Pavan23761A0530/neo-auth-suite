import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User } from 'lucide-react';
import { apiService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available_times: string[];
}

const AppointmentBooking = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      // Mock data - replace with actual API call
      const mockDoctors: Doctor[] = [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          available_times: ['09:00', '10:00', '11:00', '14:00', '15:00']
        },
        {
          id: '2',
          name: 'Dr. Michael Chen',
          specialty: 'Neurology',
          available_times: ['10:00', '11:00', '13:00', '14:00', '16:00']
        },
        {
          id: '3',
          name: 'Dr. Emily Davis',
          specialty: 'Dermatology',
          available_times: ['09:00', '10:30', '12:00', '15:00', '16:30']
        }
      ];
      setDoctors(mockDoctors);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
        variant: "destructive"
      });
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !date || !time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await apiService.bookAppointment({
        patient_id: user?.id,
        doctor_id: selectedDoctor,
        date,
        time,
        status: 'scheduled',
        notes
      });

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
        variant: "default"
      });

      // Reset form
      setSelectedDoctor('');
      setDate('');
      setTime('');
      setNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calendar className="w-5 h-5 text-primary" />
          Book New Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="doctor">Select Doctor</Label>
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="glass border-border/50">
              <SelectValue placeholder="Choose a doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="glass border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select value={time} onValueChange={setTime} disabled={!selectedDoctor}>
              <SelectTrigger className="glass border-border/50">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {selectedDoctorData?.available_times.map((timeSlot) => (
                  <SelectItem key={timeSlot} value={timeSlot}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {timeSlot}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your symptoms or concerns..."
            className="glass border-border/50"
            rows={3}
          />
        </div>

        <Button 
          onClick={handleBookAppointment} 
          disabled={loading}
          className="w-full btn-neon"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AppointmentBooking;