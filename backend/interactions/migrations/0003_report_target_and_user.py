from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_platformuser_email_verified'),
        ('posts', '0003_remove_post_post_topic_created_idx_and_more'),
        ('interactions', '0002_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='target_type',
            field=models.CharField(choices=[('post', 'Post'), ('user', 'User')], default='post', max_length=20),
        ),
        migrations.AddField(
            model_name='report',
            name='reported_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reported_accounts', to='accounts.platformuser'),
        ),
        migrations.AlterField(
            model_name='report',
            name='post',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reports', to='posts.post'),
        ),
    ]
