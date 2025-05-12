
from genericpath import exists
from rest_framework import viewsets, status
from rest_framework.response import Response
from conversations.serializers import (
    ConversationSerializer,
    ClaimSerializer,
    TagSerializer,
    TagSerializer,
    VoteSerializer,
    SimpleClaimSerializer,
    FeedClaimSerializer,
)
from conversations.models import Conversation, Claim, Vote, Tag
from surveys.models import ConversationSurvey
from django.db.models import Q, Func, F
from app.pagination import LargePagination, SmallPagination
import logging


LOGGER = logging.getLogger('watchtower')


class ConversationView(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()

    def create(self, request, *args, **kwargs):

        try:
            if not self.request.user.is_admin:
                return Response({'error': 'Not an admin'}, status=status.HTTP_401_UNAUTHORIZED)

            request.data.update({'author': self.request.user.pk})
            if 'tags' in request.data:
                request.data['tags'] = list(set([tag.lower().strip() for tag in request.data['tags']]))

            serializer = self.get_serializer(data=request.data)

            if 'tags' in request.data:
                for name in request.data['tags']:

                    if not name:
                        raise KeyError('Null category')

                    tag, created = Tag.objects.get_or_create(name=name.lower().strip())
                    if not created:
                        tag.number_used += 1
                        tag.save(update_fields=['number_used'])

                    tag.customers.add(self.request.user.last_customer)

            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            if not serializer.data['open_ended']:
                conversation = Conversation.objects.get(id=serializer.data['id'])
                survey = ConversationSurvey(conversation=conversation)
                survey.save()

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except Exception as e:
            LOGGER.error(e)
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            if not self.request.user.is_admin:
                return Response({'error': 'Not admin'}, status=status.HTTP_401_UNAUTHORIZED)

            if 'tags' in request.data:
                for name in request.data['tags']:

                    if not name:
                        raise KeyError('Null category')

                    tag, _ = Tag.objects.get_or_create(name=name.lower().strip())
                    tag.customers.add(self.request.user.last_customer)

            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):

        try:
            queryset = self.queryset
            if 'searchText' in self.request.query_params:
                search_text = self.request.query_params['searchText']
                queryset = queryset.filter(
                    Q(title__icontains=search_text) | Q(
                        question__icontains=search_text)
                )
                return queryset

            return queryset
        except Exception as e:
            LOGGER.error(e)
            return self.queryset.none()

    def destroy(self, request, *args, **kwargs):

        try:
            conversation = self.get_object()
            if conversation.claim_number == 0 and conversation.votes == 0 and conversation.author == self.request.user:
                self.perform_destroy(conversation)
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                Response('Cannot delete', status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ClaimView(viewsets.ModelViewSet):
    serializer_class = ClaimSerializer
    queryset = Claim.objects.all()
    pagination_class = LargePagination

    def create(self, request, *args, **kwargs):
        request.data.update({'author': self.request.user.pk})
        try:
            if 'tags' in request.data:
                conversation = Conversation.objects.get(id=request.data['conversation'])
                for name in request.data['tags']:
                    if not name:
                        raise KeyError('Null category')

                    tag, created = Tag.objects.get_or_create(name=name.lower().strip())
                    tag.customers.add(self.request.user.last_customer)
                    conversation.tags.add(tag)
                    if not created:
                        tag.number_used += 1
                        tag.save(update_fields=['number_used'])
                    
            return super().create(request, *args, **kwargs)
        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            conversation = instance.conversation
            if 'tags' in request.data:
                for name in request.data['tags']:

                    if not name:
                        raise KeyError('Null category')

                    tag, _ = Tag.objects.get_or_create(name=name.lower().strip())
                    tag.customers.add(self.request.user.last_customer)
                    conversation.tags.add(tag)

            partial = kwargs.pop('partial', False)
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        try:
            queryset = self.queryset
            if 'conversationId' in self.request.query_params:
                conversation_id = self.request.query_params['conversationId']
                queryset = queryset.filter(
                    Q(parent__isnull=True) & Q(
                        conversation__id=conversation_id)
                )
                return queryset

            return queryset
        except Exception as e:
            LOGGER.error(e)
            return self.queryset.none()


class VoteView(viewsets.ModelViewSet):
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()

    def create(self, request, *args, **kwargs):

        try:
            request.data.update({'user': self.request.user.pk})
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            claim = Claim.objects.get(id=serializer.data['claim'])
            conversation = claim.conversation
            conversation.votes += 1
            conversation.save(update_fields=['votes'])
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):

        try:
            instance = self.get_object()
            claim = instance.claim
            conversation = claim.conversation
            conversation.votes -= 1
            self.perform_destroy(instance)
            conversation.save(update_fields=['votes'])
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):

        try:

            queryset = self.queryset
            if 'claim' in self.request.query_params:
                claim_id = self.request.query_params.get('claim')
                user = self.request.user
                queryset = queryset.filter(
                    Q(claim__id=claim_id) & Q(user=user)
                )
            return queryset

        except Exception as e:
            LOGGER.error(e)
            return self.queryset.none()


class SimpleClaimView(viewsets.ModelViewSet):
    serializer_class = SimpleClaimSerializer
    queryset = Claim.objects.all()

    def get_queryset(self):

        try:
            queryset = self.queryset

            if 'conversationId' in self.request.query_params:
                conversation_id = self.request.query_params.get('conversationId')
                queryset = queryset.filter(conversation__id=conversation_id)

            if 'topRelation' in self.request.query_params:
                top_relation = self.request.query_params.get('topRelation')
                queryset = queryset.filter(top_relation=top_relation)

            if 'claimId' in self.request.query_params:
                claim_id = self.request.query_params.get('claimId')
                queryset = queryset.filter(root_claim__id=claim_id)

            if 'tag' in self.request.query_params:
                tag = self.request.query_params.get('tag')
                queryset = queryset.filter(tags__name=tag)

            if 'root' in self.request.query_params:
                queryset = queryset.filter(parent__isnull=True)

            # if queryset.count() > 5:
            #     queryset = queryset.filter(pvalue__lte=-0.9)

            return queryset

        except Exception as e:
            LOGGER.error(e)
            return self.queryset.none()


class FeedClaimView(viewsets.ModelViewSet):
    serializer_class = FeedClaimSerializer
    queryset = Claim.objects.all()
    pagination_class = SmallPagination

    def get_queryset(self):

        try:
            queryset = self.queryset

            queryset = queryset.annotate(
                all_votes=F('up_votes') + F('down_votes'),
                abs_pvalue=Func(F('pvalue'), function='ABS')
            ).order_by('abs_pvalue', 'all_votes', '-time_created', '-id')

            return queryset

        except Exception as e:
            LOGGER.error(e)
            return self.queryset.none()


class TagView(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
