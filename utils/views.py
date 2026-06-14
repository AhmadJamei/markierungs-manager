# utils/views.py
from django.views.generic import ListView
from Customer.forms import CustomerForm
from django.shortcuts import redirect
from Customer.models import Customer

class FilterSortListView(ListView):

    model = Customer
    template_name = 'Customer/customer_list.html'

    filter_fields = []   # فیلدهایی که می‌خوای فیلتر بشن
    sort_fields = []     # فیلدهایی که می‌خوای سورت بشن
    default_sort = None

    def get_queryset(self):
        queryset = super().get_queryset()

        field = self.request.GET.get('field')
        value = self.request.GET.get('value')

        if field in self.filter_fields and value:
            queryset = queryset.filter(**{f"{field}__icontains": value})

        # sort هم همون قبلی
        sort = self.request.GET.get('sort')
        if sort in self.sort_fields:
            queryset = queryset.order_by(sort)

        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = CustomerForm()

        params = self.request.GET.copy()
        params.pop('page', None)

        context['query_params'] = params.urlencode()

        return context
    

    def post(self, request, *args, **kwargs):
        form = CustomerForm(request.POST)
        print("FORM IS VALID", form.errors)
        if form.is_valid():
            form.save()
            return redirect('customerView')

        self.object_list = self.get_queryset()

        context = self.get_context_data()
        context['form'] = form
        return self.get(request, *args, **kwargs)