
from rest_framework import serializers
from login.models import Suggestion, User, UserCategories
from administration.serializers import CustomerSerializer

class SuggestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Suggestion
        fields = ['content', 'author']


class UserCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCategories
        fields = ['user', 'customer', 'categories']


class UserSerializer(serializers.ModelSerializer):

    customers = CustomerSerializer(read_only=True, many=True)
    customer_categories = UserCategoriesSerializer(read_only=True, many=True)

    class Meta: 
        model = User
        fields = [
            'username', 
            'customers', 
            'id', 
            'is_admin', 
            'customer_categories',
        ]
