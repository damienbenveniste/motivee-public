from scheduling.compute.searchers import ClaimSearcher
from scheduling.compute.summarizing import Summarizer
from conversations.models import Conversation
from scheduling.models import Summary
from django.db.models import Q, F
import logging

LOGGER = logging.getLogger('watchtower')


class AnswersSummaryJob:

    PRO_TYPE = 'PRO'
    CON_TYPE = 'CON'
    ANS_TYPE = 'ANS'
    ID = 'answers-summary-job'

    def __init__(self) -> None:
        self.summarizer = Summarizer()

    def get_conversations(self):
        conversations = Conversation.objects.filter(open_ended=True)
        return conversations

    def write_all_summaries(self):
        conversations = self.get_conversations()
        for conversation in conversations:
            LOGGER.info(conversation.id)
            self.write_summary_for_conversation(conversation)

    def write_summary_for_conversation(self, conversation):

        if not conversation.open_ended:
            return

        best_answer_claims = conversation.claims.filter(
            parent__isnull=True,
            pvalue__lte=-0.9
        ).distinct().order_by('pvalue')

        if best_answer_claims.count() < 30:
            additional_answer_claims = conversation.claims.filter(
                parent__isnull=True
            ).order_by('pvalue')[:(30 - best_answer_claims.count())]
            best_answer_claims = best_answer_claims.union(additional_answer_claims)

        self.create_summary(best_answer_claims, conversation)

    def create_summary(self, claims, conversation):

        if not claims:
            return

        summary, created = Summary.objects.get_or_create(
            conversation=conversation,
            tag=None,
            type=self.ANS_TYPE,
            claim=None
        )

        text_array = [claim.text for claim in claims]

        if created or summary.last_updated < conversation.last_updated:
            summary.text = self.summarizer.summarize(text_array)
            summary.claims_number = len(text_array)
            summary.pct_pos_consensus = 100
            summary.pct_neg_consensus = 0
            summary.save(
                update_fields=[
                    'text',
                    'claims_number',
                    'pct_pos_consensus',
                    'pct_neg_consensus'
                ]
            )

    def run(self):
        try:
            self.write_all_summaries()
        except Exception as e:
            LOGGER.error(e)
            raise(e)
