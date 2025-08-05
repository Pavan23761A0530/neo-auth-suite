# Healthcare Management Platform - Flask Backend

A secure, scalable cloud-based healthcare management platform built with Flask, AWS EC2, and DynamoDB.

## Features

- **User Authentication & Access Control**
  - JWT-based authentication
  - Role-based access (Patient, Doctor)
  - Secure password hashing with bcrypt

- **Appointment Management**
  - Book, view, and update appointments
  - Role-based appointment access
  - Real-time appointment status tracking

- **Medical Records Management**
  - Secure medical record creation and access
  - Patient history management
  - Doctor-only record creation permissions

- **AWS Integration**
  - DynamoDB for data storage
  - IAM for access control
  - Scalable cloud infrastructure

## Setup Instructions

### Prerequisites

1. Python 3.8+
2. AWS Account with DynamoDB access
3. AWS CLI configured

### Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your AWS credentials:
   ```env
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=us-east-1
   JWT_SECRET_KEY=your-super-secret-jwt-key
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Appointments
- `POST /api/appointments` - Create appointment (Patients only)
- `GET /api/appointments` - Get appointments (Role-based)
- `PUT /api/appointments/<id>` - Update appointment

### Medical Records
- `POST /api/medical-records` - Create medical record (Doctors only)
- `GET /api/medical-records/<patient_id>` - Get medical records

### Users
- `GET /api/users/doctors` - Get list of doctors
- `GET /api/users/profile` - Get user profile

## AWS Deployment

### EC2 Setup
1. Launch an EC2 instance (t2.micro for testing)
2. Install Python and dependencies
3. Configure security groups for port 5000
4. Set up environment variables
5. Run with gunicorn for production

### DynamoDB Tables
The application automatically creates the following tables:
- `healthcare_users` - User accounts and authentication
- `healthcare_appointments` - Appointment data
- `healthcare_medical_records` - Medical records

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- AWS IAM integration
- CORS configuration
- Input validation and sanitization

## Production Deployment

For production deployment:

1. Use gunicorn instead of Flask development server
2. Set up HTTPS with SSL certificates
3. Configure proper AWS IAM roles
4. Set up monitoring and logging
5. Use environment-specific configurations 