"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.contrib.auth import views as auth_views
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Firstpage.urls')),
    path('customer/', include('Customer.urls')),
    path('contract/', include('Contract.urls')),
    path('calendar/', include('Calendar.urls')),
    path('accounts/', include('django.contrib.auth.urls')),   
    path('accounts/', include('Accounts.urls')),
    path('dashboard/', include('Dashboard.urls')),
    path('schedule/', include('Schedule.urls')),
    path('vehicle/', include('Vehicle.urls')),
    path('warehouse/', include('Warehouse.urls')),
    path('settings/', include('Settings.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
