from django.urls import path
from . import views

urlpatterns = [
    path('', views.calendarView, name='calendarView'),
    path('get-leaves/', views.get_leaves, name='get-leaves'),
    path('add-leave/', views.add_leave, name='add-leave'),
    path('delete-leave/<int:pk>/', views.delete_leave, name='delete-leave'),
    path('manager/', views.manager_leave_view, name='manager_leave'),
    path('approve/<int:pk>/', views.approve_leave, name='approve_leave'),
    path('report/', views.leave_report, name='leave_report'),
    path('report/excel/', views.leave_report_excel, name='leave_report_excel'),
    path('report/pdf/', views.leave_report_pdf, name='leave_report_pdf'),
]  