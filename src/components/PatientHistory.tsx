import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Calendar, User, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, MedicalRecord } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const PatientHistory = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    diagnosis: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMedicalHistory();
    }
  }, [user]);

  const fetchMedicalHistory = async () => {
    try {
      // Mock data - replace with actual API call
      const mockRecords: MedicalRecord[] = [
        {
          id: '1',
          patient_id: user?.id || '',
          doctor_id: '1',
          diagnosis: 'Hypertension',
          date: '2024-01-15',
          notes: 'Blood pressure 140/90. Prescribed medication and lifestyle changes.',
        },
        {
          id: '2',
          patient_id: user?.id || '',
          doctor_id: '2',
          diagnosis: 'Migraine',
          date: '2024-01-10',
          notes: 'Frequent headaches reported. Recommended stress management and sleep hygiene.',
        },
        {
          id: '3',
          patient_id: user?.id || '',
          diagnosis: 'Annual Checkup',
          date: '2024-01-05',
          notes: 'Routine physical examination. All vitals normal. No concerns.',
        }
      ];
      setRecords(mockRecords);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch medical history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    if (!newRecord.diagnosis || !newRecord.notes) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await apiService.addMedicalRecord({
        patient_id: user?.id,
        diagnosis: newRecord.diagnosis,
        notes: newRecord.notes,
        date: newRecord.date
      });

      toast({
        title: "Success",
        description: "Medical record added successfully!",
        variant: "default"
      });

      setNewRecord({
        diagnosis: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });
      setIsAddingRecord(false);
      fetchMedicalHistory();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medical record",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading medical history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Medical History
        </h2>
        {user?.role === 'patient' && (
          <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
            <DialogTrigger asChild>
              <Button className="btn-neon">
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border/50">
              <DialogHeader>
                <DialogTitle>Add New Medical Record</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                    className="glass border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis/Condition</Label>
                  <Input
                    value={newRecord.diagnosis}
                    onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                    placeholder="Enter diagnosis or condition"
                    className="glass border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    placeholder="Add details about symptoms, treatment, etc."
                    className="glass border-border/50"
                    rows={4}
                  />
                </div>
                <Button onClick={handleAddRecord} className="w-full btn-neon">
                  Add Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {records.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No medical records found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          records.map((record) => (
            <Card key={record.id} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">
                    {record.diagnosis}
                  </CardTitle>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(record.date).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{record.notes}</p>
                {record.doctor_id && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Reviewed by medical professional</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientHistory;