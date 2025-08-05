import { useState, useEffect } from 'react';
import { FileText, User, Calendar, Stethoscope, Plus, X, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface MedicalRecord {
  record_id: string;
  patient_id: string;
  doctor_id: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  notes: string;
  created_at: string;
  doctor_name?: string;
}

interface PatientHistoryProps {
  patientId?: string;
  isDoctor?: boolean;
}

const PatientHistory = ({ patientId, isDoctor = false }: PatientHistoryProps) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingRecord, setCreatingRecord] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: '',
    treatment: '',
    medications: '',
    notes: ''
  });

  const { toast } = useToast();
  const { user } = useAuth();

  const targetPatientId = patientId || user?.id;

  useEffect(() => {
    if (targetPatientId) {
      loadMedicalRecords();
    }
  }, [targetPatientId]);

  const loadMedicalRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('healthcare_token');
      const response = await fetch(`http://localhost:5000/api/medical-records/${targetPatientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecords(data.medical_records || []);
      } else if (response.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to view these medical records',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error loading medical records:', error);
      toast({
        title: 'Error',
        description: 'Failed to load medical records',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.diagnosis.trim()) {
      toast({
        title: 'Error',
        description: 'Diagnosis is required',
        variant: 'destructive'
      });
      return;
    }

    setCreatingRecord(true);
    try {
      const token = localStorage.getItem('healthcare_token');
      const response = await fetch('http://localhost:5000/api/medical-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_id: targetPatientId,
          diagnosis: formData.diagnosis,
          treatment: formData.treatment,
          medications: formData.medications.split(',').map(m => m.trim()).filter(m => m),
          notes: formData.notes
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Medical record created successfully!'
        });
        setShowCreateForm(false);
        setFormData({ diagnosis: '', treatment: '', medications: '', notes: '' });
        loadMedicalRecords();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create medical record');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create medical record',
        variant: 'destructive'
      });
    } finally {
      setCreatingRecord(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!targetPatientId) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No patient ID provided.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">
          {isDoctor ? 'Patient Medical History' : 'My Medical History'}
        </h2>
        {user?.role === 'doctor' && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-neon flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading medical records...</p>
        </div>
      ) : records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.record_id} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Medical Record #{record.record_id.slice(0, 8)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(record.created_at)}
                    </p>
                  </div>
                </div>
                {record.doctor_name && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Stethoscope className="w-4 h-4" />
                    <span>Dr. {record.doctor_name}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Diagnosis</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {record.diagnosis}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Treatment</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {record.treatment || 'No treatment specified'}
                  </p>
                </div>
              </div>

              {record.medications && record.medications.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-foreground mb-2">Medications</h4>
                  <div className="flex flex-wrap gap-2">
                    {record.medications.map((medication, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-500/20 text-blue-500 rounded-full"
                      >
                        {medication}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {record.notes && (
                <div className="mt-4">
                  <h4 className="font-medium text-foreground mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {record.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No medical records found</p>
          <p className="text-sm text-muted-foreground mt-2">
            {isDoctor ? 'This patient has no medical records yet.' : 'You have no medical records yet.'}
          </p>
        </div>
      )}

      {/* Create Record Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card w-full max-w-md mx-4 animate-slide-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Create Medical Record</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Diagnosis *</label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="input-futuristic w-full h-20 resize-none"
                  placeholder="Enter diagnosis..."
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Treatment</label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  className="input-futuristic w-full h-20 resize-none"
                  placeholder="Enter treatment plan..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Medications</label>
                <input
                  type="text"
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  className="input-futuristic w-full"
                  placeholder="Enter medications (comma-separated)"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-futuristic w-full h-20 resize-none"
                  placeholder="Additional notes..."
                />
              </div>

              <button
                type="submit"
                disabled={creatingRecord}
                className="btn-neon w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {creatingRecord ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Record...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Create Record
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory; 