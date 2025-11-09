<div align="center">

# CollabNest
### Next-Generation Collaborative Workspace Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3+-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Firebase-FF6B35?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase">
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io">
  <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/Arun-kushwaha007/Deadline?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/github/stars/Arun-kushwaha007/Deadline?style=for-the-badge" alt="Stars">
  <img src="https://img.shields.io/github/forks/Arun-kushwaha007/Deadline?style=for-the-badge" alt="Forks">
  <img src="https://img.shields.io/github/issues/Arun-kushwaha007/Deadline?style=for-the-badge" alt="Issues">
</p>

<p align="center">
  A comprehensive MERN-Stack collaboration platform designed for modern teams with advanced real-time features, intelligent notifications, and seamless user experience.
</p>

<p align="center">
  Built with cutting-edge technologies including React 18+, Vite 5, Firebase Cloud Messaging, Socket.io, Redux Toolkit, Tailwind CSS, Google OAuth 2.0, MongoDB, Express.js, Node.js, and Redis caching for lightning-fast performance.
</p>

<p align="center">
  <a href="#demo">Demo</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#contributing">Contributing</a>
</p>

</div>

---
# System Architecture Diagram  

  

```mermaid  
graph TB  
    subgraph "Client Layer"  
        WEB["Web Browser<br/>React 18.3+ / Vite 5"]  
        PWA["Progressive Web App<br/>Offline Support"]  
    end  
  
    subgraph "Frontend Architecture"  
        UI["UI Components<br/>Tailwind CSS 3.4"]  
        STATE["State Management<br/>Redux Toolkit"]  
        QUERY["Server State<br/>React Query"]  
        ROUTER["Routing<br/>React Router"]  
    end  
  
    subgraph "Authentication & Security"  
        OAUTH["Google OAuth 2.0"]  
        JWT["JWT Token Manager<br/>Access + Refresh"]  
        GUARD["Route Guards"]  
    end  
  
    subgraph "Real-time Layer"  
        SOCKET["Socket.io Client"]  
        FCM["Firebase Cloud Messaging"]  
        NOTIF["Notification Manager"]  
    end  
  
    subgraph "API Gateway"  
        NGINX["Load Balancer<br/>nginx/HAProxy"]  
    end  
  
    subgraph "Backend Services"  
        EXPRESS["Express.js Server<br/>Node.js 20+"]  
        MIDDLEWARE["Middleware Layer<br/>Auth/CORS/Rate Limit"]  
        CONTROLLERS["Controllers<br/>Business Logic"]  
        ROUTES["API Routes<br/>/api/v1"]  
    end  
  
    subgraph "Real-time Backend"  
        SOCKETIO["Socket.io Server<br/>WebSocket"]  
        EVENTS["Event Handlers"]  
    end  
  
    subgraph "Data Layer"  
        MONGO[("MongoDB 7<br/>Primary Database")]  
        REDIS[("Redis 7<br/>Cache & Sessions")]  
    end  
  
    subgraph "External Services"  
        FIREBASE["Firebase Admin SDK<br/>Push Notifications"]  
        GOOGLE["Google OAuth API"]  
    end  
  
    subgraph "Storage & CDN"  
        S3["Cloud Storage<br/>AWS S3"]  
        CDN["Content Delivery<br/>CloudFront"]  
    end  
  
    WEB --> UI  
    PWA --> UI  
    UI --> STATE  
    UI --> QUERY  
    UI --> ROUTER  
      
    STATE --> OAUTH  
    OAUTH --> JWT  
    JWT --> GUARD  
    GUARD --> ROUTES  
      
    UI --> SOCKET  
    SOCKET --> NOTIF  
    FCM --> NOTIF  
      
    QUERY --> NGINX  
    ROUTER --> NGINX  
      
    NGINX --> EXPRESS  
    EXPRESS --> MIDDLEWARE  
    MIDDLEWARE --> CONTROLLERS  
    CONTROLLERS --> ROUTES  
      
    SOCKET --> SOCKETIO  
    SOCKETIO --> EVENTS  
      
    ROUTES --> MONGO  
    ROUTES --> REDIS  
    CONTROLLERS --> MONGO  
    CONTROLLERS --> REDIS  
    EVENTS --> MONGO  
      
    EXPRESS --> FIREBASE  
    OAUTH --> GOOGLE  
      
    MONGO --> S3  
    S3 --> CDN  
    CDN --> WEB
```


---

## Table of Contents

