import requests
import numpy as np
import pandas as pd
import json


VOTE_URL = 'https://www.kialo.com/api/v1/discussions/{discussion_id}/perspectives/1/votes?filter=all'
GRAPH_URL = 'https://www.kialo.com/api/v1/discussiongraph?discussionId={discussion_id}'
META_URL = 'https://www.kialo.com/api/v1/discussions/{discussion_id}'
STATS_URL = 'https://www.kialo.com/api/v1/discussions/{discussion_id}/statistics'


class DataProcessor:

    def get_tree_dict(self, discussion_id):

        res_graph = requests.get(GRAPH_URL.format(discussion_id=discussion_id))
        res_votes = requests.get(VOTE_URL.format(discussion_id=discussion_id))

        graph = res_graph.json()
        votes = res_votes.json()

        claims = {node['id']: node['text'] for node in graph['claims']}
        votes = votes['votes']

        tree_dict = {}
        for node in graph['locations']:
            if not node['isDeleted']:
                tree_dict[node['targetId']] = {
                    'id': node['targetId'],
                    'parentId': node['parentId'],
                    'relation': node['relation'],
                    'votes': votes.get(node['id'], None),
                    'text': claims.get(node['targetId'], None)
                }
        return tree_dict

    def get_meta_data(self, discussion_id):
        res_meta = requests.get(META_URL.format(discussion_id=discussion_id))
        meta = res_meta.json()

        meta_data = {
            'id': meta['discussion']['id'],
            'title': meta['discussion']['title'],
            'isMultipleChoice': meta['discussion']['isMultipleChoice'],
            'backgroundInfo': meta['discussion']['backgroundInfo'],
            'created': meta['discussion']['created']
        }

        return meta_data

    def get_stats(self, discussion_id):
        res_stats  = requests.get(STATS_URL.format(discussion_id=discussion_id))
        stats = res_stats.json()

        participantStatistics = stats['participantStatistics']
        accountInfos = stats['discussionIdentityInfos']
        ps_df = pd.DataFrame(participantStatistics)
        ac_df = pd.DataFrame(accountInfos)
        df = ps_df.merge(ac_df, left_on='discussionIdentityId', right_on='id')[[
            'name', 'claimAndThesisCount', 'contributionCount', 'voteCount'
        ]]

        stats['participantStatistics'] = list(df.T.to_dict().values())
        stats.pop('discussionIdentityInfos')
        return stats

    def is_multi_thesis(self, tree_dict):
        for node in tree_dict.values():
            if not node['parentId']:
                return  node['text'] != ''

    def get_root(self, tree_dict):
        top_node = None
        for node in tree_dict.values():
            if not node['parentId']:
                top_node = node
                break

        if top_node['text'] != '':
            return top_node

        for node in tree_dict.values():
            if node['parentId'] == top_node['id']:
                return node

    def get_answers(self, tree_dict):
        if not self.is_multi_thesis(tree_dict):
            return []

        root = self.get_root(tree_dict)
        answers = [] 
        for node in tree_dict.values():
            if node['parentId'] == root['id']:
                answers.append(node)

        return answers

    def claim_score(self, votes):
        if not votes or sum(votes) == 0:
            return -1, -1
        vals = np.array(range(1,6))
        votes = np.array(votes)
        return vals.dot(votes) / sum(votes) - 1, sum(votes) 

    def rank_answers(self, tree_dict):
        answers = self.get_answers(tree_dict)
        for answer in answers:
            answer['score'], answer['volume'] = self.claim_score(answer['votes'])

        return sorted(answers, key=lambda x: (-x['score'], -x['volume']))

    def get_claims(self, tree_dict, answer):
        claims = []
        for node in tree_dict.values():
            if node['parentId'] == answer['id']:
                claims.append(node)
        return claims

    def filter_claims(self, claims):
        pros = []
        cons = []
        for claim in claims:
            if claim['relation'] == 1:
                pros.append(claim)
            elif claim ['relation'] == -1:
                cons.append(claim)

        return pros, cons

    def rank_claims(self, tree_dict, answer):
        claims = self.get_claims(tree_dict, answer)
        for claim in claims:
            claim['score'], claim['volume'] = self.claim_score(claim['votes'])

        pros, cons = self.filter_claims(claims)
        return (
            sorted(pros, key=lambda x: (-x['score'], -x['volume'])),
            sorted(cons, key=lambda x: (-x['score'], -x['volume']))
        )

    def get_multi_data(self, tree_dict):
        answers = self.rank_answers(tree_dict)
        claims = [self.rank_claims(tree_dict, answer) for answer in answers]
        return answers, claims

    def get_uni_data(self, tree_dict):
        root = self.get_root(tree_dict)
        claims = self.rank_claims(tree_dict, root)
        return root, claims

    def _np_encoder(self, object):
        if isinstance(object, np.generic):
            return object.item()
            
    def save_data(self, discussion_id):
        tree_dict = self.get_tree_dict(discussion_id)
        meta_data = self.get_meta_data(discussion_id)
        stats_data = self.get_stats(discussion_id)

        if meta_data['isMultipleChoice']:
            answers, claims = self.get_multi_data(tree_dict)
            root = self.get_root(tree_dict)
            data = {
                'answers': answers,
                'claims': claims,
                'root': root,
                'meta': meta_data,
                'stats': stats_data,
            }
        else:
            root, claims = self.get_uni_data(tree_dict)
  
            data = {
                'claims': claims,
                'root': root,
                'meta': meta_data,
                'stats': stats_data,
            }
        
        # with open('data/{}.json'.format(discussion_id), 'w') as outfile:
        #     json.dump(data, outfile, default=self._np_encoder)

        with open('sandbox/data/tree_{}.json'.format(discussion_id), 'w') as outfile:
            json.dump(tree_dict, outfile, default=self._np_encoder)

        return data


if __name__ == '__main__':

    discussion_ids = ['36863', '10436', '14232', '16931', '18046', '25000', '48142']
    data_processor = DataProcessor()

    for discussion_id in discussion_ids:
        print(discussion_id)
        data = data_processor.save_data(discussion_id)