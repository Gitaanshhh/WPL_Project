from django.db import migrations, models
from django.db.models.functions import Lower


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_emailtoken'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='platformuser',
            constraint=models.UniqueConstraint(Lower('email'), name='accounts_platformuser_email_ci_unique'),
        ),
    ]
