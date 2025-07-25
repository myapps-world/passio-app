#!/bin/bash

# Passio Deployment Script
# This script helps deploy Passio to various cloud providers

set -e

echo "🚀 Passio Deployment Script"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_status "Docker is installed ✓"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_status "Docker Compose is installed ✓"
}

# Create environment file
create_env_file() {
    print_step "Creating environment file..."
    
    if [ ! -f .env ]; then
        cat > .env << EOF
# Database Configuration
DB_HOST=mysql
DB_PORT=3306
DB_NAME=passio
DB_USER=passio_user
DB_PASSWORD=$(openssl rand -base64 32)
DB_ROOT_PASSWORD=$(openssl rand -base64 32)

# Redis Configuration
REDIS_URL=redis://redis:6379

# JWT and Encryption
JWT_SECRET=$(openssl rand -base64 64)
ENCRYPTION_KEY=$(openssl rand -hex 32)

# API Configuration
API_URL=http://localhost:8000

# Payment Configuration (Add your own keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here

# Email Configuration (Add your own SMTP settings)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Application Settings
NODE_ENV=production
PORT=8000
EOF
        print_status "Environment file created at .env"
        print_warning "Please edit .env file and add your payment and email credentials"
    else
        print_status "Environment file already exists"
    fi
}

# Install dependencies
install_dependencies() {
    print_step "Installing dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        print_status "Root dependencies installed ✓"
    fi
    
    if [ -f "packages/backend/package.json" ]; then
        cd packages/backend
        npm install
        cd ../..
        print_status "Backend dependencies installed ✓"
    fi
    
    if [ -f "packages/frontend/package.json" ]; then
        cd packages/frontend
        npm install
        cd ../..
        print_status "Frontend dependencies installed ✓"
    fi
}

# Build application
build_application() {
    print_step "Building application..."
    
    # Build backend
    if [ -f "packages/backend/package.json" ]; then
        cd packages/backend
        npm run build
        cd ../..
        print_status "Backend built successfully ✓"
    fi
    
    # Build frontend
    if [ -f "packages/frontend/package.json" ]; then
        cd packages/frontend
        npm run build
        cd ../..
        print_status "Frontend built successfully ✓"
    fi
}

# Deploy with Docker Compose
deploy_docker() {
    print_step "Deploying with Docker Compose..."
    
    # Stop existing containers
    docker-compose down
    
    # Build and start services
    docker-compose up -d --build
    
    print_status "Application deployed successfully! 🎉"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:8000"
    print_status "Database Admin: http://localhost:8080"
}

# Deploy for development
deploy_development() {
    print_step "Setting up development environment..."
    
    # Stop existing containers
    docker-compose -f docker-compose.dev.yml down
    
    # Start development services
    docker-compose -f docker-compose.dev.yml up -d --build
    
    print_status "Development environment ready! 🎉"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:8000"
    print_status "Database Admin: http://localhost:8080"
}

# Deploy to Vercel (Frontend only)
deploy_vercel() {
    print_step "Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Install it with: npm i -g vercel"
        exit 1
    fi
    
    cd packages/frontend
    vercel --prod
    cd ../..
    
    print_status "Frontend deployed to Vercel! ✓"
}

# Deploy to Railway (Backend)
deploy_railway() {
    print_step "Deploying backend to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI is not installed. Install it with: npm i -g @railway/cli"
        exit 1
    fi
    
    railway deploy
    
    print_status "Backend deployed to Railway! ✓"
}

# Show usage
show_usage() {
    echo "Usage: ./deploy.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  production    Deploy for production using Docker Compose"
    echo "  development   Deploy for development using Docker Compose"
    echo "  vercel        Deploy frontend to Vercel"
    echo "  railway       Deploy backend to Railway"
    echo "  build         Build the application locally"
    echo "  install       Install dependencies"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh production"
    echo "  ./deploy.sh development"
    echo "  ./deploy.sh vercel"
}

# Main deployment logic
main() {
    case "$1" in
        "production")
            print_status "Starting production deployment..."
            check_docker
            check_docker_compose
            create_env_file
            install_dependencies
            build_application
            deploy_docker
            ;;
        "development"|"dev")
            print_status "Starting development deployment..."
            check_docker
            check_docker_compose
            create_env_file
            install_dependencies
            deploy_development
            ;;
        "vercel")
            print_status "Deploying to Vercel..."
            install_dependencies
            build_application
            deploy_vercel
            ;;
        "railway")
            print_status "Deploying to Railway..."
            deploy_railway
            ;;
        "build")
            print_status "Building application..."
            install_dependencies
            build_application
            ;;
        "install")
            print_status "Installing dependencies..."
            install_dependencies
            ;;
        "help"|"--help"|"-h")
            show_usage
            ;;
        *)
            print_error "Invalid option: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Make script executable
chmod +x "$0"

# Run main function with all arguments
main "$@" 