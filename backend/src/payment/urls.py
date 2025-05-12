from django.urls import path
from payment.views import (
    CreateSubscriptionIntent,
    CurrentPlanView,
    SessionView
)

urlpatterns = [
    path('payment/create-subscription-intent/', CreateSubscriptionIntent.as_view()),
    path('payment/current-plan/', CurrentPlanView.as_view()),
    path('payment/session/', SessionView.as_view()),
]
