from django.urls import path
from . import views

urlpatterns = [
    path('/health/', views.health_view, name='api-health'),
    path('/devices/', views.devices_view, name='api-devices'),
    path('/telemetry/', views.telemetry_view, name='api-telemetry'),
    path('/stats/avg/', views.stats_avg_view, name='api-stats-avg'),
    path('/alerts/', views.alerts_view, name='api-alerts'),
]