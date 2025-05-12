from rest_framework import serializers
from surveys.models import ConversationSurvey, ConversationSurveyVote

 
class ConversationSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversationSurvey
        fields = [
            'id',
            'conversation', 
            'customer',
            'up_votes',
            'down_votes',
            'pvalue',
        ]


class ConversationSurveyVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversationSurveyVote
        fields = [
            'id',
            'user', 
            'survey',
            'value',
        ]
