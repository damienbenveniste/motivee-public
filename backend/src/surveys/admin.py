from django.contrib import admin
from surveys.models import ConversationSurvey, ConversationSurveyVote

admin.site.register(ConversationSurvey, admin.ModelAdmin)
admin.site.register(ConversationSurveyVote, admin.ModelAdmin)