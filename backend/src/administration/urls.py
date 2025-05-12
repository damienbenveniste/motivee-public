from django.urls import path, include
from rest_framework import routers
from administration.views import (
    InviteeView,
    CustomerView,
    PrivateInviteeView,
    PrivateCustomerView 
)

router = routers.DefaultRouter()
router.register(r'invitees', InviteeView)
router.register(r'customers', CustomerView)
router.register(r'private_invitees', PrivateInviteeView)
router.register(r'private_customers', PrivateCustomerView)


urlpatterns = [
    path('administration/', include(router.urls)),
]