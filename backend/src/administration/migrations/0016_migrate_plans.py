from django.db import migrations

def migrate_plans(apps, schema_editor):
    Customer = apps.get_model('administration', 'Customer')
    PricingPlan = apps.get_model('administration', 'PricingPlan')

    basic_plan, _ = PricingPlan.objects.get_or_create(name='basic')
    team_plan, created = PricingPlan.objects.get_or_create(name='team')

    if created:
        team_plan.monthly_price = 800
        team_plan.yearly_price = 600
        team_plan.save()

    for customer in Customer.objects.all():
        customer.plan = basic_plan
        customer.save(update_fields=['plan'])
       

class Migration(migrations.Migration):

    dependencies = [
        ('administration', '0015_pricingplan_name'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(migrate_plans,
                             reverse_code=migrations.RunPython.noop),
    ]