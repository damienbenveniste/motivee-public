from django.db import models
from administration.models import Customer
from conversations.models import Conversation
from login.models import User
from scipy import stats
import numpy as np


class ConversationSurvey(models.Model):

    conversation = models.OneToOneField(
        Conversation,
        on_delete=models.CASCADE,
        null=False,
        related_name='survey',
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        default=None,
        related_name='surveys'
    )

    up_votes = models.IntegerField(default=0)
    down_votes = models.IntegerField(default=0)
    pvalue = models.FloatField(default=0)
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def get_pvalue(self):

        if self.up_votes + self.down_votes < 1:
            return 0

        test = stats.binomtest(
            self.up_votes,
            self.up_votes + self.down_votes,
            alternative='two-sided'
        )

        return (test.pvalue - 1) * np.sign(self.up_votes - self.down_votes)

    def save(self, *args, **kwargs):
        self.pvalue = self.get_pvalue()
        if self.pk is None:
            self.customer = self.conversation.customer
        self.up_votes = self.conversation_survey_votes.filter(value=1).count()
        self.down_votes = self.conversation_survey_votes.filter(value=-1).count()
        super().save(*args, **kwargs)
        self.conversation.save()
    
    class Meta:
        ordering = ['-time_created']

 
class ConversationSurveyVote(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=False,
        related_name='conversation_survey_votes',
    )

    survey = models.ForeignKey(
        ConversationSurvey,
        on_delete=models.CASCADE,
        null=False,
        related_name='conversation_survey_votes',
    )

    value = models.IntegerField(default=1, null=False, blank=False)

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        default=None,
    )
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.customer = self.survey.customer
        super().save(*args, **kwargs)
        self.survey.save()

    class Meta:
        ordering = ['-time_created']
        constraints = [
            models.UniqueConstraint(
                name='unique_user_survey_vote',
                fields=['user', 'survey']
            ),
        ]
