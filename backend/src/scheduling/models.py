from django.db import models
from conversations.models import Conversation, Claim, Tag
from administration.models import Customer


class Summary(models.Model):

    SummaryType = models.TextChoices('SummaryType', 'PRO CON ANS')

    text = models.TextField(default=None, blank=True, null=True)
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        null=False,
        related_name='summaries',
    )

    claim = models.ForeignKey(
        Claim,
        on_delete=models.CASCADE,
        null=True,
        related_name='summaries',
    )

    claims_number = models.IntegerField(
        default=0,
        null=False,
        blank=False
    )

    pct_pos_consensus = models.FloatField(
        default=1,
        null=False,
        blank=False
    )

    pct_neg_consensus = models.FloatField(
        default=1,
        null=False,
        blank=False
    )

    type = models.CharField(
        blank=False,
        null=False,
        default=SummaryType.PRO,
        choices=SummaryType.choices, max_length=3
    )

    tag = models.ForeignKey(
        Tag,
        on_delete=models.SET_NULL,
        null=True
    )
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        default=None,
        related_name='summaries'
    )

    last_updated = models.DateTimeField(auto_now_add=False, auto_now=True)
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def save(self, *args, **kwargs):
        if 'update_fields' in kwargs:
            kwargs['update_fields'] = list(
                set(list(kwargs['update_fields']) + ['last_updated']))
        if self.pk is None:
            self.customer = self.conversation.customer
        return super().save(*args, **kwargs)

    class Meta:
        ordering = ['-last_updated']
        constraints = [
            models.UniqueConstraint(
                name='unique_summary',
                fields=['conversation', 'claim', 'type', 'tag']
            ),
        ]
