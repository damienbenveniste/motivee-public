from django.db import migrations

def fill_empty_customer(apps, schema_editor):
    Conversation = apps.get_model('conversations', 'Conversation')
    Claim = apps.get_model('conversations', 'Claim')
    Vote = apps.get_model('conversations', 'Vote')
    Customer = apps.get_model('administration', 'Customer')

    sandbox = Customer.objects.get(id=1)

    for conversation in Conversation.objects.all():
        if not conversation.customer:
            conversation.customer = sandbox
            conversation.save(update_fields=['customer'])

    for claim in Claim.objects.all():
        if not claim.customer:
            claim.customer = sandbox
            claim.save(update_fields=['customer'])
    
    for vote in Vote.objects.all():
        if not vote.customer:
            vote.customer = sandbox
            vote.save(update_fields=['customer'])
           

class Migration(migrations.Migration):

    dependencies = [
        ('conversations', '0012_auto_20220812_0414'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(fill_empty_customer,
                             reverse_code=migrations.RunPython.noop),
    ]