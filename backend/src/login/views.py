from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from login.serializers import SuggestionSerializer, UserSerializer
from login.models import Suggestion, User
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BaseAuthentication
from login.email_utils import EmailLogin
import logging

LOGGER = logging.getLogger('watchtower')


class SuggestionView(viewsets.ModelViewSet):
    serializer_class = SuggestionSerializer
    queryset = Suggestion.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            request.data.update({'author': self.request.user.pk})
            return super().create(request, *args, **kwargs)
        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'username'


class EmailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, format=None):

        try:
            email_type = request.data.get('type')
            email = request.data.get('email')
            EmailLogin.sendEmail(email, email_type)
            return Response({'success': 'sent'}, status=status.HTTP_200_OK)

        except Exception as e:
            LOGGER.error(e)
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
