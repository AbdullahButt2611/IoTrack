# **Software Requirements Specification (SRS)**

### **Project Title:** Mini IoT Telemetry Platform

### **Tech Stack:** React (Frontend) + Django REST Framework (Backend) + MQTT (Mosquitto) + SQLite (Database)

## **1. Introduction**

### **1.1 Purpose**

The purpose of this document is to define the requirements, design specifications, and implementation plan for the **Mini IoT Telemetry Platform**. The platform simulates IoT devices that send real-time telemetry data through an MQTT broker, processes this data using a Django REST Framework backend, and visualizes it on a React-based dashboard.

### **1.2 Scope**

This system provides real-time monitoring of devices that send temperature and humidity telemetry. It supports data ingestion, storage, alert generation, and visualization. The project includes both frontend and backend components and uses SQLite for persistence during development.

### **1.3 Objectives**

- Build an end-to-end IoT telemetry simulation system.
- Ingest telemetry data from multiple simulated devices.
- Generate alerts for abnormal or missing telemetry (e.g., HIGH_TEMP, OFFLINE, ONLINE).
- Display devices, telemetry trends, and alerts on a user-friendly React dashboard.
- Ensure scalability, modularity, and ease of maintenance.

## **2. System Overview**

### **2.1 High-Level Architecture**

```
┌────────────────────────┐     MQTT     ┌──────────────────────────┐     REST / WS     ┌──────────────────────────┐
│ Telemetry Simulator(s) │ ───────────▶ │ MQTT Broker (Mosquitto) │ ─────────────────▶ │ Django REST Backend API  │
└────────────────────────┘              └──────────────────────────┘                   └───────────────┬──────────┘
                                                                                                     │
                                                                                             ┌───────▼────────┐
                                                                                             │ SQLite DB      │
                                                                                             └───────┬────────┘
                                                                                                     │
                                                                                            ┌────────▼─────────┐
                                                                                            │ React Dashboard  │
                                                                                            └──────────────────┘
```

### **2.2 System Components**

1. **Simulator** – Publishes telemetry messages to the MQTT broker.
2. **MQTT Broker** – Manages device communication using MQTT protocol.
3. **Backend (Django + DRF)** – Subscribes to MQTT topics, stores telemetry data, triggers alerts, and exposes REST APIs.
4. **SQLite Database** – Stores telemetry, device states, and alerts.
5. **Frontend (React)** – Visualizes telemetry data, alerts, and device states.

## **3. Functional Requirements**

### **3.1 Simulator**

- Simulates multiple IoT devices publishing telemetry every second.

- Randomly drops 1 out of every 30 messages.

- Publishes to topic `devices/{deviceId}/telemetry`.

- JSON Payload Example:

  ```json
  {
    "deviceId": "device-001",
    "ts": 1714041600000,
    "temperature": 27.3,
    "humidity": 45.6
  }
  ```

### **3.2 MQTT Broker**

- Use **Mosquitto** on port `1883`.
- Subscribes to `devices/+/telemetry` topics.

### **3.3 Backend Service (Django REST Framework)**

#### **3.3.1 Ingestion Service**

- Connects to MQTT broker as a subscriber using `paho-mqtt`.
- Persists incoming telemetry to SQLite.
- Updates or inserts device information in the database.
- Detects when a device is online or offline.

#### **3.3.2 Alert Engine**

- **HIGH_TEMP:** Trigger when `temperature > 30°C`.
- **OFFLINE:** Trigger if no data received for 10 seconds.
- **ONLINE:** Trigger when a device recovers after being offline.

#### **3.3.3 REST API Endpoints**

| Endpoint                                         | Method | Description                                              |
| ------------------------------------------------ | ------ | -------------------------------------------------------- |
| `/api/health/`                                   | GET    | Returns service health and database connectivity.        |
| `/api/devices/`                                  | GET    | Returns all devices with status and last seen timestamp. |
| `/api/telemetry/?deviceId=<id>&limit=<n>`        | GET    | Returns recent telemetry for a device.                   |
| `/api/stats/avg/?deviceId=<id>&window=<minutes>` | GET    | Returns average temperature/humidity in given window.    |
| `/api/alerts/`                                   | GET    | Returns the latest 50 alerts.                            |

#### **3.3.4 Background Scheduler**

- A periodic Django/Celery task checks device last seen timestamps every 1 second.
- Marks devices offline if inactive for >10 seconds.
- Generates OFFLINE alerts when triggered.

#### **3.3.5 Optional WebSocket Support**

- Integrate Django Channels for real-time data push.
- Broadcast new alerts and telemetry updates to connected clients.

## **4. Database Schema (SQLite)**

### **4.1 Device Table**

| Field     | Type                  | Description                |
| --------- | --------------------- | -------------------------- |
| device_id | Text (PK)             | Unique device identifier.  |
| last_seen | DateTime              | Last telemetry timestamp.  |
| status    | Text (ONLINE/OFFLINE) | Device connectivity state. |

### **4.2 Telemetry Table**

| Field       | Type         | Description           |
| ----------- | ------------ | --------------------- |
| id          | Integer (PK) | Unique identifier.    |
| device_id   | Text (FK)    | Associated device.    |
| ts          | DateTime     | Telemetry timestamp.  |
| temperature | Real         | Recorded temperature. |
| humidity    | Real         | Recorded humidity.    |

### **4.3 Alert Table**

