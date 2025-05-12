from django.db import migrations, models

def fill_topics(apps, schema_editor):
    Topic = apps.get_model('conversations', 'Topic')
    Summary = apps.get_model('scheduling', 'Summary')

    for summary in Summary.objects.all():
        if summary.tag:
            topic = Topic.objects.get(name=summary.tag.name) 
            summary.topic = topic
            summary.save()


class Migration(migrations.Migration):

    dependencies = [
        ('scheduling', '0004_summary_topic'),
    ]

    operations = [
        # omit reverse_code=... if you don't want the migration to be reversible.
        migrations.RunPython(
            fill_topics,
            reverse_code=migrations.RunPython.noop),
    ]