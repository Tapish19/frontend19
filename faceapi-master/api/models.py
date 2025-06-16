from django.db import models

class Attendance(models.Model):
    name = models.CharField(max_length=255)
    enrollment_number = models.CharField(max_length=255)
    status = models.CharField(max_length=10)  # 'present' or 'absent'
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.enrollment_number}) - {self.status} on {self.date}"

# Create your models here.
