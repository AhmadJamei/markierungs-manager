from django.urls import reverse_lazy
from django.views.generic import CreateView
from .forms import CustomUserCreationForm

class SignUpView(CreateView):
    #برای ساختن ویو از این فرم استفاده می شود
    form_class = CustomUserCreationForm
    #زمانیکه همه چیز اوکی شد و یوزر ثبت نام کرد به این آدرس هدایت می شود(login)
    #کاری که reverse_lazy برو تو اسم urlها بگرد ولاگین را پیدا کن  آدرسش رو بده
    success_url = reverse_lazy('login')

    template_name = 'registration/signup.html'
