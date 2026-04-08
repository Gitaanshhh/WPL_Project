import json
import urllib.error
import urllib.parse
import urllib.request

from django.conf import settings


def _bucket_name():
    return getattr(settings, 'SUPABASE_PROFILE_BUCKET', 'profile-pictures')


def _signed_url_ttl_seconds():
    raw = getattr(settings, 'SUPABASE_SIGNED_URL_TTL_SECONDS', 300)
    try:
        return max(30, min(int(raw), 3600))
    except (TypeError, ValueError):
        return 300


def _extract_storage_path(value):
    if not value:
        return None

    raw = str(value).strip()
    if not raw:
        return None

    if raw.startswith('profiles/'):
        return raw

    base_url = settings.SUPABASE_URL.rstrip('/')
    bucket = _bucket_name()

    public_prefix = f"{base_url}/storage/v1/object/public/{bucket}/"
    sign_prefix = f"{base_url}/storage/v1/object/sign/{bucket}/"
    object_prefix = f"{base_url}/storage/v1/object/{bucket}/"

    for prefix in (public_prefix, sign_prefix, object_prefix):
        if raw.startswith(prefix):
            tail = raw[len(prefix):]
            tail = tail.split('?', 1)[0]
            return urllib.parse.unquote(tail)

    return None


def create_signed_url_for_path(path, expires_in=None):
    service_role_key = settings.SUPABASE_SERVICE_ROLE_KEY
    if not service_role_key or not settings.SUPABASE_URL:
        return None

    ttl_seconds = expires_in or _signed_url_ttl_seconds()
    bucket = _bucket_name()
    encoded_path = urllib.parse.quote(path, safe='/')
    sign_url = f"{settings.SUPABASE_URL.rstrip('/')}/storage/v1/object/sign/{bucket}/{encoded_path}"

    request = urllib.request.Request(
        sign_url,
        method='POST',
        data=json.dumps({'expiresIn': ttl_seconds}).encode('utf-8'),
        headers={
            'apikey': service_role_key,
            'authorization': f'Bearer {service_role_key}',
            'content-type': 'application/json',
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            payload = json.loads(response.read().decode('utf-8') or '{}')
            signed_url = payload.get('signedURL') or payload.get('signedUrl')
            if not signed_url:
                return None
            if signed_url.startswith('http://') or signed_url.startswith('https://'):
                return signed_url
            if signed_url.startswith('/storage/v1/'):
                return f"{settings.SUPABASE_URL.rstrip('/')}{signed_url}"
            if signed_url.startswith('/object/sign/'):
                return f"{settings.SUPABASE_URL.rstrip('/')}/storage/v1{signed_url}"
            if signed_url.startswith('/'):
                return f"{settings.SUPABASE_URL.rstrip('/')}{signed_url}"
            return f"{settings.SUPABASE_URL.rstrip('/')}/storage/v1/{signed_url}"
    except (urllib.error.HTTPError, urllib.error.URLError, ValueError):
        return None


def resolve_profile_picture_url(value):
    path = _extract_storage_path(value)
    if path:
        signed_url = create_signed_url_for_path(path)
        if signed_url:
            return signed_url
    return value or ''


def normalize_profile_picture_value_for_storage(value):
    path = _extract_storage_path(value)
    if path:
        return path
    return value or ''
