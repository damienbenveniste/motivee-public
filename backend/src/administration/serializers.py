from rest_framework import serializers
from administration.models import Customer, Invitee, PricingPlan


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'id',
            'name',
            'categories',
            'time_created',
        ]


class InviteeSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)

    class Meta:
        model = Invitee
        fields = [
            'id',
            'email',
            'customer',
            'is_admin',
            'email_domain',
            'time_created',
        ]


class PricingPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = PricingPlan
        fields = [
            'id',
            'name'
        ]
    

