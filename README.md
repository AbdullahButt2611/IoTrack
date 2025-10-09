# mini-iot-telemetry-Abdullah-Butt
The purpose of this document is to define the requirements, design specifications, and implementation plan for the **Mini IoT Telemetry Platform**. The platform simulates IoT devices that send real-time telemetry data through an MQTT broker, processes this data using a Django REST Framework backend, and visualizes it on a React-based dashboard


```cmd
cd "C:\Program Files\mosquitto"
mosquitto.exe -v


python manage.py process_tasks --duration=0 --sleep=1


mosquitto_pub -h localhost -t devices/device123/telemetry -f payload.json

payload.json:
{"temperature": 75, "humidity": 60, "deviceId": "device123"}


python simulator.py
python simulator.py --device-id <device_name>
```



----



# Mini IoT Telemetry Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Django 4.0+](https://img.shields.io/badge/django-4.0+-green.svg)](https://www.djangoproject.com/)
[![React 18+](https://img.shields.io/badge/react-18+-61dafb.svg)](https://reactjs.org/)

A real-time IoT telemetry monitoring platform that simulates sensor devices publishing temperature and humidity data, processes the telemetry through an MQTT broker, and visualizes it on an interactive dashboard with intelligent alerting.

## 🎯 Overview

The **Mini IoT Telemetry Platform** is an end-to-end solution for monitoring simulated IoT devices in real-time. It demonstrates best practices in IoT architecture, including message queuing (MQTT), RESTful API design, real-time data processing, and responsive frontend visualization.

The platform simulates multiple IoT sensor devices that publish telemetry data (temperature and humidity) every second. This data flows through an MQTT broker to a Django backend that persists the information, generates intelligent alerts based on configurable rules, and serves everything through a REST API to a React-based dashboard.

**Use Cases:**
- IoT device monitoring and management
- Real-time telemetry data visualization
- Alert-based anomaly detection
- Educational demonstration of IoT architecture patterns

## ✨ Features

### Core Functionality
- **Real-Time Telemetry Ingestion**: Continuous data collection from multiple simulated devices
- **MQTT Communication**: Efficient pub/sub messaging using Eclipse Mosquitto broker
- **Intelligent Alert System**: 
  - HIGH_TEMP alerts when temperature exceeds 30°C
  - OFFLINE alerts when devices stop sending data for 10+ seconds
  - ONLINE alerts when devices reconnect after being offline
- **RESTful API**: Comprehensive endpoints for devices, telemetry, statistics, and alerts
- **Live Dashboard**: React-based UI with auto-refresh for real-time monitoring
- **Rolling Statistics**: Calculate average temperature/humidity over configurable time windows

### Advanced Features
- **Message Drop Simulation**: Realistic network conditions (1 in 30 messages dropped)
- **Device Status Tracking**: Automatic online/offline detection
- **Background Task Processing**: Celery-powered asynchronous alert generation
- **Historical Data Analysis**: Query past telemetry with filtering and pagination
- **Health Monitoring**: Service health check endpoint for system status

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 5.x with Django REST Framework
- **Message Broker**: Eclipse Mosquitto (MQTT)
- **Database**: SQLite (development)
- **MQTT Client**: paho-mqtt
- **Task Queue**: Django Background Tasks

### Frontend
- **Framework**: React 18.x
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charting**: Chart.js
- **State Management**: React Hooks (Context API)

### DevOps
- **Version Control**: Git with feature branch workflow

## 🏗️ System Architecture

```
┌────────────────────────┐     MQTT     ┌──────────────────────────┐     REST / WS     ┌──────────────────────────┐
│ Telemetry Simulator(s) │ ──────────▶ │ MQTT Broker (Mosquitto) │ ────────────────▶ │ Django REST Backend API  │
└────────────────────────┘              └──────────────────────────┘                   └──────────────┬───────────┘
                                                                                                       │
                                                                                              ┌────────▼─────────┐
                                                                                              │ SQLite Database  │
                                                                                              └────────┬─────────┘
                                                                                                       │
                                                                                             ┌─────────▼──────────┐
                                                                                             │ React Dashboard    │
                                                                                             └────────────────────┘
```

### Data Flow
1. **Simulator** publishes JSON telemetry to `devices/{deviceId}/telemetry` topic
2. **MQTT Broker** routes messages to subscribed clients
3. **Django Backend** receives messages, validates, and persists to database
4. **Alert Engine** evaluates rules and generates alerts
5. **REST API** exposes data to frontend
6. **React Dashboard** polls API and displays real-time updates

## 📁 Project Structure

```
mini-iot-telemetry-Abdullah-Butt/
│
├── backend/                    # Django application
│   ├── api/                    # REST API endpoints
│   ├── handler/                # Core logic (Device, Telemetry, Alert)
│   ├── telemetry/              # Service Management
│   ├── db.sqlite3              # Database storage
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                   # React application
│   ├── node_modules/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── api/                # API service layer
│   │   ├── routes/
│   │   ├── utils/
│   │   └── App.js
│   ├── package.json
│   └── vite.config.js
│
├── simulator/                  # Device simulator
│   ├── simulator.py           # Main simulator script
│   └── requirements.txt
│
├── README.md                   # This file
└── Software Requirements Specification (SRS).md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.13+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+ & npm** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Eclipse Mosquitto** - [Download](https://mosquitto.org/download/)

### System Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 2GB free space

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/mini-iot-telemetry-Abdullah-Butt.git
cd mini-iot-telemetry-Abdullah-Butt
```

### Step 2: Install & Configure Mosquitto MQTT Broker

#### Windows

1. **Download Mosquitto**:
   - Visit [https://mosquitto.org/download/](https://mosquitto.org/download/)
   - Download the Windows installer (64-bit recommended)
   - Run the installer and install to `C:\Program Files\mosquitto`

2. **Add to System PATH**:
   - Open System Properties → Advanced → Environment Variables
   - Under "System Variables", find `Path` and click "Edit"
   - Click "New" and add: `C:\Program Files\mosquitto`
   - Click "OK" to save

3. **Verify Installation**:
   ```cmd
   mosquitto -h
   ```

#### macOS

```bash
# Using Homebrew
brew install mosquitto

# Start as a service
brew services start mosquitto
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install mosquitto mosquitto-clients

# Enable and start service
sudo systemctl enable mosquitto
sudo systemctl start mosquitto
```

### Step 3: Setup Backend (Django)

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   
   # macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser** (optional):
   ```bash
   python manage.py createsuperuser
   ```

### Step 4: Setup Frontend (React)

1. **Navigate to frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Step 5: Setup Simulator

1. **Navigate to simulator directory**:
   ```bash
   cd ../simulator
   ```

2. **Install dependencies**:
   ```bash
   pip install paho-mqtt
   ```

## 🎮 Running the Application

You need to run **FOUR** separate services in different terminal windows:

### Terminal 1: Start MQTT Broker

```bash
# Navigate to Mosquitto installation directory
cd "C:\Program Files\mosquitto"  # Windows
# or just run if in PATH
mosquitto -v
```

**Expected Output**:
```
1234567890: mosquitto version 2.x starting
1234567890: Opening ipv4 listen socket on port 1883.
1234567890: Opening ipv6 listen socket on port 1883.
```

### Terminal 2: Start Django Backend Server

```bash
cd backend
# Activate virtual environment first
python manage.py runserver
```

**Expected Output**:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Terminal 3: Start Django Background Task Processor

```bash
cd backend
# Activate virtual environment first
python manage.py process_tasks --duration=0 --sleep=1
```

**Expected Output**:
```
Starting background task processor...
Checking for tasks every 1 second(s)...
```

This service monitors device activity and generates OFFLINE/ONLINE alerts.

### Terminal 4: Start Device Simulator

```bash
cd simulator
python simulator.py
```

**Run multiple devices**:
```bash
python simulator.py --device-id device-001
python simulator.py --device-id device-002
python simulator.py --device-id device-003
```

**Expected Output**:
```
Connected to MQTT Broker at localhost:1883
Publishing telemetry for device-001...
[2025-10-09 14:23:45] Published: {"deviceId": "device-001", "ts": 1728481425000, "temperature": 26.3, "humidity": 47.9}
```

### Terminal 5: Start React Dashboard

```bash
cd frontend
npm start
```

**Expected Output**:
```
Compiled successfully!

You can now view the app in the browser.

  Local:            http://localhost:5173
```

## 🧪 Manual Testing

### Test Single Message Publishing

You can manually publish a test message without running the simulator:

1. **Create `payload.json`**:
   ```json
   {
     "deviceId": "test-device-123",
     "ts": 1714041600000,
     "temperature": 28.5,
     "humidity": 55.2
   }
   ```

2. **Publish using mosquitto_pub**:
   ```bash
   mosquitto_pub -h localhost -t devices/test-device-123/telemetry -f payload.json
   ```

3. **Verify in Django admin or API**:
   ```bash
   curl http://localhost:8000/api/telemetry/?deviceId=test-device-123
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### 1. Health Check
```http
GET /health/
```

**Response**:
```json
{
  "status": "healthy",
  "database": "connected",
  "mqtt": "connected",
  "timestamp": "2025-10-09T14:23:45Z"
}
```

#### 2. List Devices
```http
GET /devices/
```

**Response**:
```json
[
  {
    "device_id": "device-001",
    "status": "ONLINE",
    "last_seen": "2025-10-09T14:23:45Z"
  },
  {
    "device_id": "device-002",
    "status": "OFFLINE",
    "last_seen": "2025-10-09T14:20:30Z"
  }
]
```

#### 3. Get Telemetry
```http
GET /telemetry/?deviceId=device-001&limit=100
```

**Query Parameters**:
- `deviceId` (required): Device identifier
- `limit` (optional, default=100): Number of records to return

**Response**:
```json
[
  {
    "id": 1234,
    "device_id": "device-001",
    "ts": "2025-10-09T14:23:45Z",
    "temperature": 26.3,
    "humidity": 47.9
  }
]
```

#### 4. Get Rolling Statistics
```http
GET /stats/avg/?deviceId=device-001&window=5m
```

**Query Parameters**:
- `deviceId` (required): Device identifier
- `window` (required): Time window (e.g., "5m", "1h", "24h")

**Response**:
```json
{
  "device_id": "device-001",
  "window": "5m",
  "avg_temperature": 26.8,
  "avg_humidity": 48.2,
  "data_points": 300
}
```

#### 5. Get Alerts
```http
GET /alerts/?limit=50
```

**Query Parameters**:
- `limit` (optional, default=50): Number of alerts to return
- `deviceId` (optional): Filter by device
- `alert_type` (optional): Filter by type (HIGH_TEMP, OFFLINE, ONLINE)

**Response**:
```json
[
  {
    "id": 42,
    "device_id": "device-001",
    "alert_type": "HIGH_TEMP",
    "ts": "2025-10-09T14:23:45Z",
    "payload": {
      "temperature": 32.1,
      "threshold": 30.0
    }
  }
]
```

## 🧩 Component Details

### 1. Device Simulator (`simulator/simulator.py`)

**Purpose**: Simulates IoT sensor devices publishing telemetry data.

**Features**:
- Publishes JSON telemetry every 1 second
- Randomly varies temperature (20-35°C) and humidity (30-70%)
- Drops 1 in every 30 messages to simulate network issues
- Supports multiple device instances with unique IDs

**Configuration**:
```python
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
PUBLISH_INTERVAL = 1  # seconds
DROP_RATE = 30  # 1 in 30 messages
```

### 2. MQTT Subscriber (`backend/mqtt_client/`)

**Purpose**: Subscribes to MQTT topics and ingests telemetry data.

**Features**:
- Connects to Mosquitto broker
- Subscribes to `devices/+/telemetry` wildcard topic
- Validates incoming JSON payloads
- Persists data to database
- Updates device last_seen timestamp

### 3. Alert Engine (`backend/alerts/`)

**Purpose**: Monitors telemetry and generates alerts based on rules.

**Alert Rules**:
- **HIGH_TEMP**: Triggered when temperature > 30°C
- **OFFLINE**: Triggered when no data received for 10+ seconds
- **ONLINE**: Triggered when device reconnects after offline period

**Implementation**:
- Background task runs every 1 second
- Checks all device last_seen timestamps
- Generates alerts and stores in database

### 4. REST API (`backend/api/`)

**Purpose**: Exposes telemetry data and alerts through RESTful endpoints.

**Features**:
- Django REST Framework powered
- Pagination support
- Query parameter filtering
- JSON response format
- CORS enabled for frontend access

### 5. React Dashboard (`frontend/src/`)

**Purpose**: Visualizes telemetry data and alerts in real-time.

**Pages**:
- **Device Overview**: List of all devices with status indicators
- **Telemetry Charts**: Line graphs showing temperature/humidity trends
- **Alerts Table**: Recent alerts with filtering options

**Features**:
- Auto-refresh every 3 seconds
- Responsive design with Tailwind CSS
- Interactive charts with Recharts
- Device filtering and selection

## 🐛 Troubleshooting

### Common Issues

#### 1. Mosquitto Won't Start
```
Error: Address already in use
```
**Solution**: Another service is using port 1883
```bash
# Windows
netstat -ano | findstr :1883
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :1883
kill -9 <PID>
```

#### 2. Django Can't Connect to MQTT
```
Error: Connection refused [Errno 111]
```
**Solution**: Ensure Mosquitto is running
```bash
mosquitto -v
```

#### 3. React Can't Fetch Data
```
Error: Network Error
```
**Solution**: Check Django server is running and CORS is enabled
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

#### 4. Background Tasks Not Running
```
No alerts being generated
```
**Solution**: Ensure process_tasks is running
```bash
python manage.py process_tasks --duration=0 --sleep=1
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Testing
```bash
# Start all services, then:
python tests/integration_test.py
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Commit Message Format**:
```
feat(component): add new feature
fix(component): resolve bug
docs(readme): update documentation
refactor(api): improve code structure
```

## 👤 Author

**Abdullah Butt**

- GitHub: [@AbdullahButt2611](https://github.com/AbdullahButt2611)
- Email: abutt2210@gmail.com

## 🙏 Acknowledgments

- Eclipse Mosquitto for MQTT broker
- Django & DRF communities
- React & Tailwind CSS teams
- All contributors and reviewers

## 📞 Support

For questions or issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Open an issue on GitHub
3. Contact the author

**Built with ❤️ for IoT enthusiasts**