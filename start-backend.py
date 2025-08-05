#!/usr/bin/env python3
"""
Simple script to start the healthcare backend server
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    # Change to backend directory
    backend_dir = Path(__file__).parent / "backend"
    if not backend_dir.exists():
        print("Error: Backend directory not found!")
        sys.exit(1)
    
    os.chdir(backend_dir)
    
    # Check if requirements are installed
    try:
        import flask
        import flask_cors
        import flask_jwt_extended
        import bcrypt
        import dotenv
    except ImportError as e:
        print(f"Missing dependency: {e}")
        print("Installing requirements...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
    
    # Set default environment variables if not present
    if not os.getenv('JWT_SECRET_KEY'):
        os.environ['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
    
    if not os.getenv('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    print("Starting Healthcare Backend Server...")
    print("Server will be available at: http://localhost:5000")
    print("API Health Check: http://localhost:5000/api/health")
    print("Press Ctrl+C to stop the server")
    
    # Start the Flask app
    try:
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 