from django.db import migrations

def migrate_admins(apps, schema_editor):
    Customer = apps.get_model('administration', 'Customer')
    Invitee = apps.get_model('administration', 'Invitee')

    for customer in Customer.objects.all():
        for admin in customer.admins:
            Invitee(
                customer=customer,
                email=admin,
                is_admin=True
            ).save()
           

class Migration(migrations.Migration):

    dependencies = [
        ('administration', '0005_auto_20220906_0322'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(migrate_admins,
                             reverse_code=migrations.RunPython.noop),
    ]