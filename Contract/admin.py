from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Contract

@admin.register(Contract)
class ContractAdmin(ImportExportModelAdmin):
    pass

