from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, To, From
from login.authentication import generate_link
import logging


LOGGER = logging.getLogger('watchtower')


SENDGRID_API_KEY = '...'
verify_email_template_id = '...'
reset_password_template_id = '...'
signin_template_id = '...'


class EmailLogin:

    @classmethod
    def send_verify_email(cls, email, dynamic_template_data=None):

        formatted_to_email = [
            To(
                email=email, dynamic_template_data=dynamic_template_data
            )
        ]

        from_email = From(
            email='Motivee@getmotivee.com',
            name='Motivee'
        )

        message = Mail(
            from_email=from_email,
            to_emails=formatted_to_email,
            is_multiple=False
        )

        message.template_id = verify_email_template_id
        message.dynamic_template_data = dynamic_template_data

        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            LOGGER.error(e)

    @classmethod
    def send_reset_password_email(cls, email, dynamic_template_data=None):

        formatted_to_email = [
            To(
                email=email, dynamic_template_data=dynamic_template_data
            )
        ]

        from_email = From(
            email='Motivee@getmotivee.com',
            name='Motivee'
        )

        message = Mail(
            from_email=from_email,
            to_emails=formatted_to_email,
            is_multiple=False
        )

        message.template_id = reset_password_template_id
        message.dynamic_template_data = dynamic_template_data

        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            LOGGER.error(e)

    @classmethod
    def send_signin_email(cls, email, dynamic_template_data=None):

        formatted_to_email = [
            To(
                email=email, dynamic_template_data=dynamic_template_data
            )
        ]

        from_email = From(
            email='Motivee@getmotivee.com',
            name='Motivee'
        )

        message = Mail(
            from_email=from_email,
            to_emails=formatted_to_email,
            is_multiple=False
        )

        message.template_id = signin_template_id
        message.dynamic_template_data = dynamic_template_data

        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            LOGGER.error(e)

    @classmethod
    def sendEmail(cls, email, email_type):
        link = generate_link(email_type, email)
        if email_type == 'signin':
            return cls.send_signin_email(
                email=email,
                dynamic_template_data={
                    'action_url': link,
                    'email': email
                }
            )
        if email_type == 'resetPassword':
            return cls.send_reset_password_email(
                email=email,
                dynamic_template_data={
                    'action_url': link,
                    'email': email
                }
            )
        if email_type == 'verifyEmail':
           return cls.send_verify_email(
                email=email,
                dynamic_template_data={
                    'action_url': link,
                    'email': email
                }
            )


if __name__ == '__main__':

    EmailLogin.send_signin_email(
        email='damien.benveniste@gmail.com',
        dynamic_template_data={
            'action_url': 'https://www.google.com/',
            'email': 'damien.benveniste@gmail.com'
        }
    )
