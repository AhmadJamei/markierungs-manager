from django.urls import path
from . import views

urlpatterns = [
    path('', views.material_list, name='material_list'),
    path('add/', views.material_add, name='material_add'),
    path('update/<int:pk>/', views.material_update, name='material_update'),
    path('delete/<int:pk>/', views.material_delete, name='material_delete'),
    path('transaction/add/', views.transaction_add, name='transaction_add'),
    path('transaction/list/', views.transaction_list, name='transaction_list'),
]