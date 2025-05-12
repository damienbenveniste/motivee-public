from django.db import migrations


def create_past_conversation_surveys(apps, schema_editor):
    Conversation = apps.get_model('conversations', 'Conversation')
    ConversationSurvey = apps.get_model('surveys', 'ConversationSurvey')
    for conversation in Conversation.objects.all():
        if not conversation.open_ended and \
                not ConversationSurvey.objects.filter(conversation=conversation).exists():
            survey = ConversationSurvey(conversation=conversation)
            survey.save()


class Migration(migrations.Migration):

    dependencies = [
        ('surveys', '0002_auto_20220802_0340'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(create_past_conversation_surveys,
                             reverse_code=migrations.RunPython.noop),
    ]