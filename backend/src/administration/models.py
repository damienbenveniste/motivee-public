from django.db import models
from payment.payment_utils import PaymentFactory


class PricingPlan(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False, default='basic')
    price = models.IntegerField(default=0, null=False, blank=False)

    def __str__(self):
        return self.name


class Customer(models.Model):

    name = models.CharField(max_length=120)
    categories = models.JSONField(null=True, blank=True)
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)
    stripe_customer_id = models.CharField(max_length=30, unique=True, null=True, blank=True)
    subscription_id = models.CharField(max_length=120, unique=True, null=True, blank=True)
    plan = models.ForeignKey(
        PricingPlan,
        on_delete=models.SET_NULL,
        null=True,
        related_name='customers',
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):

        if 'update_fields' in kwargs:
            kwargs['update_fields'] = list(
                set(list(kwargs['update_fields']) + ['plan']))

        plan_name, _ = PaymentFactory.get_plan(self.stripe_customer_id)
        self.plan = PricingPlan.objects.get(name=plan_name)
        super().save(*args, **kwargs)


class Invitee(models.Model):

    email = models.EmailField(default=None, blank=True, null=True)
    email_domain = models.CharField(max_length=30, blank=True, null=True)
    customer =  models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=False,
        related_name='invitees',
    )
    is_admin = models.BooleanField(default=False)
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                name='unique_email',
                fields=['email', 'customer']
            ),
        ]
