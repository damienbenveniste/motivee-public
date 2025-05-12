from django.contrib import admin
from administration.models import Customer, Invitee, PricingPlan


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'plan', 'stripe_customer_id', 'subscription_id')
    search_fields = ("name__startswith", )


@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price')


@admin.register(Invitee)
class InviteeAdmin(admin.ModelAdmin):
    list_display = ('customer', 'email', 'email_domain', 'is_admin')

