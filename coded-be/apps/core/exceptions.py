from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_detail = response.data
        message = "Ocorreu um erro ao processar sua solicitação."

        if response.status_code == 400:
            message = "Erro de validação. Verifique os campos enviados."
        elif response.status_code == 401:
            message = "Não autorizado. Faça o login novamente."
        elif response.status_code == 403:
            message = "Você não tem permissão para realizar esta ação."
        elif response.status_code == 404:
            message = "O recurso solicitado não foi encontrado."

        if isinstance(error_detail, dict) and "detail" in error_detail:
            message = error_detail["detail"]
        elif isinstance(error_detail, dict):
             first_field = next(iter(error_detail))
             if isinstance(error_detail[first_field], list):
                 message = f"{first_field}: {error_detail[first_field][0]}"

        response.data = {
            "success": False,
            "message": message,
            "error": error_detail,
            "type": "error"
        }

    return response
