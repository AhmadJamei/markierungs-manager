from django.db import models
from django.conf import settings

class LeaveRequest(models.Model):
    
    STATUS = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected")
    ]

    LEAVE_TYPES = [
        ('ill', 'Krank'),
        ('holiday', 'Urlaub')
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPES, default='holiday')
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    manager_note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.start_date} to {self.end_date}"

    @property
    def total_days(self):
        return (self.end_date - self.start_date).days + 1