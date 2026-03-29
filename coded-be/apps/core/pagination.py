from rest_framework.pagination import PageNumberPagination
from .responses import standard_response

class StandardResultsSetPagination(PageNumberPagination):
    """
    Paginação padrão que segue o formato solicitado pelo frontend:
    {
      "success": true,
      "data": {
        "data": [...],
        "pagination": {
          "total": 100,
          "page": 1,
          "limit": 10,
          "totalPages": 10
        }
      }
    }
    """
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 100

    def get_paginated_response(self, data):
        return standard_response(
            data={
                "data": data,
                "pagination": {
                    "total": self.page.paginator.count,
                    "page": self.page.number,
                    "limit": self.page.paginator.per_page,
                    "totalPages": self.page.paginator.num_pages,
                }
            }
        )
