// Flask Backend API Integration
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id?: string;
  diagnosis: string;
  date: string;
  notes: string;
  attachments?: string[];
}

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Appointments
  async getAppointments(userId: string, role: string) {
    return this.request(`/appointments?user_id=${userId}&role=${role}`);
  }

  async bookAppointment(appointmentData: Partial<Appointment>) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id: string, data: Partial<Appointment>) {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelAppointment(id: string) {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Medical History
  async getMedicalHistory(patientId: string) {
    return this.request(`/medical-history/${patientId}`);
  }

  async addMedicalRecord(recordData: Partial<MedicalRecord>) {
    return this.request('/medical-history', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  }

  async updateMedicalRecord(id: string, data: Partial<MedicalRecord>) {
    return this.request(`/medical-history/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Doctors
  async getDoctors() {
    return this.request('/doctors');
  }

  // Notifications (AWS SNS)
  async sendNotification(data: any) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
export type { Appointment, MedicalRecord };