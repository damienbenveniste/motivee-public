import os
from amqp import NotAllowed
import stripe


class NoActiveSubscriptionException(Exception):
    """Raised when the input value is too small"""
    pass


class PaymentFactory:

    @staticmethod
    def create_customer(customer_name, user_email):
        return stripe.Customer.create(
            name=customer_name,
            email=user_email
        )

    @classmethod
    def get_active_subscriptions(cls, stripe_customer_id):
        if not stripe_customer_id:
            raise Exception('missing customer id')

        subscriptions = stripe.Subscription.list(
            customer=stripe_customer_id,
            status='active',
            limit=100,
        )
        return subscriptions

    @classmethod
    def get_incomplete_subscriptions(cls, stripe_customer_id):
        if not stripe_customer_id:
            raise Exception('missing customer id')

        subscriptions = stripe.Subscription.list(
            customer=stripe_customer_id,
            status='incomplete',
            limit=100,
        )
        return subscriptions

    @classmethod
    def clean_subscriptions(cls, stripe_customer_id):
        if not stripe_customer_id:
            raise Exception('missing customer id')

        active_subscriptions = cls.get_active_subscriptions(
            stripe_customer_id
        )

        incomplete_subscriptions = cls.get_incomplete_subscriptions(
            stripe_customer_id
        )

        if active_subscriptions.data:
            subscription = stripe.Subscription.retrieve(
                active_subscriptions.data[0].id,
            )
            for sub in incomplete_subscriptions.data:
                stripe.Subscription.delete(sub.id)
            return subscription

        if incomplete_subscriptions.data:
            subscription = stripe.Subscription.retrieve(
                incomplete_subscriptions.data.pop().id,
                expand=['latest_invoice.payment_intent'],
            )
            for sub in incomplete_subscriptions.data:
                stripe.Subscription.delete(sub.id)

            return subscription
        
        return None

    @classmethod
    def get_or_create_subscription(cls, stripe_customer_id, invitee_count, interval):

        if not stripe_customer_id:
            raise Exception('missing customer id')

        subscription = cls.clean_subscriptions(stripe_customer_id)

        if interval not in ('month', 'year'):
            raise KeyError('Missing interval')

        price_id = MONTHLY_PRICE if interval == 'month' else YEARLY_PRICE

        if subscription and subscription.status == 'active':
            return subscription

        if not subscription or subscription.plan.id != price_id or subscription.quantity != invitee_count:
            return stripe.Subscription.create(
                customer=stripe_customer_id,
                items=[{
                    'price': price_id,
                    'quantity': invitee_count
                }],
                payment_behavior='default_incomplete',
                payment_settings={
                    'save_default_payment_method': 'on_subscription',
                    'payment_method_types': ['card']
                },
                expand=['latest_invoice.payment_intent'],
            )

        return subscription

    @classmethod
    def get_plan(cls, stripe_customer_id, subscription=None):

        if not stripe_customer_id:
            return 'basic', None

        if not subscription:
            subscriptions = cls.get_active_subscriptions(stripe_customer_id)
            if not subscriptions.data:
                return 'basic', None
            subscription = subscriptions.data.pop()

        if subscription.plan.id == MONTHLY_PRICE:
            return 'team_monthly', subscription

        if subscription.plan.id == YEARLY_PRICE:
            return 'team_yearly', subscription

        raise NotAllowed

    @staticmethod
    def get_session(stripe_customer_id, customer_id):

        if not stripe_customer_id:
            raise Exception('missing customer id')

        if os.environ.get('ENV') == 'production':
            host = 'https://insight.getmotivee.com'
        elif os.environ.get('ENV') == 'staging':
            host = 'https://staging.insight.getmotivee.com'
        else:
            host = 'http://localhost:3000'

        return_url = '{}/{}/admin/billing'.format(host, customer_id)

        session = stripe.billing_portal.Session.create(
            customer=stripe_customer_id,
            return_url=return_url,
        )

        return session

    @staticmethod
    def get_customer_email(stripe_customer_id):

        if not stripe_customer_id:
            raise Exception('missing customer id')

        customer = stripe.Customer.retrieve(
            id=stripe_customer_id,
        )

        return customer.email

    @classmethod
    def get_current_subscription(cls, stripe_customer_id):

        if not stripe_customer_id:
            raise Exception('missing customer id')

        subscriptions = cls.get_active_subscriptions(stripe_customer_id)
        if not subscriptions.data:
            raise NoActiveSubscriptionException

        subscription = subscriptions.data.pop()
        return subscription

    @classmethod
    def cancel_subscription_at_period_end(cls, stripe_customer_id):

        if not stripe_customer_id:
            raise Exception('missing customer id')

        subscription = cls.get_current_subscription(stripe_customer_id)
        return stripe.Subscription.modify(
            subscription.id,
            cancel_at_period_end=True
        )

    @classmethod
    def renew_subscription(cls, stripe_customer_id):

        if not stripe_customer_id:
            raise Exception('missing customer id')

        subscription = cls.get_current_subscription(stripe_customer_id)
        return stripe.Subscription.modify(
            subscription.id,
            cancel_at_period_end=False
        )

    @classmethod
    def modify_billing_interval(cls, stripe_customer_id, interval, subscription=None):

        if not stripe_customer_id:
            raise Exception('missing customer id')

        if not subscription:
            subscription = cls.get_current_subscription(stripe_customer_id)

        if interval == subscription.plan.interval:
            raise Exception('Already set')

        price_id = MONTHLY_PRICE if interval == 'month' else YEARLY_PRICE

        return stripe.Subscription.modify(
            subscription.id,
            # cancel_at_period_end=False,
            proration_behavior='create_prorations',
            items=[{
                'id': subscription['items']['data'][0].id,
                'price': price_id,
            }],
        )

    @classmethod
    def modify_quantity(cls, stripe_customer_id, quantity, subscription=None):

        if not stripe_customer_id:
            raise Exception('missing customer id')

        if not subscription:
            subscription = cls.get_current_subscription(stripe_customer_id)

        if quantity <= 0:
            raise Exception('Cannot be less than zero')

        if quantity == subscription.quantity:
            raise Exception('Alrready current quantity')

        return stripe.Subscription.modify(
            subscription.id,
            # cancel_at_period_end=False,
            proration_behavior='create_prorations',
            items=[{
                'id': subscription['items']['data'][0].id,
                'quantity': quantity
            }],
        )

    @classmethod
    def delete_subscription(cls, stripe_customer_id, subscription=None):

        if not stripe_customer_id:
            raise Exception('missing customer id')

        if not subscription:
            subscription = cls.get_current_subscription(stripe_customer_id)

        return stripe.Subscription.delete(
            subscription.id,
            invoice_now=True,
            prorate=True
        )
