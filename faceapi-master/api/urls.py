from django.urls import path
from . import views

urlpatterns = [
    path('attendance/', views.attendance_view, name='attendance'),
    path('process_image/', views.process_image, name='process_image'),
    path('process-face-image/', views.process_image, name='process_image'),
    path('students/', views.student_data_view, name='student_data'),  # New route for student data
]
