from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import CustomUser, Employee, ClothingIssue

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['email', 'username', 'is_staff']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'photo')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['last_name', 'first_name', 'status', 'phone', 'date_of_employment']
    list_filter = ['status', 'license_B', 'license_C', 'license_CE', 'license_liftruck']
    search_fields = ['first_name', 'last_name', 'phone', 'email']

@admin.register(ClothingIssue)
class ClothingIssueAdmin(admin.ModelAdmin):
    list_display = ['employee', 'clothing_type', 'date', 'quantity']
    list_filter = ['clothing_type']