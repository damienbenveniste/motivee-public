"""
ASGI config for src project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django_asgi_app = get_asgi_application()

from channels.security.websocket import OriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from app.ws_token_auth import TokenAuthMiddlewareStack
import conversations.routing


if os.environ.get('ENV') == 'staging':
    allowed_origin = [
        'http://localhost:3000',
        'https://staging.insight.getmotivee.com',
    ]
elif os.environ.get('ENV') == 'production':
    allowed_origin = [
        'https://insight.getmotivee.com',
    ]
else:
    allowed_origin = [
        'http://localhost:3000',
        'http://localhost:8891',
        '*'
    ]


application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": OriginValidator(
        TokenAuthMiddlewareStack(
            URLRouter(
                conversations.routing.websocket_urlpatterns
            )
        ),
        allowed_origin,
    ),
})


