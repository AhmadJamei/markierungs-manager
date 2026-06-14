from .models import CompanySettings

def company_settings(request):
    try:
        company = CompanySettings.objects.get(id=1)
    except CompanySettings.DoesNotExist:
        company = None
    return {'company': company}