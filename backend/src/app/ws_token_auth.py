from login.models import User
from firebase_admin import auth
from channels.auth import AuthMiddleware
from channels.db import database_sync_to_async
from channels.sessions import CookieMiddleware, SessionMiddleware
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser


import logging

LOGGER = logging.getLogger('watchtower')


@database_sync_to_async
def get_user(scope):
    query_string = parse_qs(scope['query_string'].decode())
    id_token = query_string.get('token')
    if not id_token:
        return AnonymousUser()

    decoded_token = None
    try:
        decoded_token = auth.verify_id_token(id_token[0], check_revoked=True)
    except Exception as e:
        return AnonymousUser()

    if not decoded_token:
        return AnonymousUser()

    try:
        uid = decoded_token.get('uid')
        email_verified = decoded_token.get('email_verified')
    except Exception as e:
        return AnonymousUser()
    
    if not email_verified:
        return AnonymousUser()

    user, _ = User.objects.get_or_create(username=uid)
    return user


class TokenAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        scope['user']._wrapped = await get_user(scope)


def TokenAuthMiddlewareStack(inner):
    return CookieMiddleware(SessionMiddleware(TokenAuthMiddleware(inner)))
