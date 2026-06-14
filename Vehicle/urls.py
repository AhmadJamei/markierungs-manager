from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.vehicle_list, name='vehicle_list'),
    path('add/', views.vehicle_add, name='vehicle_add'),
    path('update/<str:pk>/', views.vehicle_update, name='vehicle_update'),
    path('delete/<str:pk>/', views.vehicle_delete, name='vehicle_delete'),
    path('export/excel/', views.vehicle_export_excel, name='vehicle_export_excel'),
    path('export/pdf/', views.vehicle_export_pdf, name='vehicle_export_pdf'),
]
