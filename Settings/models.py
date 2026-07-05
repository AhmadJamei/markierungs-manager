from django.db import models


class CompanySettings(models.Model):
    name = models.CharField(max_length=100, default='My Company')
    logo = models.ImageField(upload_to='company/', null=True, blank=True)
    primary_color = models.CharField(max_length=7, default='#0d6efd')
    secondary_color = models.CharField(max_length=7, default='#6c757d')
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    max_holiday_days = models.IntegerField(default=30)  
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Company Settings'


class MaterialType(models.Model):
    CATEGORY_CHOICES = [
        ('cold_plastic', 'Kaltplastik'),
        ('hot_plastic', 'Heißplastik'),
        ('roll_plastic', 'Rollplastik'),
        ('paint', 'Farbe'),
        ('hardener', 'Härter'),
        ('pearl', 'Perlen'),
    ]
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.get_category_display()} - {self.name}"

    class Meta:
        ordering = ['category', 'name']


class ContractType(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=5)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']