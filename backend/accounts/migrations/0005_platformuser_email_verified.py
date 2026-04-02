from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_platformuser_profile_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='platformuser',
            name='email_verified',
            field=models.BooleanField(default=False),
        ),
    ]
