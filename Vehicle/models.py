from django.db import models
from django.conf import settings

class Vehicle(models.Model):

    class ModelChoices(models.IntegerChoices):
        FORD = 1, "Ford"
        SKODA = 2, "Skoda"
        VOLKSWAGEN = 3, "Volkswagen"
        MAN = 4, "Man"
        IVECO = 5, "Iveco"
        MERCEDES_BENZ = 6, "Mercedes Benz"
        HENNE_RICHARD = 7, "Henne Richard"
        WINTER = 8, "Winter"
        PARTENHEIMER = 9, "Partenheimer"
        OBERMAIER = 10, "Obermaier"
        TREBBINER = 11, "Trebbiner"
        TAXO_TRAILER = 12, "T-AX-O Trailer"
        HUMBAUR = 13, "Humbaur"
        ZEPPELIN = 14, "Zeppelin"
        WM_MEYER = 15, "WM Meyer"
        HYUNDAI = 18, "Hyundai"

    class KindChoices(models.IntegerChoices):
        KEHRMASCHINE = 1, "Kehrmaschine"
        LKW_OFFENER_KASTEN = 2, "LKW Offener Kasten"
        SPRINTER = 3, "Sprinter"
        LKW_THERMOKOCHER = 4, "LKW Thermo Kocher"
        MARKIERUNGSMASCHINE = 9, "Markierungsmaschine"
        TRANSIT = 15, "Transit"
        CRAFTER = 16, "Crafter"
        VITO = 17, "Vito"

    class FuelChoices(models.IntegerChoices):
        GASOLINE = 1, "Benzin"
        DIESEL = 2, "Dieselöl"
        ELECTRIC = 3, "E-Auto"
        HYBRID = 4, "Hybrid"

    RegisterNumber = models.CharField(
        max_length=11,
        verbose_name="Kennzeichen",
        primary_key=True
    )
    Model = models.IntegerField(
        choices=ModelChoices.choices,
        default=ModelChoices.FORD
    )
    Kind = models.IntegerField(
        choices=KindChoices.choices,
        null=True, blank=True
    )
    Fuel = models.IntegerField(
        choices=FuelChoices.choices,
        null=True, blank=True
    )
    Image = models.ImageField(
        upload_to='vehicles/',
        null=True, blank=True
    )
    purchase_date = models.DateField(null=True, blank=True, verbose_name='Kaufdatum')
    mileage = models.IntegerField(null=True, blank=True, verbose_name='Kilometerstand')
    responsible = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        verbose_name='Verantwortlicher'
    )
    insurance_expiry = models.DateField(null=True, blank=True, verbose_name='Versicherung läuft ab')
    technical_expiry = models.DateField(null=True, blank=True, verbose_name='HU/TÜV läuft ab')
    Description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.RegisterNumber} - {self.get_Model_display()}"

    class Meta:
        ordering = ['RegisterNumber']