from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg
from django.utils import timezone
from .models import Device, Telemetry, Alert
from .serializers import DeviceSerializer, TelemetrySerializer, AlertSerializer

@api_view(['GET'])
def health_view(request):
    # Simple health check
    try:
        Device.objects.exists()
        return Response({'status': 'ok', 'db': 'connected'}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'status': 'error', 'db': 'disconnected'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def devices_view(request):
    devices = Device.objects.all()
    serializer = DeviceSerializer(devices, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def telemetry_view(request):
    device_id = request.GET.get('deviceId')
    limit = int(request.GET.get('limit', 50))
    if not device_id:
        return Response({'error': 'deviceId required'}, status=status.HTTP_400_BAD_REQUEST)
    telemetry = Telemetry.objects.filter(device__device_id=device_id).order_by('-ts')[:limit]
    serializer = TelemetrySerializer(telemetry, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def stats_avg_view(request):
    device_id = request.GET.get('deviceId')
    window = int(request.GET.get('window', 10))  # minutes
    if not device_id:
        return Response({'error': 'deviceId required'}, status=status.HTTP_400_BAD_REQUEST)
    since = timezone.now() - timezone.timedelta(minutes=window)
    qs = Telemetry.objects.filter(device__device_id=device_id, ts__gte=since)
    avg_temp = qs.aggregate(avg_temp=Avg('temperature'))['avg_temp']
    avg_hum = qs.aggregate(avg_hum=Avg('humidity'))['avg_hum']
    return Response({
        'deviceId': device_id,
        'window': window,
        'avg_temperature': avg_temp,
        'avg_humidity': avg_hum
    })

@api_view(['GET'])
def alerts_view(request):
    alerts = Alert.objects.order_by('-ts')[:50]
    serializer = AlertSerializer(alerts, many=True)
    return Response(serializer.data)