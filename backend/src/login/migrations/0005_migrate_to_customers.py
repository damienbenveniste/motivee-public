from django.db import migrations

def migrate_to_customers(apps, schema_editor):
    User = apps.get_model('login', 'User')
    Customer = apps.get_model('administration', 'Customer')

    for user in User.objects.all():
        customer = user.customer
        if customer:
            user.customers.add(customer)
        else:
            sandbox = Customer.objects.get(id=1)
            user.customers.add(sandbox)
            

class Migration(migrations.Migration):

    dependencies = [
        ('login', '0004_user_customers'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(migrate_to_customers,
                             reverse_code=migrations.RunPython.noop),
    ]