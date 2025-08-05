#!/bin/bash

# Healthcare Platform Quick Start Script
# This script sets up the development environment quickly

set -e

echo "🏥 Healthcare Platform Quick Start"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_status "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed!"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_status "Node.js and npm are installed!"
}

# Check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3 first."
        print_status "Visit: https://www.python.org/downloads/"
        exit 1
    fi
    
    print_status "Python 3 is installed!"
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        cat > .env << EOF
# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
EOF
        print_warning "Created .env file. Please update it with your AWS credentials!"
    else
        print_status ".env file already exists!"
    fi
}

# Install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend dependencies..."
    npm install
    print_status "Frontend dependencies installed!"
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend dependencies..."
    cd backend
    pip install -r requirements.txt
    cd ..
    print_status "Backend dependencies installed!"
}

# Start development servers
start_dev() {
    print_status "Starting development servers..."
    
    # Start backend in background
    print_status "Starting Flask backend..."
    cd backend
    python app.py &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Start frontend
    print_status "Starting React frontend..."
    npm run dev &
    FRONTEND_PID=$!
    
    print_status "Development servers started!"
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: http://localhost:5173"
    print_status "API Health: http://localhost:5000/api/health"
    
    # Wait for user to stop
    echo ""
    print_warning "Press Ctrl+C to stop the servers"
    
    # Cleanup function
    cleanup() {
        print_status "Stopping servers..."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        exit 0
    }
    
    # Set trap for cleanup
    trap cleanup SIGINT SIGTERM
    
    # Wait for processes
    wait
}

# Start with Docker
start_docker() {
    print_status "Starting with Docker..."
    
    if [ ! -f .env ]; then
        setup_env
    fi
    
    print_warning "Please update .env file with your AWS credentials before starting!"
    read -p "Press Enter to continue..."
    
    docker-compose up --build
}

# Main menu
show_menu() {
    echo ""
    echo "Choose an option:"
    echo "1) Setup development environment"
    echo "2) Start development servers"
    echo "3) Start with Docker"
    echo "4) Setup only (no start)"
    echo "5) Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            check_docker
            check_node
            check_python
            setup_env
            setup_frontend
            setup_backend
            print_status "Development environment setup complete!"
            ;;
        2)
            check_node
            check_python
            if [ ! -f .env ]; then
                setup_env
            fi
            start_dev
            ;;
        3)
            check_docker
            start_docker
            ;;
        4)
            check_docker
            check_node
            check_python
            setup_env
            setup_frontend
            setup_backend
            print_status "Setup complete! You can now start the servers manually."
            ;;
        5)
            print_status "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            show_menu
            ;;
    esac
}

# Main execution
main() {
    echo ""
    print_status "Welcome to Healthcare Platform!"
    echo ""
    
    show_menu
}

# Run main function
main "$@" 