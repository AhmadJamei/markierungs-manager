from django.db import models
from Warehouse.models import Material

class Contract(models.Model):

    TYPE_CHOICES = [
        ('A', 'Autobahn'),
        ('F', 'Flughafen'),
        ('S', 'Stadt'),
    ]
    IDContract = models.CharField(max_length=7)
    Name = models.CharField(max_length=100)
    Customer = models.ForeignKey('Customer.Customer', on_delete=models.SET_NULL, null=True, blank=True)
    Type = models.CharField(max_length=1, choices=TYPE_CHOICES)
    Address = models.CharField(max_length=200)  
    DateCreated = models.DateField(null=True, blank=True)
    DateRun = models.DateField(null=True, blank=True)
    Price = models.DecimalField(max_digits=10, decimal_places=2)
    Description = models.TextField(blank=True)
    City = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return self.IDContract
    
    class Meta:
        ordering = ['IDContract']


class ContractMaterial(models.Model):

    STENCIL_CHOICES = [
        ('not_needed', '❌ Not Needed'),
        ('available', '✅ Available'),
        ('ordered', '📦 Ordered'),
    ]

    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='materials'
    )
    material = models.ForeignKey(
        Material,
        on_delete=models.CASCADE,
        related_name='contract_materials'
    )
    required_kg = models.DecimalField(max_digits=10, decimal_places=2)
    stencil = models.CharField(
        max_length=20,
        choices=STENCIL_CHOICES,
        default='not_needed'
    )
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.contract.IDContract} - {self.material.name}"

    class Meta:
        unique_together = ('contract', 'material')