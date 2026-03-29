from rest_framework.response import Response
from rest_framework import status

def standard_response(data=None, message="Operação realizada com sucesso", status_code=status.HTTP_200_OK, success=True, response_type="success"):

    return Response({
        "success": success,
        "message": message,
        "data": data,
        "type": response_type
    }, status=status_code)
