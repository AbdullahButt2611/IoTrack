from rest_framework import serializers
from .models import Device, Telemetry, Alert

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['device_id', 'last_seen', 'status']

class TelemetrySerializer(serializers.ModelSerializer):
    device_id = serializers.CharField(source='device.device_id', read_only=True)
    class Meta:
        model = Telemetry
        fields = ['id', 'device_id', 'ts', 'temperature', 'humidity']

class AlertSerializer(serializers.ModelSerializer):
    device_id = serializers.CharField(source='device.device_id', read_only=True)
    payload = serializers.JSONField()
    class Meta:
        model = Alert
        fields = ['id', 'device_id', 'alert_type', 'ts', 'payload']