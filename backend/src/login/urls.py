from django.urls import path, include
from rest_framework import routers
from login.views import (
    SuggestionView, 
    UserView,
    EmailView
)

router = routers.DefaultRouter()
router.register(r'suggestions', SuggestionView)
router.register(r'users', UserView)

urlpatterns = [
    path('login/', include(router.urls)),
    path('login/email/', EmailView.as_view()),
]