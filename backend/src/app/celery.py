# import os
# from celery import Celery
# from celery.schedules import crontab
# # from django.conf import settings
# # from django.conf import settings
# from app import settings

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')

# app = Celery('django_app')

# # Using a string here means the worker don't have to serialize
# # the configuration object to child processes.
# # - namespace='CELERY' means all celery-related configuration keys
# #   should have a `CELERY_` prefix.
# app.config_from_object('django.conf:settings', namespace='CELERY')

# # Load task modules from all registered Django app configs.
# app.autodiscover_tasks()


# os.environ.setdefault(
#     'DJANGO_SETTINGS_MODULE',
#     os.environ['DJANGO_SETTINGS_FILE']
# )

# app = Celery('django_celery')

# CELERY_CONFIG = {
#     'task_serializer': 'json',
#     'accept_content': ['json'],
#     'result_serializer': 'json',
#     'result_backend': None,
#     'worker_enable_remote_control': False,
# }

# # broker_url = 'sqs://'
# broker_url = 'sqs://{}:{}@'.format(
#     settings.AWS_ACCESS_KEY_ID,
#     settings.AWS_SECRET_ACCESS_KEY
# )

# # if os.environ.get('ENV') == 'production':  # checking if we are on AWS EBS or in local env
# CELERY_CONFIG.update(  # settings for prod and test environments
#     **{
#         'broker_url': broker_url,
#         'broker_transport': 'sqs',
#         'broker_transport_options ': {
#             'region': settings.AWS_S3_REGION_NAME,
#             'visibility_timeout': 3600,
#             'polling_interval': 60,
#         },
#     }
# )


# app.conf.update(**CELERY_CONFIG)
# app.autodiscover_tasks()

# app.conf.beat_schedule = {
#     'import_coaches': {
#         'task': 'gsheets.tasks.import_coaches',
#         'schedule': crontab(minute='*/1'),
#         'options': {
#             'queue': os.environ.get('MAIN_QUEUE')
#         }
#     }
# }
