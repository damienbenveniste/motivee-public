from django.db import migrations

def migrate_plans(apps, schema_editor):
    PricingPlan = apps.get_model('administration', 'PricingPlan')
    team_plan = PricingPlan.objects.get(name='team')
    team_plan.name = 'team_monthly'
    team_plan.price = 800
    team_plan.save()

    team_plan, _ = PricingPlan.objects.get_or_create(name='team_yearly')
    team_plan.price = 600
    team_plan.save()


class Migration(migrations.Migration):

    dependencies = [
        ('administration', '0017_auto_20220917_0006'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(migrate_plans,
                             reverse_code=migrations.RunPython.noop),
    ]