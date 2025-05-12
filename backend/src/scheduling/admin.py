from django.contrib import admin
from scheduling.models import Summary
from conversations.admin import AdminWithDate

admin.site.register(Summary, AdminWithDate)