from django.urls import path
from . import views

urlpatterns = [
    path('', views.schedule_view, name='schedule'),
    path('add/', views.add_workday, name='add_workday'),
    path('delete/<int:pk>/', views.delete_workday, name='delete_workday'),
    path('workers/<int:pk>/', views.get_workday_workers, name='workday_workers'),
    path('update/<int:pk>/', views.update_workday, name='update_workday'),
    path('copy/<int:pk>/', views.copy_workday, name='copy_workday'),
    path('vehicles/<int:pk>/', views.get_workday_vehicles, name='workday_vehicles'),
    path('weather/', views.get_weather, name='get_weather'),
    path('status/<int:pk>/', views.update_status, name='update_status'),
    path('worker-report/', views.worker_report, name='worker_report'),
    path('worker-report/excel/', views.worker_report_excel, name='worker_report_excel'),
    path('worker-report/pdf/', views.worker_report_pdf, name='worker_report_pdf'),
    path('note/<int:workday_id>/<int:worker_id>/', views.save_worker_note, name='save_worker_note'),
    path('note/get/<int:workday_id>/<int:worker_id>/', views.get_worker_note, name='get_worker_note'),
    path('my-schedule/', views.my_schedule, name='my_schedule'),
    path('report/add/<int:workday_id>/', views.add_report, name='add_report'),
    path('report/get/<int:workday_id>/', views.get_report, name='get_report'),
    path('report/image/delete/<int:image_id>/', views.delete_report_image, name='delete_report_image'),
    path('report/review/<int:report_id>/', views.review_report, name='review_report'),
    path('gallery/', views.contract_gallery, name='contract_gallery'),
    path('workday/<int:pk>/detail/', views.workday_detail, name='workday_detail'),
    path('weekly-pptx/', views.generate_weekly_pptx, name='weekly_pptx'),
]