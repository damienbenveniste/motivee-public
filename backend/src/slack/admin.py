from django.contrib import admin
from slack.models import SlackBot, SlackInstallation, SlackOAuthState


admin.site.register(SlackBot, admin.ModelAdmin)
admin.site.register(SlackInstallation, admin.ModelAdmin)
admin.site.register(SlackOAuthState, admin.ModelAdmin)

# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     list_display = ('username', 'email', 'last_customer', 'is_admin')


# @admin.register(Suggestion)
# class SuggestionAdmin(admin.ModelAdmin):
#     list_display = ('author', 'customer', 'content')