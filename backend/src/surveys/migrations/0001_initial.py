# Generated by Django 3.2.13 on 2022-08-02 01:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('conversations', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ConversationSurvey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('up_votes', models.IntegerField(default=0)),
                ('down_votes', models.IntegerField(default=0)),
                ('pvalue', models.FloatField(default=0)),
                ('time_created', models.DateTimeField(auto_now_add=True)),
                ('conversation', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='survey', to='conversations.conversation')),
            ],
        ),
        migrations.CreateModel(
            name='ConversationSurveyVote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.IntegerField(default=1)),
                ('survey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conversation_survey_votes', to='surveys.conversationsurvey')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conversation_survey_votes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddConstraint(
            model_name='conversationsurveyvote',
            constraint=models.UniqueConstraint(fields=('user', 'survey'), name='unique_user_survey_vote'),
        ),
    ]
