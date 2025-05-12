
from conversations.models import Conversation
from django.db.models import Q, F, Aggregate, FloatField
from collections import deque
import re
from scipy import stats


class Percentile(Aggregate):
    function = "PERCENTILE_CONT"
    name = "percentile"
    output_field = FloatField()
    template = "%(function)s (%(percentile)s) WITHIN GROUP (ORDER BY %(expressions)s)"


class ClaimSearcher:

    PERCENTILE = 0.7
    OVERALL = '__overall__'

    def __init__(self, conversation: Conversation):
        self.conversation = conversation

    def _clean_links(self, text):

        INLINE_LINK_RE = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
        links = list(INLINE_LINK_RE.findall(text))
        clean_text = text

        for (t, link) in links:
            clean_text = clean_text.replace('({})'.format(link), '')
            clean_text = clean_text.replace('[{}]'.format(t), t)
        
        return clean_text

    def filter_claims(self, claims, tag=None):
        if tag:
            claims = claims.filter(tags=tag)
        slice_num = max(10, int(claims.count() * 0.3))
        top_claims =  claims[:slice_num]
        bottom_claims = claims.filter(pvalue__lte=-0.9)
        return (top_claims | bottom_claims).distinct().order_by('pvalue')

    def get_claim_dict(self, claim=None):

        if claim and self.conversation.open_ended:
            claims = claim.descendants
        elif self.conversation and not self.conversation.open_ended:
            claims = self.conversation.claims
        else:
            raise Exception('Conversation or Claim need to be non null')

        claim_dict = {}
        claim_dict[None] = self.filter_claims(claims.all())
        for tag in self.conversation.tags.all():
            claim_dict[tag] = self.filter_claims(claims, tag)

        return claim_dict

    def filter_by_pvalue(self, claim, claim_dict, tag=None):
        return claim in claim_dict[tag]

    def get_pros_cons(self, claim=None):

        if self.conversation and not self.conversation.open_ended:
            root_claims = self.conversation.claims.filter(parent__isnull=True)
        elif claim and self.conversation.open_ended:
            root_claims = claim.children.all()
        else:
            raise Exception('Conversation or Claim need to be non null')

        claim_dict = self.get_claim_dict(claim)
        tags_dict = {
            tag: {'pros': [], 'cons': []}
            for tag in self.conversation.tags.all()
        }
        tags_dict[None] = {'pros': [], 'cons': []}
        queue = deque([(c, 1) for c in root_claims])

        while queue:

            new_claim, relation = queue.popleft()

            text = new_claim.text
            claim_type = new_claim.type
            pro = 1 if claim_type == 'PRO' else -1
            tags = new_claim.tags
            pvalue = new_claim.pvalue

            for tag in tags.all():
                if relation * pro == 1 and self.filter_by_pvalue(new_claim, claim_dict, tag):
                    tags_dict[tag]['pros'].append((self._clean_links(text), pvalue))
                elif relation * pro == -1 and self.filter_by_pvalue(new_claim, claim_dict, tag):
                    tags_dict[tag]['cons'].append((self._clean_links(text), pvalue))

            if relation * pro == 1 and self.filter_by_pvalue(new_claim, claim_dict, None):
                tags_dict[None]['pros'].append((self._clean_links(text), pvalue))
            elif relation * pro == -1 and self.filter_by_pvalue(new_claim, claim_dict, None):
                tags_dict[None]['cons'].append((self._clean_links(text), pvalue))

            for child in new_claim.children.all():
                queue.append((child, relation * pro))

        return tags_dict
