# app/middlewares/security.py
import logging
import datetime
from datetime import timezone
from collections import defaultdict
from aiohttp import web

from app.config import settings


logger = logging.getLogger(__name__)

rate_limit_data = defaultdict(list)  # IP → [timestamps]
MAX_REQUESTS_PER_MINUTE = 200


def get_client_ip(request: web.Request) -> str:
    return request.headers.get("X-Forwarded-For", request.remote)


@web.middleware
async def security_headers_middleware(request, handler):
    response = await handler(request)
    response.headers.update({
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Strict-Transport-Security": (
            "max-age=31536000; includeSubDomains; preload"
        ),
        "Content-Security-Policy": (
            "default-src 'self'; "
            "style-src 'self' https://fonts.googleapis.com 'unsafe-hashes'; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https://maps.gstatic.com https://maps.googleapis.com; "
            "script-src 'self' https://maps.googleapis.com 'unsafe-inline' 'wasm-unsafe-eval'; "
            "connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://www.gstatic.com; "
            "worker-src 'self' blob:; "
            "frame-ancestors 'none'; "
            "base-uri 'self'"
        )
    })
    return response



@web.middleware
async def rate_limit_middleware(request, handler):
    
    ip = get_client_ip(request)
    now = datetime.datetime.now(timezone.utc)
    requests = rate_limit_data[ip]

    # Remove entradas antigas
    one_minute_ago = now - datetime.timedelta(minutes=1)
    rate_limit_data[ip] = [ts for ts in requests if ts > one_minute_ago]

    if len(rate_limit_data[ip]) >= MAX_REQUESTS_PER_MINUTE:
        return web.json_response({
            "success": False,
            "popup": {
                "title": "Limite de requisições",
                "message": (
                    "Você excedeu o limite de requisições. "
                    "Tente novamente em breve."
                ),
                "type": "error"
            }
        }, status=429)

    rate_limit_data[ip].append(now)
    return await handler(request)

@web.middleware
async def csrf_protection_middleware(request, handler):
    # Só valida em métodos mutáveis
    if request.method in ("POST", "PUT", "DELETE"):
        origin = request.headers.get("Origin")
        referer = request.headers.get("Referer")

        trusted = set(settings.ALLOWED_HOSTS)
        logger.debug("Verificando CSRF: origin=%s, referer=%s, trusted=%s", origin, referer, trusted)
        if origin and origin not in trusted:
            logger.warning("Requisição bloqueada por CSRF: origin=%s, referer=%s", origin, referer)
            return web.json_response({
                "success": False,
                "popup": {
                    "title": "Requisição bloqueada",
                    "message": "Origem não autorizada.",
                    "type": "error"
                }
            }, status=403)

        if referer and not any(referer.startswith(t) for t in trusted):
            logger.warning("Requisição bloqueada por CSRF: referer=%s", referer)
            return web.json_response({
                "success": False,
                "popup": {
                    "title": "Requisição suspeita",
                    "message": "Referer inválido detectado.",
                    "type": "error"
                }
            }, status=403)

    return await handler(request)

@web.middleware
async def nonce_middleware(request, handler):
    import base64, os
    nonce = base64.b64encode(os.urandom(16)).decode("utf-8")

    request["nonce"] = nonce
    response = await handler(request)  # aqui a view roda

    # Aqui montamos o CSP com o nonce
    response.headers["Content-Security-Policy"] = (
        f"default-src 'self'; "
        f"style-src 'self' https://fonts.googleapis.com 'nonce-{nonce}'; "
        f"script-src 'self' https://maps.googleapis.com 'nonce-{nonce}' 'wasm-unsafe-eval'; "
        f"img-src 'self' data: https://maps.gstatic.com https://maps.googleapis.com; "
        f"font-src 'self' https://fonts.gstatic.com; "
        f"connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://www.gstatic.com data:; "
        f"worker-src 'self' blob:; "
        f"frame-ancestors 'none'; "
        f"base-uri 'self';"
    )
    return response

