import time
import random
import json
import paho.mqtt.client as mqtt
from datetime import datetime
import argparse

BROKER_HOST = "localhost"   # since you're running Mosquitto locally
BROKER_PORT = 1883

parser = argparse.ArgumentParser(description="IoT Device Telemetry Simulator")
parser.add_argument("--device-id", type=str, default="dev-001", help="Device ID to use for telemetry")
args = parser.parse_args()


DEVICE_ID = args.device_id
TOPIC = f"devices/{DEVICE_ID}/telemetry"

# Setup MQTT client
client = mqtt.Client()

def connect_broker():
    client.connect(BROKER_HOST, BROKER_PORT, 60)
    print(f"Connected to MQTT broker at {BROKER_HOST}:{BROKER_PORT}")

def generate_payload():
    return {
        "deviceId": DEVICE_ID,
        "ts": int(datetime.utcnow().timestamp() * 1000),  # epoch in ms
        "temperature": round(random.uniform(20.0, 35.0), 2),
        "humidity": round(random.uniform(30.0, 60.0), 2)
    }

def main():
    connect_broker()
    counter = 0
    while True:
        counter += 1
        if counter % 30 == 0:
            print("Dropped this message to simulate packet loss")
        else:
            payload = generate_payload()
            client.publish(TOPIC, json.dumps(payload))
            print(f"Published: {payload}")
        time.sleep(1)

if __name__ == "__main__":
    main()
