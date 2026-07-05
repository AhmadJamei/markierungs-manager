from django import template

register = template.Library()

@register.filter
def percentage(value, max_value):
    try:
        pct = (value / max_value) * 100
        return min(pct, 100)
    except:
        return 0

@register.filter
def over_limit(value, max_value):
    try:
        return max(0, value - max_value)
    except:
        return 0
    
@register.filter
def is_above_percent(value, args):
    try:
        max_days, percent = args.split(',')
        threshold = (int(percent) / 100) * int(max_days)
        return value > threshold
    except:
        return False