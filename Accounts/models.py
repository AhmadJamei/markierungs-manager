from django.db import models
from django.contrib.auth.models import  AbstractUser
from django.conf import settings
from datetime import date

class CustomUser(AbstractUser):
        photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)

class Employee(models.Model):
    
    STATUS_CHOICES = [
        ('active', '✅ Active'),
        ('vacation', '🏖️ Vacation'),
        ('sick', '🤒 Sick'),
        ('terminated', '❌ Terminated'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    photo = models.ImageField(upload_to='employees/', null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    date_of_employment = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    termination_date = models.DateField(null=True, blank=True)

    # گواهینامه‌ها
    license_B = models.BooleanField(default=False)
    license_BE = models.BooleanField(default=False)
    license_C = models.BooleanField(default=False)
    license_C1 = models.BooleanField(default=False)
    license_CE = models.BooleanField(default=False)
    license_liftruck = models.BooleanField(default=False)

    # تجربه کاری
    exp_autobahn = models.BooleanField(default=False)
    exp_airport = models.BooleanField(default=False)
    exp_city = models.BooleanField(default=False)

    # سایز لباس
    shoe_size = models.IntegerField(null=True, blank=True)
    tshirt_size = models.CharField(max_length=5, null=True, blank=True)
    pants_size = models.CharField(max_length=5, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ['last_name', 'first_name']


    @property
    def current_status(self):
        if self.user:
            today = date.today()
            active_leave = self.user.leaverequest_set.filter(
                status='approved',
                start_date__lte=today,
                end_date__gte=today
            ).first()
            
            if active_leave:
                if active_leave.leave_type == 'holiday':
                    return 'vacation'
                elif active_leave.leave_type == 'ill':
                    return 'sick'
        return 'active'
class ClothingIssue(models.Model):

    CLOTHING_CHOICES = [
        ('jacket', '🧥 Jacket'),
        ('pants', '👖 Pants'),
        ('shirt', '👕 T-Shirt'),
        ('vest_hi', '🦺 Hi-Vis Vest'),
        ('vest_safety', '🦺 Safety Vest'),
        ('shoes', '👟 Shoes'),
        ('helmet', '⛑️ Helmet'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='clothing_issues')
    date = models.DateField()
    clothing_type = models.CharField(max_length=20, choices=CLOTHING_CHOICES)
    quantity = models.IntegerField(default=1)
    note = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return f"{self.employee} - {self.get_clothing_type_display()} - {self.date}"

    class Meta:
        ordering = ['-date']