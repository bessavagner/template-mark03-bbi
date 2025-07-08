import logging
from aiohttp import web
import json

from app.forms.schedule import ScheduleForm
from app.utils import send_confirmation_email, notify_admin_schedule


logger = logging.getLogger(__name__)

class ScheduleTrialView(web.View):
    async def post(self):
        try:
            data = await self.request.json()
        except json.JSONDecodeError:
            return web.json_response({
                "success": False,
                "popup": {
                    "title": "Erro",
                    "message": "JSON inválido.",
                    "type": "error"
                }
            }, status=400)

        form = ScheduleForm(data)
        if not form.is_valid():
            response = web.json_response({
                "success": False,
                "errors": form.errors,
                "popup": {
                    "title": "Erro de validação",
                    "message": "Verifique os campos preenchidos.",
                    "type": "error"
                }
            }, status=422)
            logger.error("Formulário inválido: %s", form.errors)
            return response

        cleaned = form.cleaned_data
        logger.info("Agendamento validado: %s", cleaned)
        # ✅ ENVIO DO E-MAIL DE CONFIRMAÇÃO
        try:
            logger.debug("Enviando e-mail de confirmação para %s", cleaned["email"])
            await send_confirmation_email(
                nome_sobrenome=cleaned["nome_sobrenome"],
                user_email=cleaned["email"],
                telefone=cleaned["telefone"],
                data=cleaned["data"],
                horario=cleaned["horario"]
            )
            await notify_admin_schedule(cleaned)
        except Exception:
            logger.exception("Erro ao enviar e-mail de confirmação para o usuário.")

        # ✅ RESPOSTA AO CLIENTE
        response = web.json_response({
            "success": True,
            "popup": {
                "title": "Agendamento recebido",
                "message": (
                    f"{cleaned['nome_sobrenome']}, recebemos seu agendamento. "
                    "Você receberá um e-mail de confirmação em breve."
                ),
                "type": "success"
            }
        })
        logger.debug("Resposta enviada ao cliente: %s", response)
        return response
