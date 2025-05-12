from rest_framework import serializers
from scheduling.models import Summary


class SummarySerializer(serializers.ModelSerializer):
    tag = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name'
    )
    class Meta:
        model = Summary
        fields = [
            'text',
            'conversation', 
            'claim',
            'type',
            'tag',
            'claims_number',
            'pct_pos_consensus',
            'pct_neg_consensus',
        ]