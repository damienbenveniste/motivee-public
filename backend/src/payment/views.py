from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from administration.models import Invitee
from django.db.models import Q
from payment.payment_utils import PaymentFactory
from datetime import datetime, timezone
import logging

LOGGER = logging.getLogger('watchtower')
TRIAL_DAYS = 15


def is_trial(customer):
    today = datetime.now(timezone.utc)
    diff = today - customer.time_created
    days  = TRIAL_DAYS - diff.days
    return days >= 0, days


class CreateSubscriptionIntent(APIView):

    def get(self, request, format=None):

        try:
            user = self.request.user
            customer = user.last_customer
            interval = request.query_params.get('interval')

            if not user.is_admin:
                return Response({'error': 'Not an admin'}, status=status.HTTP_401_UNAUTHORIZED)

            if not interval:
                raise KeyError('Missing interval')

            if interval not in ('month', 'year'):
                raise KeyError('Missing interval')

            if customer.stripe_customer_id:
                stripe_customer_id = customer.stripe_customer_id
            else:
                stripe_customer = PaymentFactory.create_customer(
                    customer_name=customer.name,
                    user_email=user.email
                )
                stripe_customer_id = stripe_customer['id']
                customer.stripe_customer_id = stripe_customer_id
                customer.save(update_fields=['stripe_customer_id'])

            invitee_count = Invitee.objects.filter(
                Q(email__isnull=False) & Q(customer=customer)
            ).count()

            subscription = PaymentFactory.get_or_create_subscription(
                stripe_customer_id, 
                invitee_count, 
                interval
            )

            if subscription.status == 'active':
                return Response({   
                    'subscription': subscription,
                }, status=status.HTTP_208_ALREADY_REPORTED)

            customer.subscription_id = subscription.id
            customer.save(update_fields=['subscription_id'])

            total = subscription.latest_invoice.payment_intent.amount
            quantity = subscription.quantity
            price = subscription.plan.amount

            # print(subscription)

            return Response({
                'clientSecret': subscription.latest_invoice.payment_intent.client_secret,
                'price': price / 100,
                'quantity': quantity,
                'total': total / 100
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(e)
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)


class CurrentPlanView(APIView):

    def get(self, request, format=None):

        try:
            user = self.request.user
            customer = user.last_customer

            # if not user.is_admin:
            #     return Response({'error': 'Not an admin'}, status=status.HTTP_401_UNAUTHORIZED)

            stripe_customer_id = customer.stripe_customer_id
            plan, subscription = PaymentFactory.get_plan(stripe_customer_id)
            try:
                email = PaymentFactory.get_customer_email(stripe_customer_id)
            except:
                email = user.email

            invitee_count = Invitee.objects.filter(
                Q(email__isnull=False) & Q(customer=customer)
            ).count()

            trial, days = is_trial(customer)

            return Response({
                'plan': plan,
                'email': email,
                'member_number': invitee_count,
                'subscription': subscription,
                'trial': trial,
                'trial_days': days,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

    def patch(self, request, format=None):

        try:
            modification = request.data.get('modification')
            user = self.request.user
            customer = user.last_customer
            stripe_customer_id = customer.stripe_customer_id

            if not user.is_admin:
                return Response({'error': 'Not an admin'}, status=status.HTTP_401_UNAUTHORIZED)

            subscription = None
            if modification == 'cancel':
                subscription = PaymentFactory.cancel_subscription_at_period_end(stripe_customer_id)

            if modification == 'inverval':
                interval = request.data.get('interval')
                subscription = PaymentFactory.modify_billing_interval(stripe_customer_id, interval)
                print(subscription)

            if modification == 'renew':
                subscription = PaymentFactory.renew_subscription(stripe_customer_id) 
            
            if not subscription:
                raise Exception('Missing subscription')

            plan, _ = PaymentFactory.get_plan(stripe_customer_id, subscription)

            return Response({'subscription': subscription, 'plan': plan}, status=status.HTTP_200_OK)    

        except Exception as e:
            print(e)
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
        

class SessionView(APIView):

    def post(self, request, format=None):

        user = self.request.user
        if not user.is_admin:
            return Response({'error': 'Not an admin'}, status=status.HTTP_401_UNAUTHORIZED)

        customer = user.last_customer
        stripe_customer_id = customer.stripe_customer_id
        if not stripe_customer_id:
            return Response({'error': 'Not a customer'}, status=status.HTTP_401_UNAUTHORIZED)

        session = PaymentFactory.get_session(stripe_customer_id, customer.id)

        return Response({'url': session.url}, status=status.HTTP_200_OK)


