import os, json, logging, paho.mqtt.client as mqtt
from .models import Device, Telemetry, Alert
from django.utils import timezone

logger = logging.getLogger(__name__)
mqtt_client = None

def on_connect(client, userdata, flags, rc):
    client.subscribe("devices/+/telemetry")

def on_message(client, userdata, msg):
    data = json.loads(msg.payload.decode())
    device_id = data["deviceId"]
    temperature = data["temperature"]
    humidity = data["humidity"]
    ts = timezone.now()

    device, created  = Device.objects.get_or_create(device_id=device_id)

    # Detect ONLINE recovery
    if device.status == "OFFLINE":
        Alert.objects.create(device=device, alert_type="ONLINE", payload={"info": "Device came back online"})
        logger.info(f"Device {device_id} is now ONLINE again.")

    device.last_seen = ts
    device.status = "ONLINE"
    device.save()

    Telemetry.objects.create(device=device, ts=ts, temperature=temperature, humidity=humidity)

    # HIGH_TEMP Alert
    if temperature > 30:
        Alert.objects.create(device=device, alert_type="HIGH_TEMP", payload=data)
        logger.warning(f"HIGH_TEMP alert for {device_id}: {temperature}°C")


def start_mqtt(broker_host='localhost', broker_port=1883, keepalive=60):
    # avoid starting MQTT client in the autoreloader parent process
    if os.environ.get("RUN_MAIN") != "true":
        logger.debug("Skipping MQTT start in non-main process.")
        return

    global mqtt_client
    if mqtt_client is not None:
        logger.debug("MQTT client already started.")
        return

    mqtt_client = mqtt.Client()
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message

    try:
        mqtt_client.connect(broker_host, broker_port, keepalive)
        mqtt_client.loop_start()  # non-blocking background thread
        logger.info("MQTT client started and connected to %s:%s", broker_host, broker_port)
    except Exception:
        logger.exception("Failed to start MQTT client")