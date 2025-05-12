from django.db import migrations

def migrate_to_categories(apps, schema_editor):
    User = apps.get_model('login', 'User')
    UserCategories = apps.get_model('login', 'UserCategories')
    Customer = apps.get_model('administration', 'Customer')

    for user in User.objects.all():
        customer = user.customer
        categories = user.categories
        if customer and categories:
            user_categories = UserCategories(
                user=user,
                customer=customer,
                categories=categories
            )
            user_categories.save()
        elif categories:
            user_categories = UserCategories(
                user=user,
                customer=Customer.objects.get(id=1),
                categories=categories
            )
            user_categories.save()
           

class Migration(migrations.Migration):

    dependencies = [
        ('login', '0006_auto_20220902_1758'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(migrate_to_categories,
                             reverse_code=migrations.RunPython.noop),
    ]