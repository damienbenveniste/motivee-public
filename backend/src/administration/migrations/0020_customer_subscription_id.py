# Generated by Django 3.2.13 on 2022-09-20 19:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('administration', '0019_customer_stripe_customer_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='subscription_id',
            field=models.CharField(blank=True, max_length=120, null=True, unique=True),
        ),
    ]
