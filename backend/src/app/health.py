from django.http import HttpResponse, JsonResponse
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
import logging

LOGGER = logging.getLogger('watchtower')

def check_health(request):
    if request.method == "GET":
        return HttpResponse("", status=200)


@csrf_exempt
def react_logging(request):

    if request.method == "POST":

        try:
            error = request.POST.get('error')
            error_info = request.POST.get('error_info')

            if not error:
                raise KeyError('Missing error')

            if not error_info:
                raise KeyError('Missing error_info')

            LOGGER.error('{}_{}'.format(error, error_info))

            return JsonResponse({}, status=status.HTTP_201_CREATED)
        except Exception as e:
            LOGGER.error(e)
            print(e)
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)