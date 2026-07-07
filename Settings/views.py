from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import CompanySettings, MaterialType, ContractType
import json

@login_required
def settings_view(request):
    # گرفتن یا ساختن CompanySettings
    company, created = CompanySettings.objects.get_or_create(id=1)
    
    context = {
        'company': company,
        'material_types': MaterialType.objects.all(),
        'contract_types': ContractType.objects.all(),
        'category_choices': MaterialType.CATEGORY_CHOICES,
    }
    return render(request, 'Settings/settings.html', context)

@login_required
def company_update(request):
    if not request.user.groups.filter(name='manager').exists():
        return JsonResponse({'status': 'error', 'message': 'No permission'}, status=403)
    
    company = CompanySettings.objects.get_or_create(id=1)[0]
    
    if request.method == 'POST':
        if request.content_type and 'multipart' in request.content_type:
            data = request.POST
            company.name = data.get('name', company.name)
            company.primary_color = data.get('primary_color', company.primary_color)
            company.secondary_color = data.get('secondary_color', company.secondary_color)
            company.address = data.get('address', company.address)
            company.phone = data.get('phone', company.phone)
            company.email = data.get('email', company.email)
            company.website = data.get('website', company.website)
            print("DATA:", dict(data))  # ← اینجا
            print("MAX DAYS VALUE:", data.get('max_holiday_days'))  # ← اینجا
            company.max_holiday_days = int(data.get('max_holiday_days', company.max_holiday_days))
            print("MAX DAYS:", company.max_holiday_days)  # ← اینجا
            
            company.max_holiday_days = int(data.get('max_holiday_days', company.max_holiday_days))
            if 'logo' in request.FILES:
                company.logo = request.FILES['logo']
        else:
            data = json.loads(request.body)
            company.name = data.get('name', company.name)
            company.primary_color = data.get('primary_color', company.primary_color)
            company.secondary_color = data.get('secondary_color', company.secondary_color)
            company.address = data.get('address', company.address)
            company.phone = data.get('phone', company.phone)
            company.email = data.get('email', company.email)
            company.website = data.get('website', company.website)
            company.max_holiday_days = int(data.get('max_holiday_days', company.max_holiday_days))
        print("MAX DAYS:", company.max_holiday_days)  # ← اضافه کن

        company.save()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'}, status=400)

@login_required
def material_type_add(request):
    if not request.user.groups.filter(name='manager').exists():
        return JsonResponse({'status': 'error'}, status=403)
    
    if request.method == 'POST':
        data = json.loads(request.body)
        MaterialType.objects.create(
            category=data.get('category'),
            name=data.get('name'),
            color=data.get('color', ''),
        )
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'}, status=400)

@login_required
def material_type_delete(request, pk):
    if not request.user.groups.filter(name='manager').exists():
        return JsonResponse({'status': 'error'}, status=403)
    
    material_type = get_object_or_404(MaterialType, pk=pk)
    if request.method == 'POST':
        material_type.delete()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'}, status=400)

@login_required
def contract_type_add(request):
    if not request.user.groups.filter(name='manager').exists():
        return JsonResponse({'status': 'error'}, status=403)
    
    if request.method == 'POST':
        data = json.loads(request.body)
        ContractType.objects.create(
            name=data.get('name'),
            code=data.get('code'),
        )
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'}, status=400)

@login_required
def contract_type_delete(request, pk):
    if not request.user.groups.filter(name='manager').exists():
        return JsonResponse({'status': 'error'}, status=403)
    
    contract_type = get_object_or_404(ContractType, pk=pk)
    if request.method == 'POST':
        contract_type.delete()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'}, status=400)