from django.urls import path
from django.contrib.auth import views as auth_views
from .views import SignUpView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),    
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout')
]