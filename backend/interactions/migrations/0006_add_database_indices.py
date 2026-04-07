# Generated migration for database indices

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('interactions', '0005_alter_conversation_unique_together_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vote',
            name='user',
            field=models.ForeignKey(db_index=True, on_delete=models.CASCADE, related_name='votes', to='accounts.platformuser'),
        ),
        migrations.AlterField(
            model_name='vote',
            name='post',
            field=models.ForeignKey(db_index=True, on_delete=models.CASCADE, related_name='votes', to='posts.post'),
        ),
        migrations.AddIndex(
            model_name='vote',
            index=models.Index(fields=['post'], name='interactions_vote_post_idx'),
        ),
        migrations.AlterField(
            model_name='report',
            name='reporter',
            field=models.ForeignKey(db_index=True, on_delete=models.CASCADE, related_name='reports', to='accounts.platformuser'),
        ),
        migrations.AlterField(
            model_name='report',
            name='target_type',
            field=models.CharField(choices=[('post', 'Post'), ('user', 'User')], db_index=True, default='post', max_length=20),
        ),
        migrations.AlterField(
            model_name='report',
            name='post',
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=models.CASCADE, related_name='reports', to='posts.post'),
        ),
        migrations.AlterField(
            model_name='report',
            name='reported_user',
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=models.CASCADE, related_name='reported_accounts', to='accounts.platformuser'),
        ),
        migrations.AlterField(
            model_name='report',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('resolved', 'Resolved'), ('rejected', 'Rejected')], db_index=True, default='pending', max_length=20),
        ),
        migrations.AlterField(
            model_name='report',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AddIndex(
            model_name='report',
            index=models.Index(fields=['-created_at', 'status'], name='interactions_report_created_status_idx'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='author',
            field=models.ForeignKey(db_index=True, on_delete=models.CASCADE, related_name='comments', to='accounts.platformuser'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='post',
            field=models.ForeignKey(db_index=True, on_delete=models.CASCADE, related_name='comments', to='posts.post'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='is_deleted',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name='comment',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AddIndex(
            model_name='comment',
            index=models.Index(fields=['post', '-created_at'], name='interactions_comment_post_created_idx'),
        ),
    ]
