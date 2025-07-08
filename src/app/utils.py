import html
import logging
from email.message import EmailMessage

import aiosmtplib
from jinja2 import Template

from .config import settings

logger = logging.getLogger(__name__)


async def send_email(subject: str, recipients: list, body: str, sender: str = None):
    """
    Sends an HTML email with fallback text using SMTP.
    """
    if not settings.EMAIL_ENABLED:
        logger.warning("[EMAIL DISABLED] Would send to: %s", recipients)
        print(f"[DEBUG EMAIL HTML]\nTo: {recipients}\nSubject: {subject}\n{body}")
        return

    sender = sender or settings.EMAIL_DEFAULT_SENDER
    message = EmailMessage()
    message["From"] = sender
    message["To"] = ", ".join(recipients)
    message["Subject"] = subject

    # Fallback plain text + HTML
    message.set_content("Seu cliente não consegue ver HTML.")
    message.add_alternative(body, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.EMAIL_HOST,
            port=settings.EMAIL_PORT,
            username=settings.EMAIL_USERNAME,
            password=settings.EMAIL_PASSWORD,
            use_tls=settings.EMAIL_USE_TLS,
        )
    except Exception as e:
        logger.exception("Erro ao enviar e-mail para %s", recipients)


async def send_confirmation_email(
    nome_sobrenome: str,
    user_email: str,
    telefone: str,
    data: str,
    horario: str,
    sender: str = None,
):
    """
    Sends a confirmation email to the user who scheduled a training session.
    """
    sender = sender or settings.EMAIL_DEFAULT_SENDER
    subject = "Seu agendamento foi confirmado!"

    context = {
        "nome_sobrenome": nome_sobrenome,
        "telefone": html.escape(telefone),
        "data": html.escape(data),
        "horario": html.escape(horario),
    }

    template_path = settings.TEMPLATES_DIR / "emails" / "schedule_confirmation.html"
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            template = Template(f.read())
            html_content = template.render(**context)
    except Exception as e:
        logger.exception("Erro ao carregar template de e-mail.")
        return

    if not settings.EMAIL_ENABLED:
        logger.warning("[EMAIL DISABLED] Would send to: %s", user_email)
        print(f"[DEBUG EMAIL HTML]\nTo: {user_email}\n{html_content}")
        return

    message = EmailMessage()
    message["From"] = sender
    message["To"] = user_email
    message["Subject"] = subject
    message.add_alternative(html_content, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.EMAIL_HOST,
            port=settings.EMAIL_PORT,
            username=settings.EMAIL_USERNAME,
            password=settings.EMAIL_PASSWORD,
            use_tls=settings.EMAIL_USE_TLS,
        )
    except Exception as e:
        logger.exception("Erro ao enviar e-mail de confirmação para %s", user_email)

async def notify_admin_schedule(cleaned: dict, sender: str = None):
    """
    Envia os dados do agendamento do cliente para o admin do sistema.
    """
    sender = sender or settings.EMAIL_DEFAULT_SENDER
    subject = "Novo agendamento de treino recebido"
    admin_email = settings.EMAIL_DEFAULT_SENDER

    context = {
        "nome_sobrenome": html.escape(cleaned["nome_sobrenome"]),
        "email": html.escape(cleaned["email"]),
        "telefone": html.escape(cleaned["telefone"]),
        "data": html.escape(cleaned["data"]),
        "horario": html.escape(cleaned["horario"]),
    }

    path = settings.TEMPLATES_DIR / "emails" / "schedule_notify_admin.html"
    try:
        with open(path, "r", encoding="utf-8") as f:
            template = Template(f.read())
            html_content = template.render(**context)
    except Exception as err:
        logger.exception("Erro ao carregar template de notificação para admin: %s", err)
        return

    await send_email(
        subject=subject,
        recipients=[admin_email],
        body=html_content,
        sender=sender
    )
