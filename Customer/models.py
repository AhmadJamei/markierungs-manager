from django.db import models

class Customer(models.Model):
    IDCustomer = models.CharField(max_length=6)
    IDKredit = models.CharField(max_length=10, blank=True)
    Name = models.CharField(max_length=100, blank=True)
    City = models.CharField(max_length=100, blank=True)
    PostCode = models.CharField(max_length=20, blank=True)
    MobileNumber1 = models.CharField(max_length=20, blank=True)
    
    def __str__(self):
        return self.IDCustomer
    
    class Meta:
        ordering = ['IDCustomer']