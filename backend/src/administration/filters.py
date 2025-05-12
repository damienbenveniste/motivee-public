from rest_framework import filters
from django.core.exceptions import FieldDoesNotExist
import logging

LOGGER = logging.getLogger('watchtower')


class CustomerFilterBackend(filters.BaseFilterBackend):

    def check_exists(self, queryset, field):
        try: 
            queryset.model._meta.get_field(field)
            return True
        except FieldDoesNotExist:
            return False

    def filter_queryset(self, request, queryset, view):
        try:
            if self.check_exists(queryset, 'customers'):
                return queryset.filter(customers=request.user.last_customer)

            if self.check_exists(queryset, 'customer'):
                return queryset.filter(customer=request.user.last_customer)

        except Exception as e:
            LOGGER.error(e)
            raise e

