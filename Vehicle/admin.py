from django.contrib import admin
from .models import Vehicle

class VehicleAdmin(admin.ModelAdmin):
    list_display = ['RegisterNumber', 'get_Model_display', 'get_Kind_display']
    search_fields = ['RegisterNumber']

admin.site.register(Vehicle, VehicleAdmin)