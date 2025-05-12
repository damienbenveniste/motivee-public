from scheduling.compute.searchers import ClaimSearcher
from scheduling.compute.summarizing import Summarizer
from conversations.models import Conversation
from scheduling.models import Summary
from django.db.models import Q, F
import logging

LOGGER = logging.getLogger('watchtower')


class ClaimSummaryJob:

    PRO_TYPE = 'PRO'
    CON_TYPE = 'CON'
    ID = 'claims-summary-job'

    def __init__(self) -> None:
        self.summarizer = Summarizer()

    def get_conversations(self):
        conversations = Conversation.objects.all()
        return conversations

    def write_all_summaries(self):
        conversations = self.get_conversations()
        for conversation in conversations:
            LOGGER.info(conversation.id)
            self.write_summaries_for_conversation(conversation)

    def write_summaries_for_conversation(self, conversation):

        if conversation.open_ended:
            answer_claims = conversation.claims.filter(parent__isnull=True)
            top_claims = answer_claims[:10]
            bottom_claims = answer_claims.filter(pvalue__lte=-0.9)
            answer_claims = (
                top_claims | bottom_claims).distinct().order_by('pvalue')
            for claim in answer_claims:
                searcher = ClaimSearcher(conversation)
                pros_cons_dict = searcher.get_pros_cons(claim)
                self.write_summaries_with_dict(
                    pros_cons_dict, 
                    conversation, 
                    claim
                )

        else:
            searcher = ClaimSearcher(conversation)
            pros_cons_dict = searcher.get_pros_cons()
            self.write_summaries_with_dict(pros_cons_dict, conversation, None)

    def get_pct_pos_consensus(self, array):
        sub_array = [t for t in array if t[1] <= -0.9]
        return len(sub_array) / len(array) * 100

    def get_pct_neg_consensus(self, array):
        sub_array = [t for t in array if t[1] >= 0.9]
        return len(sub_array) / len(array) * 100

    def write_summaries_with_dict(self, pros_cons_dict, conversation, claim):

        for tag, dictionary in pros_cons_dict.items():
            pro_text_array = dictionary['pros']
            con_text_array = dictionary['cons']

            if pro_text_array:
                summary, created = Summary.objects.get_or_create(
                    conversation=conversation,
                    tag=tag,
                    type=self.PRO_TYPE,
                    claim=claim
                )

                if created or summary.last_updated < conversation.last_updated:
                    summary.text = self.summarizer.summarize(
                        [t[0] for t in pro_text_array])
                    summary.claims_number = len(pro_text_array)
                    summary.pct_pos_consensus = self.get_pct_pos_consensus(
                        pro_text_array)
                    summary.pct_neg_consensus = self.get_pct_neg_consensus(
                        pro_text_array)
                    summary.save(
                        update_fields=[
                            'text',
                            'claims_number',
                            'pct_pos_consensus',
                            'pct_neg_consensus'
                        ]
                    )

            if con_text_array:
                summary, created = Summary.objects.get_or_create(
                    conversation=conversation,
                    tag=tag,
                    type=self.CON_TYPE,
                    claim=claim
                )

                if created or summary.last_updated < conversation.last_updated:
                    summary.text = self.summarizer.summarize(
                        [t[0] for t in con_text_array])
                    summary.claims_number = len(con_text_array)
                    summary.pct_pos_consensus = self.get_pct_pos_consensus(
                        con_text_array)
                    summary.pct_neg_consensus = self.get_pct_neg_consensus(
                        con_text_array)
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
