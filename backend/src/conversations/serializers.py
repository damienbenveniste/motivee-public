from rest_framework import serializers
from conversations.models import Conversation, Claim, Vote, Tag
from surveys.serializers import ConversationSurveySerializer


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']

class ConversationSerializer(serializers.ModelSerializer):
    survey = ConversationSurveySerializer(read_only=True)
    tags = serializers.SlugRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        slug_field='name'
    )

    class Meta:
        model = Conversation
        fields = [
            'id',
            'title',
            'question',
            'author',
            'tags',
            'survey',
            'open_ended',
            'time_created',
            'claim_number',
            'participant_number',
            'votes',
        ]


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class ClaimSerializer(serializers.ModelSerializer):
    children = RecursiveField(read_only=True, many=True)
    tags = serializers.SlugRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        slug_field='name'
    )

    class Meta:
        model = Claim
        fields = [
            'id',
            'text',
            'author',
            'conversation',
            'parent',
            'type',
            'tags',
            'pvalue',
            'up_votes',
            'down_votes',
            'children',
            'time_created',
        ]

class SimpleClaimSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        slug_field='name'
    )

    class Meta:
        model = Claim
        fields = [
            'id',
            'text',
            'author',
            'conversation',
            'parent',
            'type',
            'tags',
            'pvalue',
            'up_votes',
            'down_votes',
            'time_created',
        ]

class FeedClaimSerializer(serializers.ModelSerializer):

    conversation = ConversationSerializer(read_only=True)
    parent = SimpleClaimSerializer(read_only=True)
    tags = serializers.SlugRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        slug_field='name'
    )

    class Meta:
        model = Claim
        fields = [
            'id',
            'text',
            'author',
            'conversation',
            'parent',
            'type',
            'tags',
            'pvalue',
            'up_votes',
            'down_votes',
            'time_created',
        ]


class VoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vote
        fields = [
            'id',
            'user',
            'claim',
            'value',
        ]