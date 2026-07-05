from django import template
from datetime import date

register = template.Library()

@register.filter
def get_item(dictionary, key):
    if isinstance(dictionary, dict):
        return dictionary.get(key)
    return None

@register.filter
def active_leave(worker):
    """برگردوندن مرخصی فعال یا آینده نزدیک کارمند"""
    try:
        today = date.today()
        leave = worker.leaverequest_set.filter(
            status='approved',
            end_date__gte=today  # هنوز تموم نشده
        ).order_by('start_date').first()
        return leave
    except:
        return None