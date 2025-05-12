from django.db import migrations

def fill_empty_customer(apps, schema_editor):
    ConversationSurvey = apps.get_model('surveys', 'ConversationSurvey')
    ConversationSurveyVote = apps.get_model('surveys', 'ConversationSurveyVote')
    Customer = apps.get_model('administration', 'Customer')

    sandbox = Customer.objects.get(id=1)

    for survey in ConversationSurvey.objects.all():
        if not survey.customer:
            survey.customer = sandbox
            survey.save(update_fields=['customer'])

    for vote in ConversationSurveyVote.objects.all():
        if not vote.customer:
            vote.customer = sandbox
            vote.save(update_fields=['customer'])
           

class Migration(migrations.Migration):

    dependencies = [
        ('surveys', '0004_auto_20220902_1758'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(fill_empty_customer,
                             reverse_code=migrations.RunPython.noop),
    ]