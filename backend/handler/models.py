from django.db import models

class Device(models.Model):
    device_id = models.CharField(max_length=100, primary_key=True)
    last_seen = models.DateTimeField()
    status = models.CharField(max_length=10, choices=[('ONLINE', 'ONLINE'), ('OFFLINE', 'OFFLINE')])

class Telemetry(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    ts = models.DateTimeField()
    temperature = models.FloatField()
    humidity = models.FloatField()

class Alert(models.Model):
    ALERT_CHOICES = [
        ('HIGH_TEMP', 'High Temperature'),
        ('OFFLINE', 'Offline'),
        ('ONLINE', 'Online'),
    ]

    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=20, choices=ALERT_CHOICES)
    ts = models.DateTimeField(auto_now_add=True)
    payload = models.JSONField(null=True, blank=True)

