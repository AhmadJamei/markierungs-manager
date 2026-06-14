from django.urls import path
from . import views


urlpatterns = [
    path('list/', views.customer_list, name='customer_list'),
    path('add/', views.customer_add, name='customer_add'),
    path('update/<int:pk>/', views.customer_update, name='customer_update'),
    path('delete/<int:pk>/', views.customer_delete, name='customer_delete'),
    path('<int:pk>/contracts/', views.customer_contracts, name='customer_contracts'),
    path('export/excel/', views.customer_export_excel, name='customer_export_excel'),
    path('export/pdf/', views.customer_export_pdf, name='customer_export_pdf'),
]