from django.urls import path
from . import views

urlpatterns = [
    path('', views.settings_view, name='settings'),
    path('company/update/', views.company_update, name='company_update'),
    path('material-type/add/', views.material_type_add, name='material_type_add'),
    path('material-type/delete/<int:pk>/', views.material_type_delete, name='material_type_delete'),
    path('contract-type/add/', views.contract_type_add, name='contract_type_add'),
    path('contract-type/delete/<int:pk>/', views.contract_type_delete, name='contract_type_delete'),
]