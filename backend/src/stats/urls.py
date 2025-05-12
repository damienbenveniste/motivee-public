from django.urls import path, include
from rest_framework import routers
from stats.views import ConversationStatsView, ConversationSurveyStatsView

router = routers.DefaultRouter()
router.register(r'conversations', ConversationStatsView)
router.register(r'conversation-surveys', ConversationSurveyStatsView)

urlpatterns = [
    path('stats/', include(router.urls)),
]