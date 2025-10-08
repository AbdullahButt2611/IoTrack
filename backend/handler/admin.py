from django.contrib import admin
from .models import Device, Telemetry, Alert

admin.site.register(Device)
admin.site.register(Telemetry)
admin.site.register(Alert)
