from django.urls import path, include
from rest_framework import routers
from conversations.views import (
    ConversationView, 
    ClaimView, 
    VoteView,
    SimpleClaimView,
    FeedClaimView,
    TagView
)

router = routers.DefaultRouter()
router.register(r'conversations', ConversationView)
router.register(r'claims', ClaimView)
router.register(r'votes', VoteView)
router.register(r'top-claims', SimpleClaimView)
router.register(r'feed-claims', FeedClaimView)
router.register(r'tags', TagView)


urlpatterns = [
    path('conversations/', include(router.urls)),
]