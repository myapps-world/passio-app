# Passio - Smart Subscription Sharing Platform

<div align="center">
  <img src="https://via.placeholder.com/200x200?text=PASSIO" alt="Passio Logo" width="200" height="200">
  
  <h3>Share subscriptions securely with family and friends</h3>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-18.0+-green.svg)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
</div>

## 🌟 Features

### 🔐 Security First
- **End-to-end encryption** with AES-256 for credential storage
- **Secure credential sharing** with one-time access tokens
- **Multi-factor authentication** support
- **Audit logs** for all security events
- **Automatic credential rotation** capabilities

### 💰 Smart Cost Management
- **Automatic cost splitting** with customizable shares
- **Escrow payment system** for secure transactions
- **Stripe & PayPal integration** for seamless payments
- **Budget tracking** and spending insights
- **Real-time payment notifications**

### 👥 Social & Family Features
- **Friend network** with easy invitation system
- **Family-friendly controls** with parental oversight
- **Student verification** for discounted rates
- **Community marketplace** for finding subscription slots
- **Group chat** for subscription coordination

### 📱 Cross-Platform
- **Responsive web app** built with React
- **Mobile apps** for iOS and Android (React Native)
- **Real-time sync** across all devices
- **Offline capability** for essential features

### 🎯 Smart Features
- **Service templates** for popular subscriptions
- **Renewal reminders** with calendar integration
- **Usage analytics** and savings tracking
- **Compliance checking** for ToS requirements
- **Academic calendar sync** for students

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- Docker and Docker Compose
- MySQL 8.0 (or use Docker)
- Redis (or use Docker)

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/passio-app.git
   cd passio-app
   ```

2. **Run the deployment script**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh production
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database Admin: http://localhost:8080

### Option 2: Manual Setup

1. **Install dependencies**
   ```bash
   npm install
   cd packages/backend && npm install
   cd ../frontend && npm install
   cd ../..
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the database**
   ```bash
   docker-compose up -d mysql redis
   ```

4. **Run database migrations**
   ```bash
   cd packages/backend
   npm run migrate
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Backend Stack
- **Node.js** with Express.js framework
- **TypeScript** for type safety
- **MySQL** for primary data storage
- **Redis** for caching and sessions
- **Socket.IO** for real-time communication
- **Stripe & PayPal** for payment processing
- **JWT** for authentication
- **AES-256** for encryption

### Frontend Stack
- **React 18** with modern hooks
- **TypeScript** for type safety
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Query** for state management
- **React Router** for navigation
- **Socket.IO Client** for real-time updates

### Mobile Stack
- **React Native** for cross-platform development
- **Expo** for easy development and deployment
- **Shared business logic** with the web app
- **Native navigation** and components

## 📁 Project Structure

```
passio-app/
├── packages/
│   ├── backend/           # Node.js API server
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   └── package.json
│   ├── frontend/          # React web application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── contexts/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── package.json
│   ├── mobile/            # React Native mobile app
│   └── shared/            # Shared utilities and types
├── database/
│   ├── migrations/        # Database schema migrations
│   └── seeds/            # Database seed data
├── docker-compose.yml     # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
├── Dockerfile            # Production Docker image
├── Dockerfile.dev        # Development Docker image
├── deploy.sh             # Deployment script
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=passio
DB_USER=passio_user
DB_PASSWORD=your_password

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_32_character_encryption_key

# Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_APP_ENV=development
```

## 🚀 Deployment

### Cloud Deployment Options

#### 1. Vercel + Railway (Recommended)
- **Frontend**: Deploy to Vercel for global CDN
- **Backend**: Deploy to Railway for managed infrastructure

```bash
# Deploy frontend to Vercel
./deploy.sh vercel

# Deploy backend to Railway
./deploy.sh railway
```

#### 2. Docker on Any Cloud Provider
- Works with AWS ECS, Google Cloud Run, Azure Container Instances
- Use the provided Dockerfile for production deployment

#### 3. Traditional VPS
- Use Docker Compose for easy setup
- Includes database, caching, and reverse proxy

### Deployment Script Usage

```bash
# Production deployment with Docker
./deploy.sh production

# Development environment
./deploy.sh development

# Deploy to Vercel (frontend only)
./deploy.sh vercel

# Deploy to Railway (backend only)
./deploy.sh railway

# Build locally
./deploy.sh build
```

## 🔒 Security Features

- **AES-256 encryption** for credential storage
- **JWT tokens** with refresh token rotation
- **Rate limiting** on all API endpoints
- **CORS protection** and security headers
- **Input validation** and sanitization
- **SQL injection prevention**
- **XSS protection**
- **CSRF protection**
- **Audit logging** for all sensitive operations

## 🧪 Testing

```bash
# Run backend tests
cd packages/backend
npm test

# Run frontend tests
cd packages/frontend
npm test

# Run all tests
npm test
```

## 📊 Monitoring & Analytics

- **Health checks** for all services
- **Prometheus metrics** for monitoring
- **Error tracking** with detailed logs
- **Performance monitoring**
- **User analytics** (privacy-focused)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@passio.app
- 💬 Discord: [Join our community](https://discord.gg/passio)
- 📖 Documentation: [docs.passio.app](https://docs.passio.app)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/passio-app/issues)

## 🗺️ Roadmap

- [ ] **Phase 1**: Core subscription sharing (MVP)
- [ ] **Phase 2**: Payment system and escrow
- [ ] **Phase 3**: Mobile applications
- [ ] **Phase 4**: Marketplace and community features
- [ ] **Phase 5**: Advanced analytics and AI recommendations
- [ ] **Phase 6**: Enterprise features and SSO

## 🏆 Acknowledgments

- Built with ❤️ for students and families
- Inspired by the need for affordable digital services
- Special thanks to the open-source community

---

<div align="center">
  <p>Made with ❤️ by the Passio Team</p>
  <p>
    <a href="https://passio.app">Website</a> •
    <a href="https://docs.passio.app">Documentation</a> •
    <a href="https://twitter.com/passio_app">Twitter</a>
  </p>
</div> 