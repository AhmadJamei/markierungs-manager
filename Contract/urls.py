from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.contract_list, name='contract_list'),
    path('add/', views.contract_add, name='contract_add'),
    path('update/<int:pk>/',views.contract_update, name='contract_update'),
    path('delete/<int:pk>/', views.contract_delete, name='contract_delete'),
    path('export/excel/', views.contract_export_excel, name='contract_export_excel'),
    path('export/pdf/', views.contract_export_pdf, name='contract_export_pdf'),
    path('<int:pk>/materials/', views.contract_materials, name='contract_materials'),
    path('<int:pk>/materials/add/', views.contract_material_add, name='contract_material_add'),
    path('materials/delete/<int:pk>/', views.contract_material_delete, name='contract_material_delete'),

    ]
