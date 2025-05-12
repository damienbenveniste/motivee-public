from django.db import migrations

def fill_empty_customer(apps, schema_editor):
    Suggestion = apps.get_model('login', 'Suggestion')
    Customer = apps.get_model('administration', 'Customer')

    sandbox = Customer.objects.get(id=1)

    for suggestion in Suggestion.objects.all():
        if not suggestion.customer:
            suggestion.customer = sandbox
            suggestion.save(update_fields=['customer'])
           

class Migration(migrations.Migration):

    dependencies = [
        ('login', '0008_user_last_customer'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(fill_empty_customer,
                             reverse_code=migrations.RunPython.noop),
    ]