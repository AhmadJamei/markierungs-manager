from django import forms
from .models import Vehicle
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()


class VehicleForm(forms.ModelForm):
    class Meta:
        model = Vehicle
        fields = '__all__'
        widgets = {
            'purchase_date': forms.DateInput(attrs={'type': 'date'}),
            'insurance_expiry': forms.DateInput(attrs={'type': 'date'}),
            'technical_expiry': forms.DateInput(attrs={'type': 'date'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'
        self.fields['responsible'].queryset = User.objects.all()
        self.fields['responsible'].empty_label = '--- Kein Fahrer ---'
