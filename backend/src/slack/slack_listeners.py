
from slack_bolt import App, BoltContext
from slack_bolt.oauth.oauth_settings import OAuthSettings
from slack.slack_datastores import DjangoInstallationStore, DjangoOAuthStateStore
from slack.models import SlackInstallation
from slack_sdk.webhook import WebhookClient
from slack_sdk.oauth.state_store import FileOAuthStateStore
from slack_sdk.oauth.installation_store import FileInstallationStore
from django.db.models import F
import logging

LOGGER = logging.getLogger('watchtower')


SLACK_CLIENT_ID = '3915888438528.4194015225764'
SLACK_SIGNING_SECRET= '3b8795608b8c382a9edd2e8e76233b2b'
SLACK_CLIENT_SECRET = 'e05c4c23f1adf85f9cd7f1c4ef6a2d7a'

SLACK_BOT_SCOPE = ['app_mentions:read','chat:write']
SLACK_USER_SCOPE = ['search:read']



oauth_settings=OAuthSettings(
    client_id=SLACK_CLIENT_ID,
    client_secret=SLACK_CLIENT_SECRET,
    scopes=SLACK_BOT_SCOPE,
    user_scopes=SLACK_USER_SCOPE,
    installation_store=DjangoInstallationStore(
        client_id=SLACK_CLIENT_ID,
        logger=LOGGER,
    ),
    state_store=DjangoOAuthStateStore(
        expiration_seconds=120,
        logger=LOGGER,
    ),
)

app = App(
    signing_secret=SLACK_SIGNING_SECRET,
    oauth_settings=oauth_settings
)


@app.event("app_mention")
def event_test(body, say, context: BoltContext, logger):
    logger.info(body)
    say(":wave: What's up?")

    found_rows = list(
        SlackInstallation.objects.filter(enterprise_id=context.enterprise_id)
        .filter(team_id=context.team_id)
        .filter(incoming_webhook_url__isnull=False)
        .order_by(F("installed_at").desc())[:1]
    )
    print(found_rows)
    if len(found_rows) > 0:
        webhook_url = found_rows[0].incoming_webhook_url
        logger.info(f"webhook_url: {webhook_url}")
        client = WebhookClient(webhook_url)
        print(client)
        client.send(text=":wave: This is a message posted using Incoming Webhook!")


# # lazy listener example
# def noop():
#     pass


# app.event("app_mention")(
#     ack=event_test,
#     lazy=[noop],
# )


# @app.command("/hello-django-app")
# def command(ack):
#     ack(":wave: Hello from a Django app :smile:")