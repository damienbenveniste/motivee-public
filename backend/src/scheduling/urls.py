from django.urls import path, include
from rest_framework import routers
from scheduling.views import SummaryView

router = routers.DefaultRouter()
router.register(r'summaries', SummaryView)

urlpatterns = [
    path('scheduling/', include(router.urls)),
]