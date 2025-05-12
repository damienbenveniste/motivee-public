from rest_framework import viewsets, status
from rest_framework.response import Response
from surveys.models import ConversationSurvey, ConversationSurveyVote
from surveys.serializers import (
    ConversationSurveySerializer,
    ConversationSurveyVoteSerializer
)
from django.db.models import Q
import logging

LOGGER = logging.getLogger('watchtower')


class ConversationSurveyView(viewsets.ModelViewSet):
    serializer_class = ConversationSurveySerializer
    queryset = ConversationSurvey.objects.all()


class ConversationSurveyVoteView(viewsets.ModelViewSet):
    serializer_class = ConversationSurveyVoteSerializer
    queryset = ConversationSurveyVote.objects.all()

    def get_queryset(self):

        try:
            queryset = self.queryset
            if 'survey' in self.request.query_params:
                survey_id = self.request.query_params.get('survey')
                user = self.request.user
                queryset = queryset.filter(
                    Q(survey__id=survey_id) & Q(user=user)
                )
            return queryset

        except Exception as e:
            LOGGER.error(e)
            return self.queryset.none()

    def create(self, request, *args, **kwargs):

        try:
            request.data.update({'user': self.request.user.pk})
            serializer = self.get_serializer(data=request.data)

            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            survey = ConversationSurvey.objects.get(id=serializer.data['survey'])
            conversation = survey.conversation
            conversation.votes += 1
            conversation.save(update_fields=['votes'])
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except Exception as e:
            LOGGER.error(e)
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):

        try:
            instance = self.get_object()
            survey = instance.survey
            conversation = survey.conversation
            conversation.votes -= 1
            self.perform_destroy(instance)
            survey.save(update_fields=['up_votes', 'down_votes'])
            conversation.save(update_fields=['votes'])
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

