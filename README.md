# mini-iot-telemetry-Abdullah-Butt
The purpose of this document is to define the requirements, design specifications, and implementation plan for the **Mini IoT Telemetry Platform**. The platform simulates IoT devices that send real-time telemetry data through an MQTT broker, processes this data using a Django REST Framework backend, and visualizes it on a React-based dashboard


```cmd
cd "C:\Program Files\mosquitto"
mosquitto.exe -v


python manage.py process_tasks --duration=0 --sleep=1
```