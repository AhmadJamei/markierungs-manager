from django.urls import path
from django.contrib.auth import views as auth_views
from .views import SignUpView
from . import views

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),    
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('employees/', views.employee_list, name='employee_list'),
    path('employees/<int:pk>/', views.employee_detail, name='employee_detail'),
]