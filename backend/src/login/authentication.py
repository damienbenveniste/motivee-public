import firebase_admin
from django.conf import settings
from login.models import User
from firebase_admin import auth, credentials
from rest_framework import authentication
from administration.models import Customer, Invitee
from django.db.models import Q
from django.contrib.auth.models import AnonymousUser
import os

from payment.payment_utils import PaymentFactory, NoActiveSubscriptionException

import logging

LOGGER = logging.getLogger('watchtower')


cred = credentials.Certificate(settings.FIREBASE_CONFIG)
default_app = firebase_admin.initialize_app(cred)


class FirebaseAuthentication(authentication.BaseAuthentication):

    def update_subscription(self, email, customer):
        new_invitee = Invitee(
            email=email,
            customer=customer
        )
        new_invitee.save()
        stripe_customer_id = customer.stripe_customer_id

        if stripe_customer_id:

            invitee_count = Invitee.objects.filter(
                Q(email__isnull=False) & Q(customer=customer)
            ).count()
            try:
                PaymentFactory.modify_quantity(
                    stripe_customer_id,
                    invitee_count
                )
            except NoActiveSubscriptionException:
                pass
            except Exception as e:
                LOGGER.error(e)

    def is_invited(self, email, user, customer):
        domain = email.split('@')[1]
        domain_verified = Invitee.objects.filter(
            Q(email_domain=domain.lower()) & Q(customer=customer))
        invitee = Invitee.objects.filter(Q(email=email) & Q(customer=customer))
        user.email = email

        if invitee.exists():
            user.is_admin = invitee.first().is_admin
            user.last_customer = customer
            user.customers.add(customer)
            user.save(update_fields=['last_customer', 'is_admin', 'email'])
            return user

        if domain_verified.exists():
            user.is_admin = False
            user.last_customer = customer
            user.customers.add(customer)
            user.save(update_fields=['last_customer', 'is_admin', 'email'])
            self.update_subscription(email, customer)
            return user

        return AnonymousUser()

    def authenticate(self, request):

        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return AnonymousUser(), None

        auth_array = auth_header.split(' ')
        customer_id = auth_array.pop()
        id_token = auth_array.pop()
        decoded_token = None
        try:
            decoded_token = auth.verify_id_token(id_token, check_revoked=True)
        except Exception as e:
            LOGGER.error(e)
            return AnonymousUser(), None

        if not id_token or not decoded_token:
            return AnonymousUser(), None

        try:
            uid = decoded_token.get('uid')
            email_verified = decoded_token.get('email_verified')
            email = decoded_token.get('email')
        except Exception as e:
            LOGGER.error(e)
            return AnonymousUser(), None

        if not email_verified:
            return AnonymousUser(), None

        try:
            customer = Customer.objects.get(id=int(customer_id))
        except Exception as e:
            return AnonymousUser(), None

        user, _ = User.objects.get_or_create(username=uid)
        user = self.is_invited(email, user, customer)

        return user, None


class SimpleFirebaseAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):

        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return AnonymousUser(), None

        auth_array = auth_header.split(' ')
        auth_array.pop()
        id_token = auth_array.pop()
        decoded_token = None
        try:
            decoded_token = auth.verify_id_token(id_token, check_revoked=True)
        except Exception as e:
            LOGGER.error(e)
            return AnonymousUser(), None

        if not id_token or not decoded_token:
            return AnonymousUser(), None

        try:
            uid = decoded_token.get('uid')
            email_verified = decoded_token.get('email_verified')
            email = decoded_token.get('email')
        except Exception as e:
            LOGGER.error(e)
            return AnonymousUser(), None

        if not email_verified:
            return AnonymousUser(), None

        user, _ = User.objects.get_or_create(username=uid)
        user.email = email
        user.save(update_fields=['email'])
        return user, None


def generate_link(email_type, email):

    if os.environ.get('ENV') == 'production':
        url = 'https://insight.getmotivee.com'
    else:
        url = 'https://staging.insight.getmotivee.com'

    action_code_settings = auth.ActionCodeSettings(
        url=url,
        handle_code_in_app=True,
    )

    if email_type == 'signin':
        return auth.generate_sign_in_with_email_link(email, action_code_settings)
    if email_type == 'resetPassword':
        return auth.generate_password_reset_link(email, action_code_settings)
    if email_type == 'verifyEmail':
        return auth.generate_email_verification_link(email, action_code_settings)


