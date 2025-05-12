from django.contrib import admin
from conversations.models import Conversation, Claim, Vote, Tag


class AdminWithDate(admin.ModelAdmin):
    readonly_fields = ['last_updated']

admin.site.register(Conversation, AdminWithDate)
admin.site.register(Tag, admin.ModelAdmin)
admin.site.register(Claim, admin.ModelAdmin)
admin.site.register(Vote, admin.ModelAdmin)