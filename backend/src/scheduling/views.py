from rest_framework import viewsets
from scheduling.serializers import SummarySerializer
from scheduling.models import Summary
from django.db.models import Q


class SummaryView(viewsets.ModelViewSet):
    serializer_class = SummarySerializer
    queryset = Summary.objects.all()

    def get_queryset(self):

        try:
            if not self.request.user.is_admin:
                return self.queryset.none()

            queryset = self.queryset
            if 'conversation' in self.request.query_params and \
                'type' in self.request.query_params:

                conversation_id = self.request.query_params['conversation']
                summary_type = self.request.query_params['type']

                claim_id = self.request.query_params.get('claim', None)
                tag = self.request.query_params.get('tag', None)

                if tag:
                    queryset = queryset.filter(
                        Q(conversation=conversation_id) & 
                        Q(claim=claim_id) & 
                        Q(tag__name=tag) & 
                        Q(type=summary_type)
                    )
                else:
                    queryset = queryset.filter(
                        Q(conversation=conversation_id) & 
                        Q(claim=claim_id) & 
                        Q(tag=None) & 
                        Q(type=summary_type)
                    )

                return queryset

            return queryset

        except Exception as e:
            return self.queryset.none()
