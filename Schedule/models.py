from django.db import models
from django.conf import settings


class WorkDay(models.Model):

    SHIFT_CHOICES = [
        ('day', '🌞 Day (06:00 - 18:00)'),
        ('night', '🌙 Night (18:00 - 06:00)'),
    ]

    STATUS_CHOICES = [
        ('planned', '📅 Planned'),
        ('done', '✅ Done'),
        ('cancelled_client', '❌ Cancelled by Client'),
        ('cancelled_contractor', '❌ Cancelled by Contractor'),
        ('cancelled_weather', '🌧️ Cancelled by Weather'),
    ]

    status = models.CharField(
    max_length=30,
    choices=STATUS_CHOICES,
    default='planned'
    )

    contract = models.ForeignKey(
        'Contract.Contract', 
        on_delete=models.CASCADE,
        related_name='workdays'
    )
    date = models.DateField()
    workers = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='workdays',
        blank=True
    )
    vehicles = models.ManyToManyField(  # ← اضافه شد
        'Vehicle.Vehicle',
        related_name='workdays',
        blank=True
    )
    engineer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='assigned_workdays'
    )
    note = models.TextField(blank=True)

    shift = models.CharField(
        max_length=10,
        choices=SHIFT_CHOICES,
        default='day'
    )

    cancel_reason = models.TextField(blank=True)

    def __str__(self):
        return f"{self.contract.IDContract} - {self.date}"

    class Meta:
        ordering = ['date']
        unique_together = ('contract', 'date')

class WorkDayWorkerNote(models.Model):
    workday = models.ForeignKey(
        WorkDay, 
        on_delete=models.CASCADE,
        related_name='worker_notes'
    )
    worker = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='workday_notes'
    )
    note = models.TextField(blank=True)

    class Meta:
        unique_together = ('workday', 'worker')

    def __str__(self):
        return f"{self.workday} - {self.worker.username}"
    
class WorkReport(models.Model):
    STATUS_CHOICES = [
        ('pending', '⏳ Pending'),
        ('approved', '✅ Approved'),
        ('rejected', '❌ Rejected'),
    ]

    workday = models.ForeignKey(
        WorkDay,
        on_delete=models.CASCADE,
        related_name='reports'
    )
    worker = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='work_reports'
    )
    text = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    engineer_note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.workday} - {self.worker.username}"


class WorkReportImage(models.Model):
    report = models.ForeignKey(
        WorkReport,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='reports/')
    caption = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.report}"