from django.db import models
from django.db.models.functions import Lower
from django.utils import timezone
import json
import secrets


class PlatformUser(models.Model):
	ROLE_ADMIN = 'Administrator'
	ROLE_DEVELOPER = 'Developer'
	ROLE_MODERATOR = 'Moderator'
	ROLE_VERIFIED = 'Verified User'
	ROLE_GENERAL = 'General User'

	ROLE_CHOICES = [
		(ROLE_ADMIN, 'Administrator'),
		(ROLE_DEVELOPER, 'Developer'),
		(ROLE_MODERATOR, 'Moderator'),
		(ROLE_VERIFIED, 'Verified User'),
		(ROLE_GENERAL, 'General User'),
	]

	username = models.CharField(max_length=100, unique=True)
	password_hash = models.CharField(max_length=255, blank=True)
	email = models.EmailField(unique=True)
	email_verified = models.BooleanField(default=False)
	full_name = models.CharField(max_length=255)
	institution = models.CharField(max_length=255, blank=True)
	bio = models.TextField(blank=True)
	tagline = models.CharField(max_length=255, blank=True)
	skills = models.TextField(blank=True, help_text='Comma-separated skills')
	links = models.TextField(blank=True, help_text='JSON: {linkedin, github, website, gscholar, etc}')
	phone_number = models.CharField(max_length=20, blank=True)
	profile_picture = models.URLField(max_length=500, blank=True)
	supabase_id = models.CharField(max_length=255, blank=True, unique=True, null=True)
	role = models.CharField(max_length=30, choices=ROLE_CHOICES, default=ROLE_GENERAL)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']
		constraints = [
			models.UniqueConstraint(Lower('email'), name='accounts_platformuser_email_ci_unique'),
		]

	def __str__(self):
		return f"{self.username} ({self.role})"

	def save(self, *args, **kwargs):
		if self.email:
			self.email = self.email.strip().lower()
		super().save(*args, **kwargs)

	def get_links_dict(self):
		if not self.links:
			return {}
		try:
			return json.loads(self.links)
		except json.JSONDecodeError:
			return {}

	def set_links_dict(self, links_dict):
		self.links = json.dumps(links_dict) if links_dict else ''

	def get_skills_list(self):
		if not self.skills:
			return []
		return [s.strip() for s in self.skills.split(',') if s.strip()]

	def set_skills_list(self, skills_list):
		self.skills = ','.join(skills_list) if skills_list else ''


class AuthToken(models.Model):
	user = models.ForeignKey(PlatformUser, on_delete=models.CASCADE, related_name='tokens')
	key = models.CharField(max_length=64, unique=True, db_index=True)
	created_at = models.DateTimeField(auto_now_add=True)
	expires_at = models.DateTimeField()
	is_revoked = models.BooleanField(default=False)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"{self.user.username} token"

	@classmethod
	def issue_for_user(cls, user, ttl_hours=24):
		expires_at = timezone.now() + timezone.timedelta(hours=ttl_hours)
		return cls.objects.create(user=user, key=secrets.token_hex(32), expires_at=expires_at)

	def is_valid(self):
		return (not self.is_revoked) and self.expires_at > timezone.now()


class EmailToken(models.Model):
	"""Reusable token model for email verification and password reset."""
	PURPOSE_VERIFY = 'verify'
	PURPOSE_RESET = 'reset'
	PURPOSE_CHOICES = [
		(PURPOSE_VERIFY, 'Email Verification'),
		(PURPOSE_RESET, 'Password Reset'),
	]

	user = models.ForeignKey(PlatformUser, on_delete=models.CASCADE, related_name='email_tokens')
	key = models.CharField(max_length=64, unique=True, db_index=True)
	purpose = models.CharField(max_length=10, choices=PURPOSE_CHOICES)
	created_at = models.DateTimeField(auto_now_add=True)
	expires_at = models.DateTimeField()
	is_used = models.BooleanField(default=False)

	@classmethod
	def create_for(cls, user, purpose, ttl_hours=24):
		cls.objects.filter(user=user, purpose=purpose, is_used=False).update(is_used=True)
		expires_at = timezone.now() + timezone.timedelta(hours=ttl_hours)
		return cls.objects.create(user=user, key=secrets.token_urlsafe(32), purpose=purpose, expires_at=expires_at)

	def is_valid(self):
		return (not self.is_used) and self.expires_at > timezone.now()
