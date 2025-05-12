
from django.urls import re_path
from conversations import consumers

websocket_urlpatterns = [
  re_path(r'ws/conversation/(?P<room_name>\w+)/$', consumers.ConversationConsumer.as_asgi()), # Using asgi
]
