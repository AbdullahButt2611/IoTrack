from background_task import background
from django.utils import timezone
from datetime import timedelta
from .models import Device, Alert
import logging

logger = logging.getLogger(__name__)

@background(schedule=1)  # runs every 1 second after being scheduled
def check_offline_devices():
    now = timezone.now()
    threshold = timedelta(seconds=10)

    for device in Device.objects.all():
        if device.status == "ONLINE" and device.last_seen and (now - device.last_seen) > threshold:
            device.status = "OFFLINE"
            device.save()
            Alert.objects.create(
                device=device,
                alert_type="OFFLINE",
                payload={"info": "No telemetry received for 10 seconds"}
            )
            logger.warning(f"OFFLINE alert for {device.device_id}")
