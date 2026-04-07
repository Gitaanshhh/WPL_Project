import logging

from django.http import JsonResponse

from accounts.auth import get_authenticated_user, get_effective_role
from accounts.models import PlatformUser


logger = logging.getLogger(__name__)


class ApiExceptionLoggingMiddleware:
    """Log unhandled API exceptions and expose details to admin/dev users only."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        path = request.path or ''
        if not path.startswith('/api/'):
            return None

        logger.exception('Unhandled API exception on %s %s', request.method, path)

        actor = None
        actor_role = None
        try:
            actor = get_authenticated_user(request)
            if actor:
                actor_role = get_effective_role(request, actor)
        except Exception:
            logger.exception('Failed to resolve actor while handling API exception.')

        payload = {'detail': 'An unexpected server error occurred.'}
        if actor and actor_role in {PlatformUser.ROLE_ADMIN, PlatformUser.ROLE_DEVELOPER}:
            payload.update(
                {
                    'error_type': exception.__class__.__name__,
                    'error': str(exception),
                }
            )

        return JsonResponse(payload, status=500)
