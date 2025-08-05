#!/bin/bash

# Healthcare Platform AWS Deployment Script
# This script deploys the Flask backend to AWS EC2

set -e

echo "🚀 Starting Healthcare Platform Deployment..."

# Configuration
EC2_INSTANCE_ID="your-ec2-instance-id"
EC2_KEY_PATH="~/.ssh/your-key.pem"
EC2_USER="ubuntu"
EC2_HOST="your-ec2-public-ip"
APP_NAME="healthcare-platform"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v ssh &> /dev/null; then
        print_error "SSH is not available. Please install it first."
        exit 1
    fi
    
    print_status "Prerequisites check passed!"
}

# Create deployment package
create_deployment_package() {
    print_status "Creating deployment package..."
    
    # Create deployment directory
    mkdir -p deployment
    
    # Copy backend files
    cp -r backend/* deployment/
    
    # Copy requirements
    cp backend/requirements.txt deployment/
    
    # Create systemd service file
    cat > deployment/healthcare-platform.service << EOF
[Unit]
Description=Healthcare Platform Flask App
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/healthcare-platform
Environment="PATH=/home/ubuntu/healthcare-platform/venv/bin"
ExecStart=/home/ubuntu/healthcare-platform/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

    # Create nginx configuration
    cat > deployment/nginx.conf << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    print_status "Deployment package created!"
}

# Deploy to EC2
deploy_to_ec2() {
    print_status "Deploying to EC2 instance..."
    
    # Create deployment archive
    tar -czf deployment.tar.gz -C deployment .
    
    # Upload to EC2
    print_status "Uploading files to EC2..."
    scp -i $EC2_KEY_PATH deployment.tar.gz $EC2_USER@$EC2_HOST:~/
    
    # Execute deployment commands on EC2
    ssh -i $EC2_KEY_PATH $EC2_USER@$EC2_HOST << 'EOF'
        set -e
        
        echo "📦 Extracting deployment package..."
        tar -xzf deployment.tar.gz
        
        echo "🐍 Setting up Python environment..."
        sudo apt-get update
        sudo apt-get install -y python3-pip python3-venv nginx
        
        echo "📁 Creating application directory..."
        mkdir -p ~/healthcare-platform
        mv * ~/healthcare-platform/
        cd ~/healthcare-platform
        
        echo "🔧 Creating virtual environment..."
        python3 -m venv venv
        source venv/bin/activate
        
        echo "📦 Installing Python dependencies..."
        pip install -r requirements.txt
        pip install gunicorn
        
        echo "🔐 Setting up environment variables..."
        if [ ! -f .env ]; then
            echo "Please create .env file with your AWS credentials"
            echo "AWS_ACCESS_KEY_ID=your_key"
            echo "AWS_SECRET_ACCESS_KEY=your_secret"
            echo "AWS_REGION=us-east-1"
            echo "JWT_SECRET_KEY=your_jwt_secret"
        fi
        
        echo "🔧 Setting up systemd service..."
        sudo cp healthcare-platform.service /etc/systemd/system/
        sudo systemctl daemon-reload
        sudo systemctl enable healthcare-platform
        sudo systemctl start healthcare-platform
        
        echo "🌐 Setting up nginx..."
        sudo cp nginx.conf /etc/nginx/sites-available/healthcare-platform
        sudo ln -sf /etc/nginx/sites-available/healthcare-platform /etc/nginx/sites-enabled/
        sudo rm -f /etc/nginx/sites-enabled/default
        sudo systemctl restart nginx
        
        echo "🔒 Setting up firewall..."
        sudo ufw allow 22
        sudo ufw allow 80
        sudo ufw allow 443
        sudo ufw --force enable
        
        echo "🧹 Cleaning up..."
        rm -f ~/deployment.tar.gz
        
        echo "✅ Deployment completed successfully!"
        echo "🌐 Your application should be available at: http://$EC2_HOST"
EOF
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait a moment for services to start
    sleep 10
    
    # Check if the application is responding
    if curl -f http://$EC2_HOST/api/health > /dev/null 2>&1; then
        print_status "✅ Health check passed! Application is running."
    else
        print_warning "⚠️  Health check failed. Please check the application logs."
        ssh -i $EC2_KEY_PATH $EC2_USER@$EC2_HOST "sudo journalctl -u healthcare-platform -n 50"
    fi
}

# Main deployment process
main() {
    print_status "Starting Healthcare Platform deployment..."
    
    check_prerequisites
    create_deployment_package
    deploy_to_ec2
    health_check
    
    print_status "🎉 Deployment completed!"
    print_status "Your Healthcare Platform is now running at: http://$EC2_HOST"
    print_status "API Health Check: http://$EC2_HOST/api/health"
}

# Run main function
main "$@" 