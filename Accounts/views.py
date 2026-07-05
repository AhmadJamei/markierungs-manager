from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm
from .models import Employee

class SignUpView(CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'registration/signup.html'

@login_required
def employee_list(request):
    status_filter = request.GET.get('status', '')
    employees = Employee.objects.all()
    
    if status_filter:
        employees = employees.filter(status=status_filter)

    return render(request, 'Accounts/employee_list.html', {
        'employees': employees,
        'status_filter': status_filter,
    })

@login_required
def employee_detail(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    clothing_issues = employee.clothing_issues.all()
    
    return render(request, 'Accounts/employee_detail.html', {
        'employee': employee,
        'clothing_issues': clothing_issues,
    })