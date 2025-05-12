from django.db import migrations

def migrate_domains(apps, schema_editor):
    Customer = apps.get_model('administration', 'Customer')
    Invitee = apps.get_model('administration', 'Invitee')

    for customer in Customer.objects.all():
        for domain in customer.email_domains:
            Invitee(
                customer=customer,
                email_domain=domain
            ).save()
           

class Migration(migrations.Migration):

    dependencies = [
        ('administration', '0009_auto_20220909_0427'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(migrate_domains,
                             reverse_code=migrations.RunPython.noop),
    ]