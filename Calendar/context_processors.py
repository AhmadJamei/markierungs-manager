from .models import LeaveRequest

def pending_leaves(request):
    if request.user.is_authenticated and request.user.groups.filter(name='manager').exists():
        holiday_count = LeaveRequest.objects.filter(status='pending', leave_type='holiday').count()
        ill_count = LeaveRequest.objects.filter(status='pending', leave_type='ill').count()
        total_count = holiday_count + ill_count
        return {
            'pending_count': total_count,
            'pending_holiday_count': holiday_count,
            'pending_ill_count': ill_count,
        }
    return {
        'pending_count': 0,
        'pending_holiday_count': 0,
        'pending_ill_count': 0,
    }