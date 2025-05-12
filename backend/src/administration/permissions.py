from rest_framework import permissions
from django.core.exceptions import FieldDoesNotExist
import logging

LOGGER = logging.getLogger('watchtower')


class CustomerAccessPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        try:
            if hasattr(obj, 'customers'):
                return obj.customers.filter(pk=request.user.last_customer.pk).exists()
            return request.user.last_customer == obj.customer
        except Exception as e:
            LOGGER.error(e)
            raise e