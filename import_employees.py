import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

import openpyxl
from Accounts.models import Employee

wb = openpyxl.load_workbook('personnel.xlsx')
ws = wb.active

count = 0
for row in ws.iter_rows(min_row=2, values_only=True):
    first_name   = row[1] or ''
    last_name    = row[2] or ''
    shoe_size    = row[7] if row[7] else None
    tshirt_size  = str(row[11]) if row[11] else None
    pants_size   = str(row[8]) if row[8] else None
    license_B    = bool(row[15])
    license_BE   = bool(row[16])
    license_C    = bool(row[17])
    license_C1   = bool(row[18])
    license_CE   = bool(row[20])
    license_liftruck = bool(row[21])
    exp_autobahn = bool(row[36])
    exp_airport  = bool(row[35])
    exp_city     = bool(row[34])
    date_employment = row[29] if row[29] else None
    termination_date = row[37] if row[37] else None
    email        = row[41] or None
    phone        = row[42] or None

    emp = Employee(
        first_name=first_name,
        last_name=last_name,
        shoe_size=shoe_size,
        tshirt_size=tshirt_size,
        pants_size=pants_size,
        license_B=license_B,
        license_BE=license_BE,
        license_C=license_C,
        license_C1=license_C1,
        license_CE=license_CE,
        license_liftruck=license_liftruck,
        exp_autobahn=exp_autobahn,
        exp_airport=exp_airport,
        exp_city=exp_city,
        date_of_employment=date_employment,
        termination_date=termination_date,
        status='terminated' if termination_date else 'active',
        email=email,
        phone=phone,
    )
    emp.save()
    count += 1
    print(f"✅ {first_name} {last_name}")

print(f"\nتموم شد! {count} نفر وارد شدند.")