import logging
from aiohttp import web
import json

from app.forms.schedule import ScheduleForm

logger = logging.getLogger(__name__)


async def process_schedule_trial(data: dict) -> dict:
    """
    Simula o processamento do agendamento de uma aula experimental.
    Substitua por lógica real posteriormente.
    """
    nome = data.get("nome_sobrenome", "aluno(a)")
    horario = data.get("horario", "")
    data_treino = data.get("data", "")

    return {
        "success": True,
        "popup": {
            "title": "Agendamento confirmado!",
            "message": (
                f"{nome}, sua aula está marcada"
                f" para {data_treino} às {horario}."
            ),
            "type": "success",
        }
    }


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
            return web.json_response({
                "success": False,
                "errors": form.errors,
                "popup": {
                    "title": "Erro de validação",
                    "message": "Verifique os campos preenchidos.",
                    "type": "error"
                }
            }, status=422)

        # Aqui poderemos chamar o serviço de envio de e-mail futuramente
        cleaned = form.cleaned_data
        logger.info("Agendamento validado: %s", cleaned)

        return web.json_response({
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
