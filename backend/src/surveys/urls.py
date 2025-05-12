from django.urls import path, include
from rest_framework import routers
from surveys.views import (
    ConversationSurveyView, 
    ConversationSurveyVoteView
)

router = routers.DefaultRouter()
router.register(r'conversation-surveys', ConversationSurveyView)
router.register(r'conversation-survey-votes', ConversationSurveyVoteView)

urlpatterns = [
    path('surveys/', include(router.urls)),
]