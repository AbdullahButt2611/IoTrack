from django.apps import AppConfig
import threading

class HandlerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'handler'

    def ready(self):
        from . import mqtt_client

        def run_mqtt():
            mqtt_client.start_mqtt()

        threading.Thread(target=run_mqtt, daemon=True).start()
