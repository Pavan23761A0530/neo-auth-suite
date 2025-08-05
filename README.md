# Healthcare Platform

A modern healthcare management system with user authentication, appointment booking, and medical records management.

## Features

- 🔐 **Secure Authentication**: JWT-based login and registration
- 👥 **Role-based Access**: Separate interfaces for patients and doctors
- 📅 **Appointment Management**: Book and manage appointments
- 📋 **Medical Records**: Secure medical record management
- 🎨 **Modern UI**: Beautiful, responsive design with animations
- 🔒 **Data Security**: SQLite database with encrypted passwords

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the backend server:**
   ```bash
   python app.py
   ```
   
   Or use the provided script:
   ```bash
   python ../start-backend.py
   ```

   The backend will be available at: `http://localhost:5000`

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Or use the provided script (Windows):
   ```bash
   start-frontend.bat
   ```

   The frontend will be available at: `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/health` - Health check

### Appointments
- `POST /api/appointments` - Create appointment (patients only)
- `GET /api/appointments` - Get user's appointments

### Users
- `GET /api/users/doctors` - Get all doctors
- `GET /api/users/profile` - Get user profile

## Database

The application uses SQLite for data storage. The database file (`healthcare.db`) will be created automatically when you first start the backend server.

### Tables
- **users**: User accounts and authentication
- **appointments**: Appointment bookings and management
- **medical_records**: Medical records and history

## Environment Variables

Create a `.env` file in the backend directory:

```env
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
FLASK_ENV=development
FLASK_DEBUG=True
```

## Troubleshooting

### Common Issues

1. **"Failed to fetch" error:**
   - Make sure the backend server is running on port 5000
   - Check that CORS is properly configured
   - Verify the API_BASE_URL in `src/hooks/useAuth.tsx`

2. **Database errors:**
   - The SQLite database will be created automatically
   - Ensure the backend has write permissions in its directory

3. **Port conflicts:**
   - Backend: Change port in `backend/app.py` (line 429)
   - Frontend: Change port in `vite.config.ts`

### Development

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:3000`
- API health check: `http://localhost:5000/api/health`

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation
- SQL injection prevention

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