- [Project Overview](#project-overview)
  - [Motive](#motive)
  - [Core Concept](#core-concept)
  - [Demo](#demo)
- [Features & Capabilities](#features--capabilities)
  - [Core Features](#core-features)
  - [Technical Features](#technical-features)
  - [UI/UX Features](#uiux-features)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Environment Configuration](#environment-configuration)
- [Project Architecture](#project-architecture)
  - [Project Structure](#project-structure)
  - [Key Integrations](#key-integrations)
  - [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Performance & Benchmarking](#performance--benchmarking-report)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

---

## Project Overview

### Motive

CollabNest revolutionizes the way distributed teams, students, and organizations collaborate in the digital age. The platform addresses critical challenges in modern remote work environments:

**Core Objectives:**
- **Global Collaboration:** Break down geographical barriers
- **Real-time Synchronization:** Instant updates across all users
- **Enterprise Security:** Secured with OAuth 2.0
- **Cross-platform Access:** Web, mobile, and desktop compatibility

**Key Benefits:**
- **Increased Productivity:** Streamlined workflows and task management
- **Enhanced User Experience:** Intuitive design with dark/light mode support
- **Smart Notifications:** AI-powered priority-based alerts
- **Analytics Dashboard:** Comprehensive insights and reporting

---

### Core Concept

CollabNest is architected around five fundamental pillars:

#### 1. Real-time Collaboration Engine
- **WebSocket Infrastructure:** Ultra-low latency communication via Socket.io
- **Live Updates:** Instant synchronization of tasks, comments, and file changes
- **Conflict Resolution:** Smart merge algorithms for concurrent edits
- **Offline Support:** Progressive Web App capabilities with sync on reconnect

#### 2. Intelligent Notification System
- **Multi-channel Delivery:** Push notifications, email (v2.0), SMS (v2.0), and in-app alerts
- **Smart Prioritization:** AI-powered importance scoring and filtering
- **Customizable Preferences:** Granular control over notification types and timing
- **Analytics Integration:** Track engagement and optimize delivery strategies

#### 3. Enterprise-Grade Security
- **OAuth 2.0 Integration:** Seamless Google authentication with enterprise SSO support
- **JWT Token Management:** Secure, stateless authentication with refresh tokens
- **Role-based Access Control:** Granular permissions and organizational hierarchies
- **Data Encryption:** End-to-end encryption for sensitive communications

#### 4. Modern User Experience
- **Component-driven Architecture:** Reusable UI components with Storybook documentation
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices
- **Accessibility First:** WCAG 2.1 AA compliance with screen reader support
- **Performance Optimized:** Code splitting, lazy loading, and caching strategies

#### 5. Advanced Analytics & Insights
- **Real-time Dashboards:** Live metrics and KPI tracking
- **User Behavior Analytics:** Heatmaps, session recordings, and funnel analysis
- **Performance Monitoring:** Application health and error tracking
- **Custom Reporting:** Exportable reports with scheduling capabilities

---

### Demo

> **Live Demo Coming Soon!** We're preparing an interactive demo environment.
> 
> In the meantime, check out our [Screenshots Gallery](./docs/screenshots/) and [Feature Videos](./docs/videos/).

**Quick Links:**
- **Live Application:** *Coming Soon*
- **Mobile Preview:** *Coming Soon*
- **Interactive Playground:** *Coming Soon*
- **Analytics Dashboard:** *Coming Soon*

---

## Features & Capabilities

### Core Features

| Feature Category | Capabilities | Status |
|------------------|--------------|--------|
| **Organization Management** | Multi-tenant workspace, role-based access, team hierarchies | ✅ Production Ready |
| **Task & Project Management** | Kanban boards, Gantt charts, deadline tracking, dependencies | ✅ Production Ready |
| **Real-time Communication** | Live chat, video calls, screen sharing, collaborative editing | 🚧 In Development |
| **Smart Notifications** | Push notifications, email alerts, mobile notifications, digest emails | ✅ Production Ready |
| **Analytics & Reporting** | Custom dashboards, performance metrics, team insights, export tools | 🚧 Beta Version |
| **Security & Privacy** | OAuth 2.0, SSO, data encryption, audit logs, compliance tools | ✅ Production Ready |
| **Mobile Responsive** | PWA support, mobile optimized, offline capabilities, native feel | ✅ Production Ready |
| **Customization** | Themes, branding, custom fields, workflow automation | 🚧 In Development |

### Technical Features

**Frontend Architecture:**
- **React 18.3+** with Concurrent Features
- **Vite 5** for lightning-fast builds
- **Tailwind CSS 3.4** with custom design system
- **Redux Toolkit** for state management
- **React Query** for server state caching

**Backend Infrastructure:**
- **Node.js 20+** with ES2023 features
- **Express.js** with middleware ecosystem
- **MongoDB 7** with aggregation pipelines
- **Redis 7** for caching and sessions
- **Socket.io 4** for real-time features
- **Firebase Admin SDK** for notifications

**Authentication & Security:**
- **Google OAuth 2.0** integration
- **JWT** with refresh token rotation
- **HTTPS** everywhere with SSL/TLS
- **CORS** and security headers
- **Rate limiting** and DDoS protection
- **Audit logging** for compliance

### UI/UX Features

| Design Element | Implementation | Benefits |
|----------------|----------------|----------|
| **Dark/Light Mode** | System preference detection, manual toggle, per-component theming | Reduced eye strain, better accessibility |
| **Responsive Design** | Mobile-first approach, flexible grids, adaptive components | Seamless experience across all devices |
| **Accessibility** | ARIA labels, keyboard navigation, screen reader support | Inclusive design for all users |
| **Animations** | Framer Motion integration, micro-interactions, loading states | Enhanced user engagement |
| **Design System** | Consistent color palette, typography scale, component library | Cohesive brand experience |
| **Search & Filters** | Full-text search, advanced filters, saved searches | Quick content discovery |

---

## How It Works

<table>
<tr>
<td width="33%">

### 🔐 **Authentication Flow**
<img src="./assets/authflow.png">



**Key Components:**
- Secure Google OAuth 2.0 integration
- JWT token management with refresh
- Redux-managed authentication state
- Protected route guards
- Automatic session management

</td>
<td width="33%">

### 🌐 **Real-Time Architecture**
<img src="./assets/realtimeArch.png">


**Key Components:**
- WebSocket connections via Socket.io
- Event-driven architecture
- Real-time collaboration features
- Auto-reconnection handling
- Conflict resolution algorithms

</td>
<td width="33%">

### 📱 **Notification Pipeline**
<img src="./assets/notificationPipeline.png">


**Key Components:**
- Firebase Cloud Messaging integration
- Multi-channel notification delivery
- Smart notification prioritization
- User preference management
- Analytics and tracking

</td>
</tr>
</table>


---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Download | Verification |
|------|---------|----------|--------------|
| **Node.js** | 20.0.0+ | [Download](https://nodejs.org/) | `node --version` |
| **npm** | 10.0.0+ | Included with Node.js | `npm --version` |
| **MongoDB** | 7.0.0+ | [Download](https://www.mongodb.com/try/download/community) | `mongod --version` |
| **Redis** | 7.0.0+ | [Download](https://redis.io/download) | `redis-server --version` |
| **Git** | Latest | [Download](https://git-scm.com/) | `git --version` |

**Optional Tools:**
- **Docker** for containerized development
- **VS Code** recommended IDE with extensions

---

### Quick Start

Follow these steps to get CollabNest running locally:

#### 1. Clone the Repository
```bash
git clone https://github.com/Arun-kushwaha007/Deadline.git
cd Deadline
```

#### 2. Setup Frontend
```bash
cd my-app
npm install
cp .env.example .env
```

#### 3. Setup Backend
```bash
cd server
npm install
cp .env.example .env
npm run db:setup
```

#### 4. Configure Environment Variables
```bash
# Edit frontend environment file
nano my-app/.env

# Edit backend environment file
nano server/.env
```

#### 5. Start Development Servers

**Option A: Start All Services**
```bash
npm run dev:all
```

**Option B: Start Services Individually**
```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
cd my-app && npm run dev

# Terminal 3: Start Redis
redis-server

# Terminal 4: Start MongoDB
mongod
```

#### 6. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Documentation:** *Coming Soon*

---

### Environment Configuration

#### Frontend Configuration (`my-app/.env`)
```env
# Firebase Configuration
VITE_AI_FIREBASE_API_KEY=your_firebase_api_key
VITE_AI_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_AI_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_AI_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_AI_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_AI_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_AI_FIREBASE_MEASUREMENT_ID=G-ABCD123456

# API Configuration
VITE_BACKEND_URL=http://localhost:5000
VITE_API_VERSION=v1
VITE_SOCKET_URL=http://localhost:5000

# Authentication
VITE_GOOGLE_CLIENT_ID=your_google_client_id.googleusercontent.com

# UI Configuration
VITE_APP_NAME=CollabNest
VITE_APP_VERSION=2.0.0
VITE_THEME_PRIMARY=#FF6B35
VITE_THEME_SECONDARY=#38B2AC
```

#### Backend Configuration (`server/.env`)
```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost
API_VERSION=v1

# Database Configuration
MONGO_URI=mongodb://localhost:27017/collabnest
MONGO_DB_NAME=collabnest
MONGO_OPTIONS=retryWrites=true&w=majority

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# Security & Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
BCRYPT_ROUNDS=12

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Email Configuration
RESEND_API_KEY=re_xxxxxxxxx
RESEND_API_SECRET=your_resend_api_secret

# Performance & Caching
CACHE_TTL=3600
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

---

## Project Architecture


### System Architecture Diagram  

```mermaid  
graph TB  
    subgraph "Client Layer"  
        WEB["Web Browser<br/>React 18.3+ / Vite 5"]  
        PWA["Progressive Web App<br/>Offline Support"]  
    end  
  
    subgraph "Frontend Architecture"  
        UI["UI Components<br/>Tailwind CSS 3.4"]  
        STATE["State Management<br/>Redux Toolkit"]  
        QUERY["Server State<br/>React Query"]  
        ROUTER["Routing<br/>React Router"]  
    end  
  
    subgraph "Authentication & Security"  
        OAUTH["Google OAuth 2.0"]  
        JWT["JWT Token Manager<br/>Access + Refresh"]  
        GUARD["Route Guards"]  
    end  
  
    subgraph "Real-time Layer"  
        SOCKET["Socket.io Client"]  
        FCM["Firebase Cloud Messaging"]  
        NOTIF["Notification Manager"]  
    end  
  
    subgraph "API Gateway"  
        NGINX["Load Balancer<br/>nginx/HAProxy"]  
    end  
  
    subgraph "Backend Services"  
        EXPRESS["Express.js Server<br/>Node.js 20+"]  
        MIDDLEWARE["Middleware Layer<br/>Auth/CORS/Rate Limit"]  
        CONTROLLERS["Controllers<br/>Business Logic"]  
        ROUTES["API Routes<br/>/api/v1"]  
    end  
  
    subgraph "Real-time Backend"  
        SOCKETIO["Socket.io Server<br/>WebSocket"]  
        EVENTS["Event Handlers"]  
    end  
  
    subgraph "Data Layer"  
        MONGO[("MongoDB 7<br/>Primary Database")]  
        REDIS[("Redis 7<br/>Cache & Sessions")]  
    end  
  
    subgraph "External Services"  
        FIREBASE["Firebase Admin SDK<br/>Push Notifications"]  
        GOOGLE["Google OAuth API"]  
    end  
  
    subgraph "Storage & CDN"  
        S3["Cloud Storage<br/>AWS S3"]  
        CDN["Content Delivery<br/>CloudFront"]  
    end  
  
    WEB --> UI  
    PWA --> UI  
    UI --> STATE  
    UI --> QUERY  
    UI --> ROUTER  
      
    STATE --> OAUTH  
    OAUTH --> JWT  
    JWT --> GUARD  
    GUARD --> ROUTES  
      
    UI --> SOCKET  
    SOCKET --> NOTIF  
    FCM --> NOTIF  
      
    QUERY --> NGINX  
    ROUTER --> NGINX  
      
    NGINX --> EXPRESS  
    EXPRESS --> MIDDLEWARE  
    MIDDLEWARE --> CONTROLLERS  
    CONTROLLERS --> ROUTES  
      
    SOCKET --> SOCKETIO  
    SOCKETIO --> EVENTS  
      
    ROUTES --> MONGO  
    ROUTES --> REDIS  
    CONTROLLERS --> MONGO  
    CONTROLLERS --> REDIS  
    EVENTS --> MONGO  
      
    EXPRESS --> FIREBASE  
    OAUTH --> GOOGLE  
      
    MONGO --> S3  
    S3 --> CDN  
    CDN --> WEB
```
### Architecture Flow Diagram  
  
```mermaid  
sequenceDiagram  
    participant User  
    participant Frontend  
    participant LoadBalancer  
    participant Backend  
    participant Redis  
    participant MongoDB  
    participant Firebase  
    participant SocketIO  
  
    User->>Frontend: Access Application  
    Frontend->>LoadBalancer: HTTP Request  
    LoadBalancer->>Backend: Route Request  
    Backend->>Redis: Check Cache  
      
    alt Cache Hit  
        Redis-->>Backend: Return Cached Data  
    else Cache Miss  
        Backend->>MongoDB: Query Database  
        MongoDB-->>Backend: Return Data  
        Backend->>Redis: Update Cache  
    end  
      
    Backend-->>Frontend: JSON Response  
      
    User->>Frontend: Perform Action  
    Frontend->>Backend: API Call  
    Backend->>MongoDB: Update Data  
    Backend->>SocketIO: Emit Event  
    SocketIO-->>Frontend: Real-time Update  
    Backend->>Firebase: Send Notification  
    Firebase-->>User: Push Notification
```
### High-Level Architecture  
 
```mermaid  
graph LR  
    subgraph "Client Tier"  
        BROWSER["Web Browser"]  
        MOBILE["Mobile PWA"]  
    end  
      
    subgraph "Presentation Layer"  
        REACT["React 18.3+<br/>Vite 5<br/>Tailwind CSS"]  
        REDUX["Redux Toolkit<br/>State Management"]  
    end  
      
    subgraph "API Layer"  
        LB["Load Balancer"]  
        API["REST API<br/>Express.js"]  
        WS["WebSocket<br/>Socket.io"]  
    end  
      
    subgraph "Business Logic"  
        AUTH["Authentication<br/>OAuth 2.0 + JWT"]  
        TASKS["Task Management"]  
        ORGS["Organization Logic"]  
        NOTIF["Notification Service"]  
    end  
      
    subgraph "Data Tier"  
        MONGO["MongoDB 7<br/>Primary Store"]  
        REDIS["Redis 7<br/>Cache + Sessions"]  
    end  
      
    subgraph "External"  
        GOOGLE["Google OAuth"]  
        FCM["Firebase CM"]  
    end  
      
    BROWSER --> REACT  
    MOBILE --> REACT  
    REACT --> REDUX  
    REDUX --> LB  
      
    LB --> API  
    LB --> WS  
      
    API --> AUTH  
    API --> TASKS  
    API --> ORGS  
    API --> NOTIF  
      
    WS --> NOTIF  
      
    AUTH --> MONGO  
    TASKS --> MONGO  
    ORGS --> MONGO  
    NOTIF --> MONGO  
      
    AUTH --> REDIS  
    API --> REDIS  
      
    AUTH --> GOOGLE  
    NOTIF --> FCM
```
### Frontend Application Structure  

```mermaid  
graph TB  
    subgraph "Entry Point"  
        MAIN["main.jsx<br/>App Bootstrap"]  
        APP["App.jsx<br/>Root Component"]  
    end  
      
    subgraph "Routing Layer"  
        ROUTER["React Router<br/>Route Configuration"]  
        GUARDS["Protected Routes<br/>Auth Guards"]  
    end  
      
    subgraph "Pages"  
        LOGIN["Login Page"]  
        DASH["Dashboard"]  
        TASKS["Tasks Page"]  
        ORGS["Organizations"]  
        PROFILE["Profile"]  
    end  
      
    subgraph "Components"  
        LAYOUT["Layout Components"]  
        UI["UI Components<br/>Buttons, Forms, Cards"]  
        SHARED["Shared Components<br/>Navbar, Sidebar"]  
    end  
      
    subgraph "State Management"  
        STORE["Redux Store"]  
        SLICES["Slices<br/>auth, tasks, orgs"]  
        THUNKS["Async Thunks<br/>API Calls"]  
    end  
      
    subgraph "Services"  
        API["API Service<br/>Axios Instance"]  
        SOCKET["Socket Service<br/>Socket.io Client"]  
        FCM_CLIENT["FCM Service<br/>Push Notifications"]  
    end  
      
    subgraph "Utils"  
        HELPERS["Helper Functions"]  
        CONSTANTS["Constants"]  
        HOOKS["Custom Hooks"]  
    end  
      
    MAIN --> APP  
    APP --> ROUTER  
    ROUTER --> GUARDS  
    GUARDS --> PAGES  
      
    LOGIN --> LAYOUT  
    DASH --> LAYOUT  
    TASKS --> LAYOUT  
    ORGS --> LAYOUT  
    PROFILE --> LAYOUT  
      
    LAYOUT --> UI  
    LAYOUT --> SHARED  
      
    PAGES --> STORE  
    COMPONENTS --> STORE  
      
    STORE --> SLICES  
    SLICES --> THUNKS  
      
    THUNKS --> API  
    THUNKS --> SOCKET  
      
    PAGES --> FCM_CLIENT  
      
    COMPONENTS --> HELPERS  
    COMPONENTS --> HOOKS  
    SERVICES --> CONSTANTS
```
### Backend Server Structure  

```mermaid  
graph TB  
    subgraph "Entry Point"  
        INDEX["index.js<br/>Server Bootstrap"]  
        CONFIG["config/<br/>Environment Setup"]  
    end  
      
    subgraph "Middleware Stack"  
        CORS["CORS Handler"]  
        AUTH_MW["Auth Middleware<br/>JWT Verification"]  
        RATE["Rate Limiter"]  
        ERROR["Error Handler"]  
    end  
      
    subgraph "Routes"  
        AUTH_R["auth routes<br/>/api/auth"]  
        TASK_R["task routes<br/>/api/tasks"]  
        ORG_R["org routes<br/>/api/organizations"]  
        USER_R["user routes<br/>/api/users"]  
    end  
      
    subgraph "Controllers"  
        AUTH_C["authController<br/>Login, Register"]  
        TASK_C["taskController<br/>CRUD Operations"]  
        ORG_C["orgController<br/>Management"]  
        USER_C["userController<br/>Profile"]  
    end  
      
    subgraph "Models"  
        USER_M["User Model<br/>MongoDB Schema"]  
        TASK_M["Task Model"]  
        ORG_M["Organization Model"]  
        NOTIF_M["Notification Model"]  
    end  
      
    subgraph "Services"  
        JWT_S["JWT Service<br/>Token Generation"]  
        REDIS_S["Redis Service<br/>Caching"]  
        FCM_S["FCM Service<br/>Push Notifications"]  
        SOCKET_S["Socket Service<br/>Real-time Events"]  
    end  
      
    subgraph "Database"  
        MONGO_DB["MongoDB Connection"]  
        REDIS_DB["Redis Connection"]  
    end  
      
    INDEX --> CONFIG  
    INDEX --> MIDDLEWARE  
      
    CORS --> AUTH_MW  
    AUTH_MW --> RATE  
    RATE --> ERROR  
      
    MIDDLEWARE --> ROUTES  
      
    AUTH_R --> AUTH_C  
    TASK_R --> TASK_C  
    ORG_R --> ORG_C  
    USER_R --> USER_C  
      
    AUTH_C --> USER_M  
    TASK_C --> TASK_M  
    ORG_C --> ORG_M  
      
    CONTROLLERS --> JWT_S  
    CONTROLLERS --> REDIS_S  
    CONTROLLERS --> FCM_S  
    CONTROLLERS --> SOCKET_S  
      
    USER_M --> MONGO_DB  
    TASK_M --> MONGO_DB  
    ORG_M --> MONGO_DB  
    NOTIF_M --> MONGO_DB  
      
    REDIS_S --> REDIS_DB
```

### Real-Time WebSocket Flow  

```mermaid  
sequenceDiagram  
    participant Client1 as "Client 1<br/>Browser"  
    participant Client2 as "Client 2<br/>Browser"  
    participant SocketClient as "Socket.io Client"  
    participant SocketServer as "Socket.io Server"  
    participant EventHandler as "Event Handlers"  
    participant MongoDB as "MongoDB"  
    participant Redis as "Redis Cache"  
      
    Client1->>SocketClient: Connect with JWT  
    SocketClient->>SocketServer: Establish WebSocket  
    SocketServer->>EventHandler: Authenticate Connection  
    EventHandler->>Redis: Verify Session  
    Redis-->>EventHandler: Session Valid  
    EventHandler-->>SocketServer: Connection Approved  
    SocketServer-->>SocketClient: Connected  
      
    Client2->>SocketServer: Connect  
    SocketServer-->>Client2: Connected  
      
    Note over Client1,Client2: Real-time Collaboration  
      
    Client1->>SocketClient: Emit "task:update"  
    SocketClient->>SocketServer: Forward Event  
    SocketServer->>EventHandler: Process Event  
    EventHandler->>MongoDB: Update Task  
    MongoDB-->>EventHandler: Update Confirmed  
    EventHandler->>Redis: Invalidate Cache  
    EventHandler->>SocketServer: Broadcast "task:updated"  
    SocketServer-->>Client1: Emit to Client 1  
    SocketServer-->>Client2: Emit to Client 2  
      
    Note over Client1,Client2: Notification Flow  
      
    EventHandler->>SocketServer: Emit "notification:new"  
    SocketServer-->>Client1: Push Notification  
    SocketServer-->>Client2: Push Notification  
      
    Client1->>SocketClient: Disconnect  
    SocketClient->>SocketServer: Close Connection  
    SocketServer->>EventHandler: Cleanup Session  
    EventHandler->>Redis: Remove Session
```

### Project Structure

```
CollabNest/
├── my-app/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Route pages
│   │   ├── redux/                   # State management
│   │   ├── services/                # API services
│   │   ├── utils/                   # Utility functions
│   │   └── App.jsx                  # Main app
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Backend (Node.js + Express)
│   ├── controllers/                 # Route handlers
│   ├── models/                      # Database schemas
│   ├── routes/                      # API routes
│   ├── middleware/                  # Express middleware
│   ├── config/                      # App configuration
│   ├── package.json
│   └── index.js                     # Server entry
│
├── docker-compose.yml               # Container setup
├── README.md                        # Documentation
└── .env
```

---

### Key Integrations

#### Notification System
```javascript
// Firebase Cloud Messaging Integration
const messaging = getMessaging(app);
const token = await getToken(messaging, {
  vapidKey: process.env.VITE_FIREBASE_VAPID_KEY
});

// Multi-channel notification delivery
await notificationService.send({
  channels: ['push', 'email', 'sms'],
  priority: 'high',
  template: 'task_deadline',
  data: { taskId, deadline }
});
```

**Features:**
- Push notifications via FCM
- Email notifications with templates
- In-app toast notifications
- Smart notification bundling
- Delivery analytics and tracking

#### Real-time Communication
```javascript
// Socket.io Integration
const socket = io(process.env.VITE_SOCKET_URL, {
  auth: { token: localStorage.getItem('token') },
  transports: ['websocket', 'polling']
});

// Event-driven architecture
socket.on('task:updated', (data) => {
  dispatch(updateTask(data));
  showToast('Task updated in real-time!');
});
```

**Features:**
- WebSocket connections
- Real-time task updates
- Live chat and messaging
- Auto-reconnection handling
- Connection state management

#### Authentication & Security
```javascript
// Google OAuth 2.0 Integration
const googleLogin = useGoogleLogin({
  onSuccess: async (response) => {
    const userInfo = await verifyGoogleToken(response.access_token);
    dispatch(loginSuccess(userInfo));
  },
  scope: 'openid profile email'
});

// JWT Management
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

**Features:**
- Google OAuth 2.0 integration
- JWT token management
- Role-based access control
- Rate limiting and DDoS protection
- Security audit logging

#### Performance & Caching
```javascript
// Redis Caching Implementation
const cacheService = {
  async get(key) {
    return await redis.get(key);
  },
  async set(key, value, ttl = 3600) {
    return await redis.setex(key, ttl, JSON.stringify(value));
  },
  async invalidate(pattern) {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  }
};

// Query optimization
const tasks = await Task.find({ userId })
  .populate('assignees', 'name email')
  .cache(300);
```

**Features:**
- Redis in-memory caching
- Database query optimization
- Smart cache invalidation
- Performance monitoring
- Code splitting and lazy loading

---

### Database Schema

#### MongoDB Collections Overview

<img src="./assets/dbCollection.png">

<details>
<summary><strong>Detailed Schema Definitions</strong></summary>

**User Schema**
```javascript
{
  _id: ObjectId,
  googleId: String,
  email: String,
  name: String,
  profilePic: String,
  bio: String,
  section: String,
  organizations: [ObjectId],
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean,
  preferences: {
    theme: String,
    notifications: Object,
    language: String
  }
}
```

**Organization Schema**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  logo: String,
  createdBy: ObjectId,
  members: [{
    userId: ObjectId,
    role: String,
    joinedAt: Date,
    permissions: [String]
  }],
  settings: Object,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Task Schema**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String,
  priority: String,
  dueDate: Date,
  createdBy: ObjectId,
  assignedTo: [ObjectId],
  organizationId: ObjectId,
  tags: [String],
  attachments: [Object],
  comments: [Object],
  progress: Number,
  createdAt: Date,
  updatedAt: Date
}
```

</details>

---

## Deployment

*Coming Soon*

---

## Available Scripts

### Frontend Scripts (`my-app/`)

| Command | Description | Environment |
|---------|-------------|-------------|
| `npm run dev` | Start development server with hot reload | Development |
| `npm run build` | Create optimized production build | Production |
| `npm run preview` | Preview production build locally | Production |
| `npm run test` | Run unit tests with Vitest | Testing |

### Backend Scripts (`server/`)

| Command | Description | Environment |
|---------|-------------|-------------|
| `npm run dev` | Start development server with nodemon | Development |
| `npm start` | Start production server | Production |
| `npm run build` | Build TypeScript to JavaScript | Production |
| `npm test` | Run test suite with Jest | Testing |
| `npm run logs` | View application logs | Production |

---

## Testing

### Testing Strategy

**Frontend Testing:**
- **Unit Tests:** React component testing with React Testing Library
- **Integration Tests:** API integration and Redux store testing
- **E2E Tests:** User journey testing with Cypress
- **Performance Tests:** Lighthouse CI for performance monitoring
- **Accessibility Tests:** WCAG compliance testing

**Tools Used:**
- Vitest for unit testing
- Playwright for E2E testing
- Jest for integration testing
- React Testing Library for component testing

**Backend Testing:**
- **Unit Tests:** Individual function and module testing
- **Integration Tests:** API endpoint and database testing
- **Load Tests:** Performance under high traffic
- **Security Tests:** Vulnerability scanning and penetration testing
- **API Tests:** Contract testing with OpenAPI

**Tools Used:**
- Jest for unit and integration testing
- Artillery for load testing
- OWASP ZAP for security testing
- Supertest for API testing

### Test Coverage Goals

| Component | Target Coverage | Current Status |
|-----------|----------------|----------------|
| Frontend Components | 90%+ | ![Coverage](https://img.shields.io/badge/Coverage-85%25-yellow) |
| Backend APIs | 95%+ | ![Coverage](https://img.shields.io/badge/Coverage-92%25-green) |
| Authentication | 100% | ![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen) |
| Database Models | 90%+ | ![Coverage](https://img.shields.io/badge/Coverage-88%25-yellow) |

---

## Performance & Benchmarking Report

A comprehensive full-stack performance analysis covering backend APIs, WebSockets, database operations, and frontend rendering has been conducted to understand how CollabNest behaves under real-world collaboration workloads and traffic spikes.

### Tools Used

| Area | Tool | Purpose |
|------|------|---------|
| REST API Load | **Artillery** | Multi-phase scenario load tests |
| WebSocket Realtime Load | **Artillery WS** | Measures live task and notification event speed |
| Spike & Sustained Traffic | **Autocannon** | Forces server CPU and event loop under pressure |
| Database Query Latency | **Custom Node Bench** | Measures CRUD latency at scale |
| Frontend Performance | **Lighthouse CI** | Measures rendering speed, LCP, blocking time |

---

### Key Results

| Test | p50 Latency | p95 Latency | Max | Error Rate | Notes |
|------|------------|-------------|-----|------------|-------|
| **REST API (Baseline Load)** | 200–400ms | 700–1500ms | 3–6s | 2–4% | Stable under normal usage |
| **WebSockets (Live Updates)** | 80–200ms | 300–700ms | 1–2s | <1% | Real-time UI is responsive |
| **Spike Login (200 concurrent)** | 4–8s | 9–10s | 9.6s | **50–60% timeouts** | **Primary bottleneck** |
| **Sustained Login (50 concurrent)** | 2.5–3.5s | 5–6s | 6.2s | 5–10% | Authentication path needs tuning |
| **Database (1000 ops test)** | **p50 < 1ms**, p95 < 3ms | — | — | **0%** | DB performance is excellent |

---

### Frontend Performance (Lighthouse)

| Page | Performance Score | Accessibility | LCP | Notes |
|------|------------------|---------------|-----|------|
| **Login** | **88** | 91 | ~3000ms | LCP impacted by unused JS and render-blocking assets |
| **Register** | **90** | 91 | ~1060ms | Much faster due to fewer above-the-fold elements |

**Finding:** UI is visually responsive, but the Login page loads approximately 3× slower due to redundant JS, unoptimized assets, and layout thrashing.

---

### Interpretation

- **Database is not the bottleneck.** Query performance is extremely fast.
- **WebSockets scale well** — real-time updates remain smooth.
- **The authentication (login) path is the main performance bottleneck**, especially under spikes.
- Frontend LCP slowdown on the Login screen is due to heavy JS bundles, unnecessary blocking styles, and no asset preloading.

---

### Optimization Priorities

| Priority | Target | Reason | Planned Solution |
|---------|--------|--------|-----------------|
| **Critical** | **Login Auth Pipeline** | Largest latency and timeout source | Reduce bcrypt cost → 8, cache auth lookups, apply login rate limiting |
| **High** | **WebSocket Broadcast Layer** | Occasional event-loop congestion | Move heavy notifications to Redis Pub/Sub and worker queue |
| **Medium** | **Task Update & Notification Jobs** | Synchronous workload spikes | Shift to BullMQ async job workers |
| **Low** | **Frontend Login LCP** | 3s LCP is noticeable lag | Tree-shake unused JS, preload hero assets, reduce bundle size |
| **Low** | **Analytics Precomputation** | Low urgency | Move dashboard aggregation to scheduled jobs |

---

### Benchmark Artifacts

All benchmark reports are stored in `server/benchmarks/reports/` including:
- `artillery-baseline.json`
- `artillery-ws.json`
- `db-bench.json`

### For more details regarding benchmarks checkout the Benchmark Directory or BENCHMARKS_SUMMARY.md 

---

## API Documentation

### API Endpoints Overview

<details>
<summary><strong>Authentication Endpoints</strong></summary>

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api/auth/google` | Google OAuth login | None |
| `POST` | `/api/auth/refresh` | Refresh JWT token | Refresh Token |
| `POST` | `/api/auth/logout` | Logout user | JWT |
| `GET` | `/api/auth/me` | Get current user | JWT |

</details>

<details>
<summary><strong>User Management Endpoints</strong></summary>

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/users/profile` | Get user profile | JWT |
| `PUT` | `/api/users/profile` | Update user profile | JWT |
| `POST` | `/api/users/upload-avatar` | Upload profile picture | JWT |
| `GET` | `/api/users/organizations` | Get user organizations | JWT |

</details>

<details>
<summary><strong>Organization Endpoints</strong></summary>

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/organizations` | List organizations | JWT |
| `POST` | `/api/organizations` | Create organization | JWT |
| `GET` | `/api/organizations/:id` | Get organization details | JWT |
| `PUT` | `/api/organizations/:id` | Update organization | JWT (Admin) |
| `POST` | `/api/organizations/:id/invite` | Invite members | JWT (Admin) |

</details>

<details>
<summary><strong>Task Management Endpoints</strong></summary>

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/tasks` | List tasks | JWT |
| `POST` | `/api/tasks` | Create task | JWT |
| `GET` | `/api/tasks/:id` | Get task details | JWT |
| `PUT` | `/api/tasks/:id` | Update task | JWT |
| `DELETE` | `/api/tasks/:id` | Delete task | JWT |
| `POST` | `/api/tasks/:id/comments` | Add comment | JWT |

</details>

<details>
<summary><strong>Feedback Endpoints</strong></summary>

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/feedback` | List feedback | JWT |
| `POST` | `/api/feedback` | Submit feedback | JWT |
| `GET` | `/api/feedback/public` | Get public testimonials | None |
| `PUT` | `/api/feedback/:id` | Update feedback | JWT (Owner) |
| `DELETE` | `/api/feedback/:id` | Delete feedback | JWT (Owner) |

</details>

---

## Contributing

We welcome contributions from developers of all skill levels. Here's how you can help make CollabNest even better:

### Getting Started with Contributing

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Deadline.git
   cd Deadline
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make Your Changes**
   - Follow our coding standards
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   npm run test:all
   npm run lint
   ```

5. **Commit Your Changes**
   ```bash
   git commit -m "feat: add amazing new feature"
   ```

6. **Submit a Pull Request**
   - Push to your fork and create a PR
   - Describe your changes clearly
   - Link any relevant issues

### Contribution Guidelines

**What We're Looking For:**
- Bug fixes
- New features
- Documentation improvements
- UI/UX enhancements
- Performance optimizations
- Tests
- Accessibility improvements

**Code Standards:**
- Follow ESLint rules
- Use conventional commits
- Maintain >85% test coverage
- Document new features
- All PRs need review
- Consider performance impact

### Issue Labels

| Label | Description | Difficulty |
|-------|-------------|------------|
| ![good first issue](https://img.shields.io/badge/-good%20first%20issue-7057ff) | Perfect for newcomers | Beginner |
| ![help wanted](https://img.shields.io/badge/-help%20wanted-008672) | Extra attention needed | Intermediate |
| ![bug](https://img.shields.io/badge/-bug-d73a4a) | Something isn't working | Intermediate |
| ![enhancement](https://img.shields.io/badge/-enhancement-a2eeef) | New feature or request | Advanced |
| ![documentation](https://img.shields.io/badge/-documentation-0075ca) | Improvements to docs | Beginner |

### Recognition

All contributors will be:
- Listed in our [CONTRIBUTORS.md](./CONTRIBUTORS.md) file
- Featured in release notes for significant contributions
- Mentioned in our social media announcements
- Eligible for special contributor badges

---

## License

This project is not currently licensed. Once licensing is implemented, it will likely be under the **MIT License**.

### Future License Highlights (MIT)

**You will be allowed to:**
- Use it for commercial purposes
- Modify and customize the code
- Distribute the software
- Use it privately

**Limitations:**
- No liability or warranty provided
- Must include the original license and copyright notice

Stay tuned for the official license file.

---

## Author

<div align="center">

### Arun Kushwaha
*Full-Stack Developer & Open-Source Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Arun-kushwaha007)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/arun-kushwaha-394b5a340/)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/Arunkush00?s=08)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=web&logoColor=white)](https://arun-kushwaha.dev)

</div>

### About the Author

- **Experience:** 3+ years in full-stack development
- **Specialization:** MERN Stack, React Native, Cloud Architecture
- **Open Source:** Active contributor to various projects
- **Education:** B.Tech in Electronics and Communication Engineering
- **Achievements:** Multiple hackathon wins and conference presentations

---

## Acknowledgments

### Special Thanks

**Technologies:**
- **React Team** for the powerful UI library
- **Firebase Team** for cloud infrastructure
- **MongoDB** for flexible data storage
- **Socket.io** for real-time capabilities
- **Tailwind CSS** for utility-first styling

**Community:**
- **Open-Source Community** for continuous inspiration
- **Stack Overflow** for problem-solving resources
- **Fellow Developers** for collaboration and feedback

### Resources & Inspiration

- **Architecture Patterns:** Modern full-stack best practices
- **Design System:** Material Design and Human Interface Guidelines
- **Security Practices:** OWASP security standards
- **User Experience:** Industry-leading application patterns
- **Performance:** Optimization techniques from web performance research

---

<div align="center">

## Project Statistics

![GitHub repo size](https://img.shields.io/github/repo-size/Arun-kushwaha007/Deadline?style=for-the-badge)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Arun-kushwaha007/Deadline?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/Arun-kushwaha007/Deadline?style=for-the-badge)
![GitHub contributors](https://img.shields.io/github/contributors/Arun-kushwaha007/Deadline?style=for-the-badge)

---

## Support the Project

If you find **CollabNest** helpful, consider:

⭐ **Star this repository** to show your support

🐛 **Report bugs** to help improve the platform

✨ **Contribute code** to add new features

📢 **Share the project** with your network

☕ **Support development** through sponsorship

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-F7DF1E?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://coff.ee/arunkushwaha)

---

**Built with ❤️ by Arun Kushwaha**

</div>
