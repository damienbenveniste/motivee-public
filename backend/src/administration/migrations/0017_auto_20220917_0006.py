# Generated by Django 3.2.13 on 2022-09-17 00:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('administration', '0016_migrate_plans'),
    ]

    operations = [
        migrations.RenameField(
            model_name='pricingplan',
            old_name='monthly_price',
            new_name='price',
        ),
        migrations.RemoveField(
            model_name='pricingplan',
            name='yearly_price',
        ),
    ]
