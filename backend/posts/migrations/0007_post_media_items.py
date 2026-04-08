from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0006_post_is_hidden'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='media_items',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
