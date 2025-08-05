from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import sqlite3
import bcrypt
import json
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
jwt = JWTManager(app)
CORS(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('healthcare.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    
    # Create appointments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            appointment_id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL,
            doctor_id TEXT NOT NULL,
            appointment_date TEXT NOT NULL,
            appointment_time TEXT NOT NULL,
            reason TEXT,
            status TEXT DEFAULT 'scheduled',
            created_at TEXT NOT NULL,
            FOREIGN KEY (patient_id) REFERENCES users (user_id),
            FOREIGN KEY (doctor_id) REFERENCES users (user_id)
        )
    ''')
    
    # Create medical_records table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medical_records (
            record_id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL,
            doctor_id TEXT NOT NULL,
            diagnosis TEXT,
            treatment TEXT,
            medications TEXT,
            notes TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (patient_id) REFERENCES users (user_id),
            FOREIGN KEY (doctor_id) REFERENCES users (user_id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        role = data.get('role', 'patient')  # Default to patient
        
        if not email or not password or not name:
            return jsonify({'error': 'Missing required fields'}), 400
        
        conn = sqlite3.connect('healthcare.db')
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'User already exists'}), 409
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO users (user_id, email, password, name, role, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, email, hashed_password.decode('utf-8'), name, role, datetime.utcnow().isoformat()))
        
        conn.commit()
        conn.close()
        
        # Create access token
        access_token = create_access_token(identity=user_id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': user_id,
                'email': email,
                'name': name,
                'role': role
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Missing email or password'}), 400
        
        conn = sqlite3.connect('healthcare.db')
        cursor = conn.cursor()
        
        # Get user from database
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user_data = cursor.fetchone()
        conn.close()
        
        if not user_data:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        user = {
            'user_id': user_data[0],
            'email': user_data[1],
            'password': user_data[2],
            'name': user_data[3],
            'role': user_data[4]
        }
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=user['user_id'])
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user['user_id'],
                'email': user['email'],
                'name': user['name'],
                'role': user['role']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Appointment Routes
@app.route('/api/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        conn = sqlite3.connect('healthcare.db')
        cursor = conn.cursor()
        
        # Verify user is a patient
        cursor.execute('SELECT role FROM users WHERE user_id = ?', (current_user_id,))
        user_data = cursor.fetchone()
        if not user_data or user_data[0] != 'patient':
            conn.close()
            return jsonify({'error': 'Only patients can book appointments'}), 403
        
        appointment_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO appointments (appointment_id, patient_id, doctor_id, appointment_date, appointment_time, reason, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (appointment_id, current_user_id, data.get('doctor_id'), data.get('appointment_date'), 
              data.get('appointment_time'), data.get('reason', ''), 'scheduled', datetime.utcnow().isoformat()))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Appointment created successfully',
            'appointment_id': appointment_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    try:
        current_user_id = get_jwt_identity()
        
        conn = sqlite3.connect('healthcare.db')
        cursor = conn.cursor()
        
        # Get user role
        cursor.execute('SELECT role FROM users WHERE user_id = ?', (current_user_id,))
        user_data = cursor.fetchone()
        user_role = user_data[0] if user_data else None
        
        if user_role == 'doctor':
            # Get appointments for doctor
            cursor.execute('SELECT * FROM appointments WHERE doctor_id = ?', (current_user_id,))
        else:
            # Get appointments for patient
            cursor.execute('SELECT * FROM appointments WHERE patient_id = ?', (current_user_id,))
        
        appointments_data = cursor.fetchall()
        conn.close()
        
        appointments = []
        for appt in appointments_data:
            appointments.append({
                'appointment_id': appt[0],
                'patient_id': appt[1],
                'doctor_id': appt[2],
                'appointment_date': appt[3],
                'appointment_time': appt[4],
                'reason': appt[5],
                'status': appt[6],
                'created_at': appt[7]
            })
        
        return jsonify({'appointments': appointments}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User Routes
@app.route('/api/users/doctors', methods=['GET'])
@jwt_required()
def get_doctors():
    try:
        conn = sqlite3.connect('healthcare.db')
        cursor = conn.cursor()
        
        # Get all doctors
        cursor.execute('SELECT user_id, name, email FROM users WHERE role = ?', ('doctor',))
        doctors_data = cursor.fetchall()
        conn.close()
        
        doctors = []
        for doctor in doctors_data:
            doctors.append({
                'id': doctor[0],
                'name': doctor[1],
                'email': doctor[2]
            })
        
        return jsonify({'doctors': doctors}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        
        conn = sqlite3.connect('healthcare.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT user_id, email, name, role FROM users WHERE user_id = ?', (current_user_id,))
        user_data = cursor.fetchone()
        conn.close()
        
        if not user_data:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': user_data[0],
            'email': user_data[1],
            'name': user_data[2],
            'role': user_data[3]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check route
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Healthcare API is running'}), 200

if __name__ == '__main__':
    # Initialize database on startup
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000) 