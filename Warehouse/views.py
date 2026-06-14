from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Q, Sum
from datetime import date
import json
from django.db import models
from .models import Material, StockTransaction
from Contract.models import Contract
from Settings.models import MaterialType


@login_required
def material_list(request):
    materials = Material.objects.all()

    search = request.GET.get('search', '').strip()
    if search:
        materials = materials.filter(
            Q(name__icontains=search) |
            Q(color__icontains=search)
        )

    type_ = request.GET.get('type', '').strip()
    if type_:
        materials = materials.filter(type=type_)

    context = {
        'materials': materials,
        'material_types': MaterialType.objects.filter(is_active=True),  # ← از Settings
        'selected_type': type_,
        'low_stock': materials.filter(stock_kg__lte=models.F('min_stock_kg')),
    }
    return render(request, 'Warehouse/material_list.html', context)

@login_required
def material_add(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        Material.objects.create(
            type=data.get('type'),
            name=data.get('name'),
            color=data.get('color', ''),
            stock_kg=data.get('stock_kg', 0),
            min_stock_kg=data.get('min_stock_kg', 0),
            description=data.get('description', '')
        )
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'}, status=400)


@login_required
def material_update(request, pk):
    material = get_object_or_404(Material, pk=pk)
    if request.method == 'POST':
        data = json.loads(request.body)
        material.type = data.get('type', material.type)
        material.name = data.get('name', material.name)
        material.color = data.get('color', material.color)
        material.min_stock_kg = data.get('min_stock_kg', material.min_stock_kg)
        material.description = data.get('description', material.description)
        material.save()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'}, status=400)


@login_required
def material_delete(request, pk):
    material = get_object_or_404(Material, pk=pk)
    if request.method == 'POST':
        material.delete()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'}, status=400)


@login_required
def transaction_add(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        material = get_object_or_404(Material, pk=data.get('material_id'))
        quantity = float(data.get('quantity_kg', 0))
        transaction_type = data.get('transaction_type')

        # آپدیت موجودی
        if transaction_type == 'in':
            material.stock_kg += quantity
        elif transaction_type in ['out']:
            if material.stock_kg < quantity:
                return JsonResponse({
                    'status': 'error',
                    'message': f'Not enough stock! Available: {material.stock_kg} kg'
                })
            material.stock_kg -= quantity
        elif transaction_type == 'return':
            material.stock_kg += quantity
        elif transaction_type == 'used':
            pass  # مصرف واقعی موجودی رو تغییر نمیده

        material.save()

        StockTransaction.objects.create(
            material=material,
            transaction_type=transaction_type,
            quantity_kg=quantity,
            contract_id=data.get('contract_id') or None,
            date=data.get('date', date.today()),
            note=data.get('note', ''),
            created_by=request.user
        )

        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'}, status=400)


@login_required
def transaction_list(request):
    transactions = StockTransaction.objects.select_related(
        'material', 'contract', 'created_by'
    ).all()

    # FILTER
    material_id = request.GET.get('material')
    contract_id = request.GET.get('contract')
    type_ = request.GET.get('type')
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')

    if material_id:
        transactions = transactions.filter(material_id=material_id)
    if contract_id:
        transactions = transactions.filter(contract_id=contract_id)
    if type_:
        transactions = transactions.filter(transaction_type=type_)
    if from_date:
        transactions = transactions.filter(date__gte=from_date)
    if to_date:
        transactions = transactions.filter(date__lte=to_date)

    context = {
        'transactions': transactions,
        'materials': Material.objects.all(),
        'contracts': Contract.objects.all(),
        'transaction_choices': StockTransaction.TRANSACTION_CHOICES,
        'selected_material': material_id or '',
        'selected_contract': contract_id or '',
        'selected_type': type_ or '',
        'from_date': from_date or '',
        'to_date': to_date or '',
    }
    return render(request, 'Warehouse/transaction_list.html', context)