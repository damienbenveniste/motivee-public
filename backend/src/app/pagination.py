
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class Pagination(PageNumberPagination):

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })


class LargePagination(Pagination):
    page_size = 60
    page_size_query_param = 'page_size'
    max_page_size = 60


class SmallPagination(Pagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 15
