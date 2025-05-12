from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, To, From
import logging


LOGGER = logging.getLogger('watchtower')


SENDGRID_API_KEY = '...'
template_id = 'd-914c7bd93e994deb9d1c5f47bb80b75b'


class EmailOps:

    @staticmethod
    def send_email(to_emails, sender, dynamic_template_data=None):

        formatted_to_emails = [
            To(
                email=email, 
                dynamic_template_data = dict(dynamic_template_data, **{'email': email})
            ) for email in to_emails
        ]  

        from_email = From(
            email='Motivee@getmotivee.com',
            name='{} via Motivee'.format(sender) 
        )

        message = Mail(
            from_email=from_email,
            to_emails=formatted_to_emails,
            is_multiple=isinstance(to_emails, list)
        )
        if template_id:
            message.template_id = template_id

        if dynamic_template_data and not isinstance(to_emails, list):
            message.dynamic_template_data = dynamic_template_data

        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            LOGGER.error(e)


if __name__ == '__main__':

    EmailOps.send_email(
        to_emails=['damien@getmotivee.com'],
        sender='damien.benveniste@gmail.com',
        dynamic_template_data={
            'workspace_name': 'test damien',
            "subject": 'Join the Motivee workspace "{}"'.format('Test damien2'),
            'sender': 'damien.benveniste@gmail.com',
            'email': 'damien@getmotivee.com',
            'id': 3
        }
    )

