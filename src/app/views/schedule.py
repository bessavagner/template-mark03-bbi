import logging
from aiohttp import web
import json

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
            "message": f"{nome}, sua aula está marcada para {data_treino} às {horario}.",
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
                    "message": "Dados inválidos enviados.",
                    "type": "error"
                }
            }, status=400)
        logger.debug("data: %s", data)
        result = await process_schedule_trial(data)
        logger.debug("result: %s", result)
        return web.json_response(result)
