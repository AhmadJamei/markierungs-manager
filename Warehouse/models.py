from django.db import models
from django.conf import settings


class Material(models.Model):

    TYPE_CHOICES = [
        ('cold_plastic', 'Kaltplastik'),
        ('hot_plastic', 'Heißplastik'),
        ('roll_plastic', 'Rollplastik'),
        ('paint', 'Farbe'),
        ('hardener', 'Härter'),
        ('pearl', 'Perlen'),
    ]

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    name = models.CharField(max_length=100)  # مثلاً "Farbe Weiß"
    color = models.CharField(max_length=50, blank=True)
    stock_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    min_stock_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.get_type_display()} - {self.name}"

    class Meta:
        ordering = ['type', 'name']


class StockTransaction(models.Model):

    TRANSACTION_CHOICES = [
        ('in', '📥 Eingang'),
        ('out', '📤 Ausgabe'),
        ('return', '↩️ Rückgabe'),
        ('used', '✅ Verbrauch'),
    ]

    material = models.ForeignKey(
        Material,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_CHOICES)
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    contract = models.ForeignKey(
        'Contract.Contract',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='stock_transactions'
    )
    date = models.DateField()
    note = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.material.name} - {self.quantity_kg}kg"

    class Meta:
        ordering = ['-date', '-created_at']