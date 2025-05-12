from django.db import migrations, models

def fill_tpics(apps, schema_editor):
    Topic = apps.get_model('conversations', 'Topic')
    Tag = apps.get_model('conversations', 'Tag')
    Claim = apps.get_model('conversations', 'Claim')
    Conversation = apps.get_model('conversations', 'Conversation')
    for tag in Tag.objects.all():
        topic = Topic(
            name=tag.name,
            number_used=tag.number_used,
        )
        topic.save()
        topic.customers.set([customer for customer in tag.customers.all()])

    for conversation in Conversation.objects.all():
        topics = [
            Topic.objects.get(name=tag.name) 
            for tag in conversation.tags.all()
        ]
        conversation.save()
        conversation.topics.set(topics)

    for claim in Claim.objects.all():
        topics = [
            Topic.objects.get(name=tag.name) 
            for tag in claim.tags.all()
        ]
        claim.save()
        claim.topics.set(topics)


class Migration(migrations.Migration):

    dependencies = [
        ('conversations', '0007_auto_20220811_2336'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(
            fill_tpics,
            reverse_code=migrations.RunPython.noop),
    ]