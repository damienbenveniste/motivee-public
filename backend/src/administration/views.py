from rest_framework import viewsets, status
from rest_framework.response import Response
from administration.models import Invitee, Customer
from django.db.models import Q
from administration.serializers import (
    InviteeSerializer,
    CustomerSerializer
)
from rest_framework.authentication import SessionAuthentication
from login.authentication import SimpleFirebaseAuthentication
from rest_framework.permissions import IsAuthenticated
from administration.email_utils import EmailOps
from payment.payment_utils import PaymentFactory, NoActiveSubscriptionException
import logging


LOGGER = logging.getLogger('watchtower')


def update_subscription(customer):

    stripe_customer_id = customer.stripe_customer_id
    if not stripe_customer_id:
        return

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


class InviteeView(viewsets.ModelViewSet):
    authentication_classes = [
        SessionAuthentication,
        SimpleFirebaseAuthentication
    ]
    filter_backends = []
    serializer_class = InviteeSerializer
    queryset = Invitee.objects.all()

    def get_queryset(self):

        try:
            email = self.request.user.email
            domain = email.split('@')[1]
            queryset = self.queryset.filter(
                Q(email=email) | Q(email_domain=domain)
            )
            return queryset
        except Exception as e:
            LOGGER.error(e)
            return self.queryset.none()


class CustomerView(viewsets.ModelViewSet):
    authentication_classes = [
        SessionAuthentication,
        SimpleFirebaseAuthentication
    ]
    filter_backends = []
    serializer_class = CustomerSerializer
    queryset = Customer.objects.all()

    def create(self, request, *args, **kwargs):

        try:

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            customer = Customer.objects.get(id=serializer.data['id'])

            Invitee(
                email=self.request.user.email,
                customer=customer,
                is_admin=True
            ).save()

            if 'emailList' in request.data:
                email_list = request.data.pop('emailList')
                for email in email_list:
                    if not Invitee.objects.filter(Q(email=email) & Q(customer=customer)).exists():
                        Invitee(
                            email=email,
                            customer=customer
                        ).save()

                if email_list:
                    EmailOps.send_email(
                        to_emails=email_list,
                        sender=self.request.user.email,
                        dynamic_template_data={
                            'workspace_name': customer.name,
                            "subject": 'Join the Motivee workspace "{}"'.format(customer.name),
                            'sender': self.request.user.email,
                            'id': customer.id, 
                        }
                    )

            if 'domainList' in request.data:
                domain_list = request.data.pop('domainList')
                for domain in domain_list:
                    if not Invitee.objects.filter(Q(email_domain=domain) & Q(customer=customer)).exists():
                        Invitee(
                            email_domain=domain,
                            customer=customer
                        ).save()

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except Exception as e:
            LOGGER.error(e)
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PrivateCustomerView(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    queryset = Customer.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = []

    def destroy(self, request, *args, **kwargs):
        try:
            if not self.request.user.is_admin:
                raise Exception('Not allowed')

            customer = self.get_object()
            stripe_customer_id = customer.stripe_customer_id
            self.perform_destroy(customer)
            if stripe_customer_id:
                try:
                    PaymentFactory.delete_subscription(stripe_customer_id)
                except NoActiveSubscriptionException:
                    pass
                except Exception:
                    LOGGER.error(e)
                
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(e)
            LOGGER.error(e)
            return Response(status=status.HTTP_403_FORBIDDEN)


class PrivateInviteeView(viewsets.ModelViewSet):
    serializer_class = InviteeSerializer
    queryset = Invitee.objects.all()

    def create(self, request, *args, **kwargs):

        try:
            customer = self.request.user.last_customer
            invitees = []
            if 'emailList' in request.data:
                email_list = request.data.pop('emailList')
                for email in email_list:
                    if not Invitee.objects.filter(Q(email=email) & Q(customer=customer)).exists():
                        invitee = Invitee(
                            email=email,
                            customer=customer
                        )
                        invitee.save()
                        invitees.append(invitee)

                update_subscription(customer)

                if email_list:
                    EmailOps.send_email(
                        to_emails=email_list,
                        sender=self.request.user.email,
                        dynamic_template_data={
                            'workspace_name': customer.name,
                            "subject": 'Join the Motivee workspace "{}"'.format(customer.name),
                            'sender': self.request.user.email,
                            'id': customer.id, 
                        }
                    )

            if 'domainList' in request.data:
                domain_list = request.data.pop('domainList')
                for domain in domain_list:
                    if not Invitee.objects.filter(Q(email_domain=domain) & Q(customer=customer)).exists():
                        invitee = Invitee(
                            email_domain=domain,
                            customer=customer
                        )
                        invitee.save()
                        invitees.append(invitee)

            serializer = self.get_serializer(instance=invitees, many=True)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            LOGGER.error(e)
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        try:
            if not self.request.user.is_admin:
                raise Exception('Not allowed')

            if 'email' in self.request.query_params:
                return self.queryset.filter(
                    Q(email__isnull=False) & Q(email_domain__isnull=True)
                )
            if 'domain' in self.request.query_params:
                return self.queryset.filter(
                    Q(email__isnull=True) & Q(email_domain__isnull=False)
                )

            return self.queryset
        except Exception as e:
            LOGGER.error(e)
            return self.queryset.none()

    def update(self, request, *args, **kwargs):
        try:
            if not self.request.user.is_admin:
                raise Exception('Not allowed')
            return super().update(request, *args, **kwargs)
        except Exception as e:
            print(e)
            LOGGER.error(e)
            return Response(status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        try:
            if not self.request.user.is_admin:
                raise Exception('Not allowed')
            instance = self.get_object()
            self.perform_destroy(instance)
            customer = self.request.user.last_customer
            update_subscription(customer)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(e)
            LOGGER.error(e)
            return Response(status=status.HTTP_403_FORBIDDEN)
