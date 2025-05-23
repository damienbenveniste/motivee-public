"""src URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from app.health import check_health, react_logging

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', check_health),
    path('react-logging/', react_logging),
    path('', include('login.urls')),
    path('', include('conversations.urls')),
    path('', include('scheduling.urls')),
    path('', include('surveys.urls')),
    path('', include('stats.urls')),
    path('', include('administration.urls')),
    path('', include('payment.urls')),
    path('', include('slack.urls')),
]
