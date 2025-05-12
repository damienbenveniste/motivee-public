from django.db import migrations, models

def fill_tpics(apps, schema_editor):
    Topic = apps.get_model('conversations', 'Topic')
    Tag = apps.get_model('conversations', 'Tag')
    Claim = apps.get_model('conversations', 'Claim')
    Conversation = apps.get_model('conversations', 'Conversation')
    Summary = apps.get_model('scheduling', 'Summary')
    for topic in Topic.objects.all():
        tag = Tag(
            name=topic.name,
            number_used=topic.number_used,
        )
        tag.save()
        tag.customers.set([customer for customer in topic.customers.all()])

    for conversation in Conversation.objects.all():
        tags = [
            Tag.objects.get(name=topic.name) 
            for topic in conversation.topics.all()
        ]
        conversation.save()
        conversation.tags.set(tags)

    for claim in Claim.objects.all():
        tags = [
            Tag.objects.get(name=topic.name) 
            for topic in claim.topics.all()
        ]
        claim.save()
        claim.tags.set(tags)

    for summary in Summary.objects.all():
        if summary.topic:
            tag = Tag.objects.get(name=summary.topic.name) 
            summary.tag = tag
            summary.save()


class Migration(migrations.Migration):

    dependencies = [
        ('conversations', '0010_auto_20220812_0352'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(
            fill_tpics,
            reverse_code=migrations.RunPython.noop),
    ]