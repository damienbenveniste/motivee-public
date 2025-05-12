from django.contrib import admin
from login.models import User, Suggestion, UserCategories


admin.site.register(UserCategories, admin.ModelAdmin)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'last_customer', 'is_admin')


@admin.register(Suggestion)
class SuggestionAdmin(admin.ModelAdmin):
    list_display = ('author', 'customer', 'content')
