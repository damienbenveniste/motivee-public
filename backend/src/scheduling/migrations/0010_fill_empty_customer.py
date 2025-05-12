from django.db import migrations

def fill_empty_customer(apps, schema_editor):
    Summary = apps.get_model('scheduling', 'Summary')
    Customer = apps.get_model('administration', 'Customer')

    sandbox = Customer.objects.get(id=1)

    for summary in Summary.objects.all():
        if not summary.customer:
            summary.customer = sandbox
            summary.save(update_fields=['customer'])
           

class Migration(migrations.Migration):

    dependencies = [
        ('scheduling', '0009_auto_20220902_1758'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(fill_empty_customer,
                             reverse_code=migrations.RunPython.noop),
    ]