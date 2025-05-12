from rest_framework import viewsets, status
from rest_framework.response import Response
from conversations.models import Conversation
from conversations.serializers import ConversationSerializer
from surveys.models import ConversationSurvey
from surveys.serializers import ConversationSurveySerializer
from administration.models import Invitee
from administration.serializers import InviteeSerializer
from django.db.models import Case, Value, When, Count
import datetime
import time
from scipy import stats
import numpy as np
import logging


LOGGER = logging.getLogger('watchtower')

 
class ConversationStatsView(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()

    def retrieve(self, request, *args, **kwargs):
        conversation = self.get_object()
        answers = conversation.claims.filter(parent__isnull=True).distinct()
        counts = answers.annotate(
            consensus=Case(
                When(pvalue__lt=-0.9, then=Value('Positive Consensus')),
                When(pvalue__lt=0.9, then=Value('Indeterminate')),
                default=Value('Negative Consensus'),
            )
        ).values('consensus').annotate(count=Count('consensus')).order_by('count')

        return Response(counts) 


class ConversationSurveyStatsView(viewsets.ModelViewSet):
    serializer_class = ConversationSurveySerializer
    queryset = ConversationSurvey.objects.all()

    def get_pvalue(self, up_votes, down_votes):

        if up_votes + down_votes < 1:
            return 0

        test = stats.binomtest(
            up_votes,
            up_votes + down_votes,
            alternative='two-sided'
        )

        return (test.pvalue - 1) * np.sign(up_votes - down_votes)

    def retrieve(self, request, *args, **kwargs):

        try:
            survey = self.get_object()
            category = request.parser_context['request'].GET['category']
            value = request.parser_context['request'].GET['value']

            if category == 'Start date':
                if value == 'less than 1 year':
                    date = datetime.datetime.now() - datetime.timedelta(days=365)
                    filter_params = {
                        'user__categories__{category}__gt'.format(category=category): 
                        str(int(time.mktime(date.timetuple())))
                    }
                elif value == 'more than 5 years':
                    date = datetime.datetime.now() - datetime.timedelta(days=5*365)
                    filter_params = {
                        'user__categories__{category}__lt'.format(category=category): 
                        str(int(time.mktime(date.timetuple())))
                    }
                else:
                    date1 = datetime.datetime.now() - datetime.timedelta(days=365)
                    date2 = datetime.datetime.now() - datetime.timedelta(days=5*365)
                    filter_params = {
                        'user__categories__{category}__lt'.format(category=category): str(int(time.mktime(date1.timetuple()))),
                        'user__categories__{category}__gt'.format(category=category): str(int(time.mktime(date2.timetuple())))
                    }
            else:
                filter_params = {'user__categories__{category}'.format(category=category): value}

            votes = survey.conversation_survey_votes.filter(**filter_params)
            votes_counts  = {
                'up_votes': votes.filter(value=1).count(),
                'down_votes': votes.filter(value=-1).count()
            }

            votes_counts['pvalue'] = self.get_pvalue(
                votes_counts['up_votes'], 
                votes_counts['down_votes']
            )

            return Response(votes_counts)

        except Exception as e:
            LOGGER.error(e)
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)




