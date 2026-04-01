import json

from django.http import JsonResponse

from .models import AuthToken
from .models import PlatformUser


def get_bearer_token(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header.lower().startswith('bearer '):
        return None
    return auth_header.split(' ', 1)[1].strip()


def get_authenticated_user(request):
    token_key = get_bearer_token(request)
    if not token_key:
        return None

    token = AuthToken.objects.select_related('user').filter(key=token_key).first()
    if not token or not token.is_valid() or not token.user.is_active:
        return None

    return token.user


def get_allowed_role_switch_targets(user):
    if not user:
        return []

    if user.role == PlatformUser.ROLE_ADMIN:
        return [choice[0] for choice in PlatformUser.ROLE_CHOICES]

    if user.role == PlatformUser.ROLE_DEVELOPER:
        return [PlatformUser.ROLE_VERIFIED, PlatformUser.ROLE_GENERAL]

    return []


def get_effective_role(request, user=None):
    actor = user or get_authenticated_user(request)
    if not actor:
        return None

    requested_role = (request.META.get('HTTP_X_ACTING_ROLE') or '').strip()
    if not requested_role:
        return actor.role

    if requested_role in set(get_allowed_role_switch_targets(actor)):
        return requested_role

    return actor.role


def parse_json_body(request):
    try:
        return json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return None


def unauthorized_response(detail='Authentication required.'):
    return JsonResponse({'detail': detail}, status=401)
