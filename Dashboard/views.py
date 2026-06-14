from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Sum, Count
from Customer.models import Customer
from Contract.models import Contract
from Vehicle.models import Vehicle
from Vehicle.views import get_expiry_alerts


@login_required
def dashboard(request):
    user = request.user
    is_manager = user.groups.filter(name='manager').exists()

    if not is_manager:
        return render(request, 'Dashboard/no_access.html')

    # آمار کلی
    total_customers = Customer.objects.count()
    total_contracts = Contract.objects.count()
    total_price = Contract.objects.aggregate(Sum('Price'))['Price__sum'] or 0
    total_vehicles = Vehicle.objects.count()

    # قراردادها به تفکیک Type (تعداد)
    contracts_by_type = Contract.objects.values('Type').annotate(count=Count('id'))
    type_data = []
    for item in contracts_by_type:
        type_data.append({
            'type': dict(Contract.TYPE_CHOICES).get(item['Type'], item['Type']),
            'count': item['count']
        })

    # قراردادها به تفکیک Type (قیمت)
    price_by_type = Contract.objects.values('Type').annotate(total=Sum('Price'))
    price_type_data = []
    for item in price_by_type:
        price_type_data.append({
            'type': dict(Contract.TYPE_CHOICES).get(item['Type'], item['Type']),
            'total': float(item['total'] or 0)
        })

    # برترین 5 مشتری بر اساس مجموع قیمت قراردادها
    top_customers = (
        Contract.objects.values('Customer__Name')
        .annotate(total=Sum('Price'), count=Count('id'))
        .order_by('-total')[:5]
    )
    top_customer_data = []
    for item in top_customers:
        top_customer_data.append({
            'name': item['Customer__Name'] or 'Unknown',
            'total': float(item['total'] or 0),
            'count': item['count']
        })

    # ماشین‌ها به تفکیک مدل
    vehicles_by_model = Vehicle.objects.values('Model').annotate(count=Count('RegisterNumber'))
    vehicle_model_data = []
    for item in vehicles_by_model:
        vehicle_model_data.append({
            'model': dict(Vehicle.ModelChoices.choices).get(item['Model'], item['Model']),
            'count': item['count']
        })

    # آخرین 5 قرارداد
    latest_contracts = Contract.objects.order_by('-id')[:5]

    # alert های سررسید ماشین‌ها
    vehicle_alerts = get_expiry_alerts()

    context = {
        'total_customers': total_customers,
        'total_contracts': total_contracts,
        'total_price': total_price,
        'total_vehicles': total_vehicles,
        'type_data': type_data,
        'price_type_data': price_type_data,
        'top_customer_data': top_customer_data,
        'vehicle_model_data': vehicle_model_data,
        'latest_contracts': latest_contracts,
        'vehicle_alerts': vehicle_alerts,
    }
    return render(request, 'Dashboard/dashboard.html', context)
