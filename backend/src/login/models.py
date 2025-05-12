from django.db import models
from django.contrib.auth.models import AbstractUser
from administration.models import Customer


class User(AbstractUser):
    last_customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        null=True,
        default=None,
        related_name='last_users'
    )
    customers = models.ManyToManyField(
        Customer,
        blank=True,
    )
    email = models.EmailField(default=None, blank=True, null=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.email


class UserCategories(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        default=None,
        related_name='customer_categories'
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        default=None,
        related_name='users_categories'
    )

    categories = models.JSONField(null=True, blank=True)
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)

    class Meta:
        ordering = ['-time_created']
        constraints = [
            models.UniqueConstraint(
                name='unique_category',
                fields=['user', 'customer']
            ),
        ]


class Suggestion(models.Model):
    content = models.TextField()
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        default=None,
        related_name='suggestions'
    )
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.customer = self.author.last_customer
        return super().save(*args, **kwargs)

    class Meta:
        ordering = ['-time_created']

