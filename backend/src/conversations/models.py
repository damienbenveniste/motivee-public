from django.db import models
from login.models import User
from django.db.models import Q
from scipy import stats
import numpy as np
from administration.models import Customer


class Tag(models.Model):
    name = models.CharField(max_length=120)
    number_used = models.IntegerField(default=1)
    customers = models.ManyToManyField(
        Customer, 
        blank=True,
    )

    def save(self, *args, **kwargs):
        self.name = self.name.replace('/', '-').lower().strip()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ('-number_used', 'name')


class Conversation(models.Model):

    title = models.CharField(max_length=120)
    question = models.TextField()
    open_ended = models.BooleanField(default=False)
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    claim_number = models.IntegerField(default=0, null=False, blank=False)
    votes = models.IntegerField(default=0, null=False, blank=False)
    participant_number = models.IntegerField(
        default=0, null=False, blank=False)
    tags = models.ManyToManyField(Tag, blank=True)
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        default=None,
        related_name='conversations'
    )
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)
    last_updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def save(self, *args, **kwargs):

        if 'update_fields' in kwargs:
            kwargs['update_fields'] = list(
                set(list(kwargs['update_fields']) + ['last_updated']))

        if hasattr(self, 'survey'):
            self.participant_number = self.claims.values_list('author', flat=True).union(
                self.claims.values_list('votes__user', flat=True)
            ).union(
                self.survey.conversation_survey_votes.values_list('user', flat=True)
            ).count()
        else:
            self.participant_number = self.claims.values_list('author', flat=True).union(
                self.claims.values_list('votes__user', flat=True)
            ).count()   

        self.claim_number = self.claims.count()
        if self.pk is None:
            self.customer = self.author.last_customer
        super().save(*args, **kwargs)


    class Meta:
        ordering = ('-time_created',)


class Claim(models.Model):

    ClaimType = models.TextChoices('ClaimType', 'ANS PRO CON')

    text = models.TextField()
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        null=False,
        related_name='claims',
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        default=None,
        related_name='children',
    )
    root_claim = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        default=None,
        related_name='descendants',
    )
    type = models.CharField(
        blank=False,
        null=False,
        default=ClaimType.ANS,
        choices=ClaimType.choices, max_length=3
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name='claim_tags',
    )
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        default=None,
        related_name='claims'
    )
    open_ended = models.BooleanField(default=False)
    top_relation = models.IntegerField(default=0, null=False, blank=False)
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

    def get_root_claim(self):
        if not self.conversation.open_ended:
            return None

        if self.parent is None:
            return None

        if self.parent.root_claim is None:
            return self.parent

        return self.parent.root_claim

    def get_top_relation(self):
        if self.parent is None:
            if self.type == 'ANS':
                return 0
            if self.type == 'CON':
                return -1
            if self.type == 'PRO':
                return 1
        elif self.conversation.open_ended:
            if self.parent == self.root_claim:
                if self.type == 'CON':
                    return -1
                if self.type == 'PRO':
                    return 1
            else:
                if self.type == 'CON':
                    return -self.parent.top_relation
                if self.type == 'PRO':
                    return self.parent.top_relation
        else:
            if self.type == 'CON':
                return -self.parent.top_relation
            if self.type == 'PRO':
                return self.parent.top_relation

    def check_tags(self):
        for tag in self.tags.all():
            if not self.conversation.tags.filter(pk=tag.pk).exists():
                self.conversation.tags.add(tag)

    def save(self, *args, **kwargs):
        if 'update_fields' in kwargs:
            kwargs['update_fields'] = list(
                set(list(kwargs['update_fields']) + ['conversation']))

        self.pvalue = self.get_pvalue()
        self.root_claim = self.get_root_claim()
        self.top_relation = self.get_top_relation()
        self.open_ended = self.conversation.open_ended
        self.up_votes = self.votes.filter(value=1).count()
        self.down_votes = self.votes.filter(value=-1).count()
        if self.pk is None:
            self.customer = self.conversation.customer
        super().save(*args, **kwargs)
        self.check_tags()
        self.conversation.save()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.conversation.save()

    class Meta:
        ordering = ('pvalue', '-time_created',)
        constraints = [
            models.CheckConstraint(
                check=(
                    Q(
                        open_ended=True,
                        parent__isnull=True,
                        type='ANS',
                        top_relation=0,
                        root_claim__isnull=True
                    ) | Q(
                        open_ended=True,
                        parent__isnull=False,
                        type__in=['CON', 'PRO'],
                        top_relation__in=[-1, 1],
                        root_claim__isnull=False
                    ) | Q(
                        open_ended=False,
                        parent__isnull=False,
                        type__in=['CON', 'PRO'],
                        top_relation__in=[-1, 1],
                        root_claim__isnull=True
                    ) | Q(
                        open_ended=False,
                        parent__isnull=True,
                        type='PRO',
                        top_relation=1,
                        root_claim__isnull=True
                    ) | Q(
                        open_ended=False,
                        parent__isnull=True,
                        type='CON',
                        top_relation=-1,
                        root_claim__isnull=True
                    )
                ),
                name='check_claim_constraints',
            )
        ]


class Vote(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=False,
        related_name='votes',
    )

    claim = models.ForeignKey(
        Claim,
        on_delete=models.CASCADE,
        null=False,
        related_name='votes',
    )

    value = models.IntegerField(default=1, null=False, blank=False)
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        default=None,
        related_name='votes'
    )

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.claim.save()

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.customer = self.claim.customer
        super().save(*args, **kwargs)
        self.claim.save()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                name='unique_user_vote',
                fields=['user', 'claim']
            ),
        ]