| Field      | Type         | Description                          |
| ---------- | ------------ | ------------------------------------ |
| id         | Integer (PK) | Unique alert ID.                     |
| device_id  | Text (FK)    | Device that triggered the alert.     |
| alert_type | Text         | One of (HIGH_TEMP, OFFLINE, ONLINE). |
| ts         | DateTime     | Timestamp of the alert.              |
| payload    | JSON         | Additional context about the alert.  |

## **5. Frontend (React Dashboard)**

### **5.1 Pages and Components**

1. **Device Overview**
   - Displays all devices, status (Online/Offline), and last seen time.
2. **Telemetry View**
   - Line charts for temperature and humidity trends.
   - Device selector to view telemetry for a specific device.
3. **Alerts View**
   - Table showing alert type, timestamp, and device ID.
   - Auto-refresh every 3 seconds or live via WebSocket.

### **5.2 Frontend Technologies**

- React + TailwindCSS for UI.
- Axios for API calls.
- Chart.js or Recharts for graphs.
- Redux/Context for global state management.

## **6. Development Workflow and Branching Strategy**

### **Main Branches:**

- `main` – Stable production-ready branch.
- `develop` – Integration branch for merged features.

### **Feature Branches:**

| Branch Name         | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `feature/simulator` | IoT simulator script and MQTT setup.       |
| `feature/backend`   | Django setup, models, and ingestion logic. |
| `feature/alerts`    | Alert logic and Celery tasks.              |
| `feature/frontend`  | React dashboard and integration with APIs. |
| `feature/websocket` | Optional WebSocket live updates.           |

Each branch must be merged through a Pull Request with clear commit messages following the format:

```
feat: implemented device ingestion API
fix: corrected offline detection logic
refactor: updated database schema
```

## **7. Development Phases (Execution Plan)**

### **Phase 1: Project Initialization**

- Create Git repository and initialize `main` and `develop` branches.
- Setup `.gitignore` and base `README.md`.
- Configure `docker-compose.yml` for Mosquitto and backend.
- Create Django project and configure SQLite database.

### **Phase 2: Simulator Development (feature/simulator)**

- Build Python simulator using `paho-mqtt`.
- Send JSON payloads every second.
- Test broker communication via Mosquitto.

### **Phase 3: Backend Foundation (feature/backend)**

- Setup Django REST Framework and `paho-mqtt` client.
- Create models: Device, Telemetry, Alert.
- Subscribe to MQTT and store telemetry.
- Implement `/api/devices/`, `/api/telemetry/`, `/api/health/` endpoints.

### **Phase 4: Alert System (feature/alerts)**

- Implement HIGH_TEMP, OFFLINE, and ONLINE alerts.
- Setup Celery for scheduled tasks (1-second interval check).
- Store alerts in SQLite.

### **Phase 5: REST API Expansion**

- Implement `/api/alerts/` and `/api/stats/avg/` endpoints.
- Add filtering and pagination support.
- Validate API responses with test data.

### **Phase 6: React Frontend (feature/frontend)**

- Setup React app with Tailwind.
- Create pages for Devices, Telemetry, Alerts.
- Integrate backend APIs using Axios.
- Add polling (3s refresh) for real-time updates.

### **Phase 7: WebSocket Integration (Optional)**

- Use Django Channels for real-time updates.
- Push alerts and telemetry data to frontend.

### **Phase 8: Testing and QA**

- Backend: Pytest for models, views, and alert logic.
- Frontend: Jest/React Testing Library for components.
- Integration testing with simulator.

### **Phase 9: Deployment and Documentation**

- Add Dockerfiles for backend and frontend.
- Update `docker-compose.yml` to orchestrate broker, backend, and frontend.
- Finalize README with setup, usage, and endpoints.
- Tag final release `v0.1.0`.

## **8. Non-Functional Requirements**

| Category            | Requirement                                                  |
| ------------------- | ------------------------------------------------------------ |
| **Performance**     | Response time under 300ms for typical requests.              |
| **Scalability**     | Must handle multiple simulated devices simultaneously.       |
| **Reliability**     | Device status detection must recover gracefully from message loss. |
| **Security**        | Use environment variables for secrets and credentials.       |
| **Maintainability** | Modular, documented, and testable codebase.                  |

## **9. Tools and Libraries**

| Component        | Tools / Libraries                                   |
| ---------------- | --------------------------------------------------- |
| Frontend         | React, TailwindCSS, Axios, Recharts / Chart.js      |
| Backend          | Django, DRF, paho-mqtt, Celery, Channels (optional) |
| Database         | SQLite                                              |
| Broker           | Eclipse Mosquitto                                   |
| Containerization | Docker, Docker Compose                              |
| CI/CD            | GitHub Actions                                      |
| Testing          | Pytest, Jest                                        |

## **10. Deliverables**

1. Complete Git repository `mini-iot-telemetry-{your-name}`.
2. Feature branches merged into `main` with PR reviews.
3. Fully documented README with setup and usage guide.
4. Dockerized environment with `docker-compose up` for full system.
5. Screenshots or short demo video showcasing the dashboard.

## **11. Success Criteria**

- Simulator successfully sends telemetry messages.
- Backend ingests and persists telemetry in SQLite.
- Alert system works for HIGH_TEMP, OFFLINE, and ONLINE.
- React dashboard accurately visualizes devices, telemetry, and alerts.
- All tests pass and documentation is complete.

## **12. Future Enhancements**

- User authentication and role-based dashboards.
- Migration from SQLite to PostgreSQL for production.
- Grafana integration for historical analytics.
- AI/ML-based anomaly detection for telemetry data.

