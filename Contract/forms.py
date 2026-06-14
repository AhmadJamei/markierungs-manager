from django.forms import ModelForm
from .models import Contract

class ContractForm(ModelForm):
    class Meta:
        model = Contract
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'
        