# Generated by Django 3.2.13 on 2022-09-16 18:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('administration', '0013_auto_20220916_1727'),
    ]

    operations = [
        migrations.RenameField(
            model_name='pricingplan',
            old_name='price',
            new_name='monthly_price',
        ),
        migrations.AddField(
            model_name='pricingplan',
            name='yearly_price',
            field=models.IntegerField(default=0),
        ),
    ]
